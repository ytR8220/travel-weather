# frozen_string_literal: true

class City < ApplicationRecord
  belongs_to :country
  has_many :weathers, dependent: :destroy
  validates :name, presence: true, uniqueness: { scope: :country_id }
  validates :country_id, presence: true

  def self.find_or_create_by_name_and_coordinates(name:, lat:, lon:, country_name:)
    city = find_by(name:)
    return city if city

    city = find_by(lat:, lon:)
    return city if city

    country = Country.find_or_create_by(name: country_name)
    return nil if country.errors.any?

    city = create(name:, country_id: country.id, lat:, lon:)
    city.save ? city : nil
  end
end
