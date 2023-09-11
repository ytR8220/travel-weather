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

  # 「市区町村」を追加して軽度緯度を再度取得を試みる関数
  # def self.try_coordinates(city, api_key)
  #   kind = ['市', '区', '町', '村']
  #   kind.each do |k|
  #     conversion_name = city + k
  #     encode_name = URI.encode_www_form_component(conversion_name)
  #     url = "http://api.openweathermap.org/geo/1.0/direct?q=#{encode_name},&appid=#{api_key}"

  #     response = HTTPClient.new.get(url)
  #     coordinates = JSON.parse(response.body)
  #     next if coordinates.empty? || coordinates[0]['lat'].nil? || coordinates[0]['lon'].nil? || coordinates[0]['local_names'].nil? || coordinates[0]['local_names']['ja'].nil?

  #     return coordinates
  #   end
  # end

end
