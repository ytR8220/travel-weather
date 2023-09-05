# frozen_string_literal: true

class Weather < ApplicationRecord
  belongs_to :city
  validates :city_id, presence: true
  validates :weather, presence: true
  validates :temp, presence: true
  validates :temp_max, presence: true
  validates :temp_min, presence: true
  validates :humidity, presence: true
  validates :description, presence: true
  validates :icon, presence: true
  validates :data_type, presence: true

  # すでにデータがある場合はそれを取得する関数（現在、3時間後、6時間後、12時間後のデータ）
  def self.fetch_existing_times_data(city_id:, base_date:, data_type:)
    times_to_check = [
      base_date,
      base_date + 3.hours,
      base_date + 6.hours,
      base_date + 12.hours
    ]
    Weather.where(city_id:, date_time: times_to_check, data_type:).distinct
  end

  # すでにデータがある場合はそれを取得する関数（明日から5日後までのデータ）
  def self.fetch_existing_days_data(city_id:, base_date:, data_type:)
    days_to_check = [
      base_date + 1.day,
      base_date + 2.days,
      base_date + 3.days,
      base_date + 4.days,
      base_date + 5.days
    ]
    subquery = select('DATE(date_time) as checked_date, MAX(date_time) as max_date_time')
               .where(city_id:, data_type:)
               .where('DATE(date_time) IN (?)', days_to_check.map(&:to_date))
               .group('DATE(date_time)')

    Weather.joins("INNER JOIN (#{subquery.to_sql}) AS latest_records ON DATE(weathers.date_time) = latest_records.checked_date AND weathers.date_time = latest_records.max_date_time")
           .where(city_id:, data_type:)
  end

  # 天気情報を保存する関数
  def self.save_weather_data(parsed_response:, times:, type:, city_id:, saved_data:)
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
    saved_data
  end
end
