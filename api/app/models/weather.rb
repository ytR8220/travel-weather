# frozen_string_literal: true

class Weather < ApplicationRecord
  belongs_to :city

  scope :with_dates, lambda { |dates|
    where('DATE(date_time) IN (?)', dates.map(&:to_date))
  }

  validates :city_id, presence: true
  validates :weather, presence: true
  validates :temp, presence: true
  validates :temp_max, presence: true
  validates :temp_min, presence: true
  validates :humidity, presence: true
  validates :description, presence: true
end
