# frozen_string_literal: true

class Weather < ApplicationRecord
  belongs_to :city

  scope :latest_days, lambda { |city_id, data_type, days_to_check|
    select('DATE(date_time) as checked_date, MAX(date_time) as max_date_time')
      .where(city_id:, data_type:)
      .where('DATE(date_time) IN (?)', days_to_check.map(&:to_date))
      .group('DATE(date_time)')
  }

  validates :city_id, presence: true
  validates :weather, presence: true
  validates :temp, presence: true
  validates :temp_max, presence: true
  validates :temp_min, presence: true
  validates :humidity, presence: true
  validates :description, presence: true
  validates :icon, presence: true
  validates :data_type, presence: true
end
