# frozen_string_literal: true

module Api
  module V1
    # 天気情報を取得するコントローラー
    class WeathersController < ApplicationController
      before_action :set_api_key, :get_coordinates

      # 天気情報を取得する関数
      def get_weather_data
        city_name = params[:city]
        city = City.find_by(name: city_name)
        base_date = DateTime.parse(params[:date] || Time.now.strftime('%Y-%m-%d %H:00:00'))

        unless city
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

        existing_times_data = fetch_existing_times_data(city.id, base_date, :hourly)
        existing_days_data = fetch_existing_days_data(city.id, base_date, :daily)


        if existing_times_data.length < 4 || existing_days_data.length < 5

          url = "https://api.openweathermap.org/data/3.0/onecall?lat=#{@lat}&lon=#{@lon}&exclude=minutely&appid=#{@api_key}&units=metric&lang=ja"
          client = HTTPClient.new
          response = client.get(url)
          parsed_response = JSON.parse(response.body)

          success = true
          saved_data = []

          success = save_weather_data(parsed_response, [0, 3, 6, 12], :hourly, city.id, saved_data) if existing_times_data.length < 4

          success = save_weather_data(parsed_response, [1, 2, 3, 4, 5], :daily, city.id, saved_data) if existing_days_data.length < 5

          if success
            updated_existing_times_data = fetch_existing_times_data(city.id, base_date, :hourly)
            updated_existing_days_data = fetch_existing_days_data(city.id, base_date, :daily)
            render json: updated_existing_times_data + updated_existing_days_data, status: :created
          else
            render json: weather_data.errors, status: :unprocessable_entity
          end
        else
          render json: existing_times_data + existing_days_data, status: :ok
        end
      end

      private

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
      def fetch_existing_times_data(city_id, base_date, data_type)
        times_to_check = [
          base_date,
          base_date + 3.hours,
          base_date + 6.hours,
          base_date + 12.hours
        ]
        Weather.where(city_id:, date_time: times_to_check, data_type:).distinct
      end

      # すでにデータがある場合はそれを取得する関数（明日から5日後までのデータ）
      def fetch_existing_days_data(city_id, base_date, data_type)
        days_to_check = [
          base_date + 1.day,
          base_date + 2.days,
          base_date + 3.days,
          base_date + 4.days,
          base_date + 5.days
        ]
        Weather.where(city_id:, data_type:).with_dates(days_to_check).distinct
      end

      # 天気情報を保存する関数
      def save_weather_data(parsed_response, times, type, city_id, saved_data)
        times.each do |time|
          if type == :hourly
            date_time = Time.at(parsed_response.dig('hourly', time, 'dt')).strftime('%Y-%m-%d %H:%M:%S')
            weather_data = Weather.find_or_initialize_by(city_id:, date_time:, data_type: type)
            attributes = {
              weather: parsed_response.dig('hourly', time, 'weather', 0, 'main'),
              temp: parsed_response.dig('hourly', time, 'temp'),
              temp_max: parsed_response.dig('daily', 0, 'temp', 'max'),
              temp_min: parsed_response.dig('daily', 0, 'temp', 'min'),
              humidity: parsed_response.dig('daily', 0, 'humidity'),
              description: parsed_response.dig('hourly', time, 'weather', 0, 'description'),
              alert: parsed_response.dig('alerts', 0, 'description'),
              icon: parsed_response.dig('hourly', time, 'weather', 0, 'icon'),
              data_type: type
            }
          elsif type == :daily
            date_time = Time.at(parsed_response.dig('daily', time, 'dt')).strftime('%Y-%m-%d %H:%M:%S')
            weather_data = Weather.find_or_initialize_by(city_id:, date_time:, data_type: type)
            attributes = {
              weather: parsed_response.dig('daily', time, 'weather', 0, 'main'),
              temp: parsed_response.dig('daily', time, 'temp', 'day'),
              temp_max: parsed_response.dig('daily', time, 'temp', 'max'),
              temp_min: parsed_response.dig('daily', time, 'temp', 'min'),
              humidity: parsed_response.dig('daily', time, 'humidity'),
              description: parsed_response.dig('daily', time, 'weather', 0, 'description'),
              alert: parsed_response.dig('alerts', 0, 'description'),
              icon: parsed_response.dig('daily', time, 'weather', 0, 'icon'),
              data_type: type
            }
          end

          weather_data.assign_attributes(attributes)

          return false unless weather_data.save

          saved_data << weather_data
        end
        true
      end
    end
  end
end
