# frozen_string_literal: true

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 20_230_830_015_154) do
  create_table 'cities', charset: 'utf8mb4', collation: 'utf8mb4_general_ci', force: :cascade do |t|
    t.string 'name', null: false
    t.bigint 'country_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['country_id'], name: 'index_cities_on_country_id'
    t.index %w[name country_id], name: 'index_cities_on_name_and_country_id', unique: true
  end

  create_table 'countries', charset: 'utf8mb4', collation: 'utf8mb4_general_ci', force: :cascade do |t|
    t.string 'name', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['name'], name: 'index_countries_on_name', unique: true
  end

  create_table 'weathers', charset: 'utf8mb4', collation: 'utf8mb4_general_ci', force: :cascade do |t|
    t.bigint 'city_id', null: false
    t.datetime 'date_time', null: false
    t.string 'weather', null: false
    t.float 'temp', null: false
    t.float 'temp_max', null: false
    t.float 'temp_min', null: false
    t.integer 'humidity', null: false
    t.string 'description', null: false
    t.text 'alert'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index %w[city_id date_time], name: 'index_weathers_on_city_id_and_date_time', unique: true
    t.index ['city_id'], name: 'index_weathers_on_city_id'
  end

  add_foreign_key 'cities', 'countries'
  add_foreign_key 'weathers', 'cities'
end
