# frozen_string_literal: true

class City < ApplicationRecord
  belongs_to :country
  has_many :weathers, dependent: :destroy
  validates :name, presence: true, uniqueness: { scope: :country_id }
  validates :country_id, presence: true

  # cityがDBに存在するかどうかを確認する関数
  def self.find_or_create_by_name_and_coordinates(name:, lat:, lon:, country_name:)
    @city = find_by(name:)
    return @city if @city

    @city = find_by(lat:, lon:)
    return @city if @city

    country = Country.find_or_create_by(name: country_name)
    return nil if country.errors.any?

    @city = create(name:, country_id: country.id, lat:, lon:)
    @city.save ? @city : nil
  end

  # 経度緯度を取得する関数
  def self.get_coordinates(city:, api_key:)
    encode_city = URI.encode_www_form_component(city)
    url = "http://api.openweathermap.org/geo/1.0/direct?q=#{encode_city},&appid=#{api_key}"

    begin
      response = HTTPClient.new.get(url)

      unless response.status == 200
        render json: { error: "APIエラー:#{response.status}" }, status: :bad_gateway
      end

      coordinates = JSON.parse(response.body)
      if coordinates.empty? || coordinates[0]['lat'].nil? || coordinates[0]['lon'].nil? || coordinates[0]['country'].nil?
        render json: { error: "#{city}の天気情報は見つかりませんでした。" }, status: :not_found
      end

      { lat: coordinates[0]['lat'], lon: coordinates[0]['lon'], country: coordinates[0]['country'] }
    rescue StandardError => e
      { error: "予期せぬエラーが発生しました:#{e}" }
    end
  end
end
