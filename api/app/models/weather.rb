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
end
