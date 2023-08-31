# frozen_string_literal: true

class CreateCities < ActiveRecord::Migration[7.0]
  def change
    create_table :cities do |t|
      t.string :name, null: false
      t.references :country, null: false, foreign_key: true

      t.timestamps
    end
    add_index :cities, %i[name country_id], unique: true
  end
end
