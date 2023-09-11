# frozen_string_literal: true

module Api
  module V1
    # 天気情報を取得するコントローラー
    class WeathersController < ApplicationController
      before_action :set_api_key, :get_date_time, :set_client, :get_coordinates

      # 天気情報を取得する関数
      def get_weather_data
        city = find_or_create_city

        if check_weather_data(city)
          if feath_save_weather_data(city)
            update_weather_data(city)
          else
            render json: { error: 'データの取得に失敗しました。もう一度お試し下さい。' }, status: :bad_gateway
          end
        else
          render json: {
            city_name: @city_name, weather_data: @existing_times_data + @existing_days_data
          }, status: :ok
        end
      end

      private

      def set_api_key
        @api_key = ENV['WEATHER_API']
      end

      def get_date_time
        @base_date = DateTime.parse(Time.now.strftime('%Y-%m-%d %H:00:00'))
      end

      def set_client
        @client = HTTPClient.new
      end

      # cityがDBに存在するかどうかを確認して、なければ登録する関数
      def find_or_create_city
        City.find_or_create_by_name_and_coordinates(name: @city_name, lat: @lat, lon: @lon, country_name: @country)
      end

      # 経度緯度を取得する関数
      def get_coordinates
        city = params[:city]
        encode_city = URI.encode_www_form_component(city)
        url = "http://api.openweathermap.org/geo/1.0/direct?q=#{encode_city},&appid=#{@api_key}"

        begin
          response = @client.get(url)

          unless response.status == 200
            render json: { error: "APIエラー:#{response.status}" }, status: :bad_gateway
            return
          end

          coordinates = JSON.parse(response.body)
          if coordinates.empty? || coordinates[0]['lat'].nil? || coordinates[0]['lon'].nil? || coordinates[0]['local_names'].nil? || coordinates[0]['local_names']['ja'].nil?
            # coordinates = City.try_coordinates(city, @api_key)
            render json: { error: "「#{city}」の天気情報は見つかりませんでした。" }, status: :not_found
            return
          end

          set_city_instance(coordinates)
        rescue HTTPClient::BadResponseError, HTTPClient::TimeoutError, JSON::ParserError => e
          render json: { error: e.message.to_s }, status: :bad_gateway
        end
      end

      # すでに必要なデータがあるかどうかを確認する関数
      def check_weather_data(city)
        @existing_times_data = Weather.fetch_existing_times_data(city_id: city.id, base_date: @base_date, data_type: :hourly)
        @existing_days_data = Weather.fetch_existing_days_data(city_id: city.id, base_date: @base_date, data_type: :daily)
        @should_update_data = @existing_days_data.any? && (Time.now.utc - @existing_days_data[0].updated_at) / 3600 > 12

        @should_update_data || @existing_times_data.length < 4 || @existing_days_data.length < 5
      end

      # apiを叩き、必要なデータを保存する関数
      def feath_save_weather_data(city)
        url = "https://api.openweathermap.org/data/3.0/onecall?lat=#{@lat}&lon=#{@lon}&exclude=minutely&appid=#{@api_key}&units=metric&lang=ja"
        response = @client.get(url)

        begin
          parsed_response = JSON.parse(response.body)
          saved_data = []

          hourly_success = @existing_times_data.length < 4 ? Weather.save_weather_data(parsed_response:, times: [0, 3, 6, 12], type: :hourly, city_id: city.id, saved_data:) : true

          daily_success =  if @should_update_data || @existing_days_data.length < 5
                             daily_success = Weather.save_weather_data(parsed_response:, times: [1, 2, 3, 4, 5], type: :daily,
                                                                       city_id: city.id, saved_data:)
                           else
                             true
                           end

          hourly_success && daily_success
        rescue JSON::ParserError => e
          render json: { error: e.message.to_s }, status: :bad_gateway
        end
      end

      # 天気情報を更新する関数
      def update_weather_data(city)
        updated_existing_times_data = Weather.fetch_existing_times_data(city_id: city.id, base_date: @base_date, data_type: :hourly)
        updated_existing_days_data = Weather.fetch_existing_days_data(city_id: city.id, base_date: @base_date, data_type: :daily)
        render json: {
          city_name: @city_name,
          weather_data: updated_existing_times_data + updated_existing_days_data
        }, status: :created
      end

      # city情報のインスタンス変数を設定する関数
      def set_city_instance(coordinates)
        @lat = coordinates[0]['lat']
        @lon = coordinates[0]['lon']
        @country = coordinates[0]['country']
        @city_name = coordinates[0]['local_names']['ja']
      end
    end
  end
end
