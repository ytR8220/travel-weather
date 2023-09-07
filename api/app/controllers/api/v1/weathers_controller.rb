# frozen_string_literal: true

module Api
  module V1
    # 天気情報を取得するコントローラー
    class WeathersController < ApplicationController
      before_action :set_api_key, :get_coordinates

      # 天気情報を取得する関数
      def get_weather_data
        city_name = params[:city]
        base_date = DateTime.parse(Time.now.strftime('%Y-%m-%d %H:00:00'))

        city = City.find_or_create_by_name_and_coordinates(name: city_name, lat: @lat, lon: @lon, country_name: @country)

        existing_times_data = Weather.fetch_existing_times_data(city_id: city.id, base_date:, data_type: :hourly)
        existing_days_data = Weather.fetch_existing_days_data(city_id: city.id, base_date:, data_type: :daily)
        should_update_data = existing_days_data.any? && (Time.now.utc - existing_days_data[0].updated_at) / 3600 > 12

        if should_update_data || existing_times_data.length < 4 || existing_days_data.length < 5

          url = "https://api.openweathermap.org/data/3.0/onecall?lat=#{@lat}&lon=#{@lon}&exclude=minutely&appid=#{@api_key}&units=metric&lang=ja"
          client = HTTPClient.new
          response = client.get(url)
          parsed_response = JSON.parse(response.body)

          success = true
          saved_data = []

          success = Weather.save_weather_data(parsed_response:, times: [0, 3, 6, 12], type: :hourly, city_id: city.id, saved_data:) if existing_times_data.length < 4

          if existing_days_data.length < 5 || should_update_data
            success = Weather.save_weather_data(parsed_response:, times: [1, 2, 3, 4, 5], type: :daily, city_id: city.id,
                                                saved_data:)
          end

          if success
            updated_existing_times_data = Weather.fetch_existing_times_data(city_id: city.id, base_date:, data_type: :hourly)
            updated_existing_days_data = Weather.fetch_existing_days_data(city_id: city.id, base_date:, data_type: :daily)
            render json: updated_existing_times_data + updated_existing_days_data, status: :created
          else
            render json: { error: 'データの取得に失敗しました。もう一度お試し下さい。' }, status: :bad_gateway
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
            render json: { error: "#{city}の天気情報は見つかりませんでした。" }, status: :not_found
            return
          end

          @lat = coordinates[0]['lat']
          @lon = coordinates[0]['lon']
          @country = coordinates[0]['country']
        rescue HTTPClient::BadResponseError, HTTPClient::TimeoutError, JSON::ParserError => e
          render json: { error: e.message.to_s }, status: :bad_gateway
        end
      end
    end
  end
end
