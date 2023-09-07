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
      data_type = (type == :hourly ? 'hourly' : 'daily')
      date_time = Time.at(parsed_response.dig(data_type, time, 'dt')).strftime('%Y-%m-%d %H:%M:%S')
      weather_data = Weather.find_or_initialize_by(city_id:, date_time:, data_type:)
      attributes = Weather.set_attributes(parsed_response:, time:, data_type:)
      weather_data.assign_attributes(attributes)
      return false unless weather_data.save

      saved_data << weather_data
    end
    saved_data
  end

  # 保存する天気情報の属性を設定する関数
  def self.set_attributes(parsed_response:, time:, data_type:)
    temp_value = if data_type == 'hourly'
                   parsed_response.dig(data_type, time, 'temp')
                 else
                   parsed_response.dig(data_type, time, 'temp', 'day')
                 end
    {
      weather: parsed_response.dig(data_type, time, 'weather', 0, 'main'),
      temp: temp_value,
      temp_max: parsed_response.dig('daily', data_type == 'hourly' ? 0 : time, 'temp', 'max'),
      temp_min: parsed_response.dig('daily', data_type == 'hourly' ? 0 : time, 'temp', 'min'),
      humidity: parsed_response.dig('daily', data_type == 'hourly' ? 0 : time, 'humidity'),
      description: parsed_response.dig(data_type, time, 'weather', 0, 'description'),
      alert: parsed_response.dig('alerts', 0, 'description'),
      icon: parsed_response.dig(data_type, time, 'weather', 0, 'icon'),
      data_type:
    }
  end
end
