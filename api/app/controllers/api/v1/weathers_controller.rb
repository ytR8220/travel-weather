# frozen_string_literal: true

module Api
  module V1
    class WeathersController < ApplicationController
      require 'httpclient'
      require 'uri'
      before_action :set_api_key

      # 天気情報を取得する
      def get_weather_data
        city_name = params[:city]
        city = City.find_by(name: city_name)
        base_date = DateTime.parse(params[:date] || Time.now.strftime('%Y-%m-%d %H:00:00'))

        # 都市と国のデータがない場合は作成する
        unless city
          get_coordinates

          return if performed?
          
          city = City.find_by(lat: @lat, lon: @lon)
          unless city
            country = Country.find_or_create_by(name: @country)
            if country.errors.any?
              render json: { error: country.errors.full_messages }, status: :unprocessable_entity
              return
            end

            city = City.create(name: city_name, country_id: country.id, lat: @lat, lon: @lon)
            unless city.save
              render json: { error: city.errors.full_messages }, status: :unprocessable_entity
              return
            end
          end
        end

        # すでにデータがある場合はそれを取得(現在、3時間後、6時間後、12時間後のデータ)
        existing_dates_data = fetch_existing_dates_data(city.id, base_date)

        # すでにデータがある場合はそれを取得(明日から5日後までのデータ)
        existing_days_data = fetch_existing_days_data(city.id, base_date)

        # すでにデータがある場合はそれを返すが、なければ外部APIから取得してDBに保存する
        if existing_dates_data.length < 4 || existing_days_data.length < 5
          get_coordinates

          # APIを叩いてデータを取得
          url = "https://api.openweathermap.org/data/3.0/onecall?lat=#{@lat}&lon=#{@lon}&exclude=minutely&appid=#{@api_key}&units=metric&lang=ja"
          client = HTTPClient.new
          response = client.get(url)
          parsed_response = JSON.parse(response.body)

          success = true
          saved_data = []

          # 現在、3時間後、6時間後、12時間後のデータを取得
          if existing_dates_data.length < 4
            save_hours = [0, 3, 6, 12]
            save_hours.each do |hour|
              date_time = Time.at(parsed_response.dig('hourly', hour, 'dt')).strftime('%Y-%m-%d %H:%M:%S')

              weather_data = Weather.find_or_initialize_by(city_id: city.id, date_time: date_time)

              weather_data.assign_attributes(
                weather: parsed_response.dig('hourly', hour, 'weather', 0, 'main'),
                temp: parsed_response.dig('hourly', hour, 'temp'),
                temp_max: parsed_response.dig('daily', 0, 'temp', 'max'),
                temp_min: parsed_response.dig('daily', 0, 'temp', 'min'),
                humidity: parsed_response.dig('daily', 0, 'humidity'),
                description: parsed_response.dig('hourly', hour, 'weather', 0, 'description'),
                alert: parsed_response.dig('alerts', 0, 'description'),
                icon: parsed_response.dig('hourly', hour, 'weather', 0, 'icon')
              )

              if weather_data.save
                saved_data << weather_data
              else
                success = false
              end
            end
          end

          # 明日から5日後までのデータを取得
          if existing_days_data.length < 5
            save_days = [1, 2, 3, 4, 5]
            save_days.each do |day|
              date_time = Time.at(parsed_response.dig('daily', day, 'dt')).strftime('%Y-%m-%d %H:%M:%S')

              weather_data = Weather.find_or_initialize_by(city_id: city.id, date_time:)

              weather_data.assign_attributes(
                weather: parsed_response.dig('daily', day, 'weather', 0, 'main'),
                temp: parsed_response.dig('daily', day, 'temp', 'day'),
                temp_max: parsed_response.dig('daily', day, 'temp', 'max'),
                temp_min: parsed_response.dig('daily', day, 'temp', 'min'),
                humidity: parsed_response.dig('daily', day, 'humidity'),
                description: parsed_response.dig('daily', day, 'weather', 0, 'description'),
                alert: parsed_response.dig('alerts', 0, 'description'),
                icon: parsed_response.dig('daily', day, 'weather', 0, 'icon')
              )

              if weather_data.save
                saved_data << weather_data
              else
                success = false
              end
            end
          end

          if success
            updated_existing_dates_data = fetch_existing_dates_data(city.id, base_date)
            updated_existing_days_data = fetch_existing_days_data(city.id, base_date)
            render json: updated_existing_dates_data + updated_existing_days_data, status: :created
          else
            render json: weather_data.errors, status: :unprocessable_entity
          end
        else
          render json: existing_dates_data + existing_days_data, status: :ok
        end
      end

      private

      # APIキーをセットする
      def set_api_key
        @api_key = ENV['WEATHER_API']
      end

      # 経度緯度を取得する関数
      def get_coordinates
        city = params[:city]
        encode_city = URI.encode_www_form_component(city)
        url = "http://api.openweathermap.org/geo/1.0/direct?q=#{encode_city},&appid=#{@api_key}"
        client = HTTPClient.new

        begin
          response = client.get(url)

          unless response.status == 200
            render json: { error: "APIエラー:#{response.status}" }, status: :bad_gateway
            return
          end

          coordinates = JSON.parse(response.body)

          if coordinates.empty? || coordinates[0]['lat'].nil? || coordinates[0]['lon'].nil?
            render json: { error: 'データの取得に失敗しました。都市名が誤っている可能性があります。' }, status: :not_found
            return
          end

          @lat = coordinates[0]['lat']
          @lon = coordinates[0]['lon']
          @country = coordinates[0]['country']
        rescue HTTPClient::BadResponseError, HTTPClient::TimeoutError, JSON::ParserError => e
          render json: { error: e.message.to_s }, status: :bad_gateway
        end
      end

      # すでにデータがある場合はそれを取得する関数（現在、3時間後、6時間後、12時間後のデータ）
      def fetch_existing_dates_data(city_id, base_date)
        dates_to_check = [
          base_date,
          base_date + 3.hours,
          base_date + 6.hours,
          base_date + 12.hours
        ]
        Weather.where(city_id: city_id, date_time: dates_to_check)
      end

      # すでにデータがある場合はそれを取得する関数（明日から5日後までのデータ）
      def fetch_existing_days_data(city_id, base_date)
        days_to_check = [
          base_date.tomorrow.midday,
          base_date.tomorrow.midday + 1.day,
          base_date.tomorrow.midday + 2.days,
          base_date.tomorrow.midday + 3.days,
          base_date.tomorrow.midday + 4.days
        ]
        Weather.where(city_id: city_id, date_time: days_to_check)
      end
    end
  end
end
