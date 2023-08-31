# frozen_string_literal: true

class City < ApplicationRecord
  belongs_to :country
  has_many :weathers, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :country_id }
  validates :country_id, presence: true
end
