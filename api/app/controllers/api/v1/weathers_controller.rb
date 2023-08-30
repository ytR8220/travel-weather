class Api::V1::WeathersController < ApplicationController
  require 'httpclient'
  require 'uri'

  # 経度緯度を取得する
  def get_coordinates
    city = params[:city] || "那覇市"
    api_key = ENV['WEATHER_API']
    
    encode_city = URI.encode_www_form_component(city)
    url = "http://api.openweathermap.org/geo/1.0/direct?q=#{encode_city},&appid=#{api_key}"
    client = HTTPClient.new
    response = client.get(url)
    coordinates = JSON.parse(response.body)
    @lat = coordinates[0]["lat"]
    @lon = coordinates[0]["lon"]
    @country = coordinates[0]["country"]
  end
  
  # 天気情報を取得する
  def get_whether_data
    city_name = params[:city] || "那覇市"
    city = City.find_by(name: city_name)
    base_date = params[:date] ? DateTime.parse(params[:date]) : DateTime.parse(Time.now.strftime('%Y-%m-%d %H:00:00'))
  
    # 都市と国のデータがない場合は作成する
    unless city
      get_coordinates
      country = Country.find_or_create_by(name: @country)
      city = City.create(name: city_name, country_id: country.id)
    end

    # すでにデータがある場合はそれを取得(現在、3時間後、6時間後、12時間後)
    dates_to_check = [
      base_date,
      base_date + 3.hours,
      base_date + 6.hours,
      base_date + 12.hours
    ]
    existing_data = dates_to_check.map do |date|
      Weather.find_by(city_id: city.id, date_time: date.strftime('%Y-%m-%d %H:%M:%S'))
    end.compact
    
    # すでにデータがある場合はそれを返すが、なければ外部APIから取得してDBに保存する
    if existing_data.length == 4
      render json: existing_data, status: :ok
    else
      api_key = ENV['WEATHER_API']
      get_coordinates

      # APIを叩いてデータを取得
      url = "https://api.openweathermap.org/data/3.0/onecall?lat=#{@lat}&lon=#{@lon}&exclude=minutely&appid=#{api_key}&units=metric&lang=ja"
      client = HTTPClient.new
      response = client.get(url)
      parsed_response = JSON.parse(response.body)

      # 現在、3時間後、6時間後、12時間後のデータを取得
      save_hours = [0, 3, 6, 12]
      success = true
      saved_data = []

      save_hours.each do |hour|
        date_time = Time.at(parsed_response.dig("hourly", hour, "dt")).strftime('%Y-%m-%d %H:%M:%S')

        weather_data = Weather.find_or_initialize_by(city_id: city.id, date_time: date_time)

        weather_data.assign_attributes(
          weather: parsed_response.dig("hourly", hour, "weather", 0, "main"),
          temp: parsed_response.dig("hourly", hour, "temp"),
          temp_max: parsed_response.dig("daily", 0, "temp", "max"),
          temp_min: parsed_response.dig("daily", 0, "temp", "min"),
          humidity: parsed_response.dig("daily", 0, "humidity"),
          description: parsed_response.dig("hourly", hour, "weather", 0, "description"),
          alert: parsed_response.dig("alerts", 0, "description")
        )

        if weather_data.save
          saved_data << weather_data
        else
          success = false
        end
      end
      if success
        render json: saved_data, status: :created
      else
        render json: weather_data.errors, status: :unprocessable_entity
      end
    end
  end


  def show

  end

  def destroy
  end

end
