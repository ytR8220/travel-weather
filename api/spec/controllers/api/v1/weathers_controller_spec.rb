# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::WeathersController, type: :controller do
  describe '#get_weather_data' do
    let(:city_name) { 'naha' }
    let(:base_date) { Time.now.strftime('%Y-%m-%d %H:00:00') }

    before do
      VCR.use_cassette("weather_data/#{city_name}/#{base_date}") do
        get :get_weather_data, params: { city: city_name, date: base_date }
      end
    end

    it '時間帯は4つのデータを返すこと', :vcr do
      json_response = JSON.parse(response.body)
      hourly_data = json_response.select { |data| data['data_type'] == 'hourly' }
      expect(hourly_data.length).to eq 4
    end

    it '日付は5つのデータを返すこと', :vcr do
      json_response = JSON.parse(response.body)
      daily_data = json_response.select { |data| data['data_type'] == 'daily' }
      expect(daily_data.length).to eq 5
    end

    it '時間帯と日付のデータは合わせて9つ返すこと', :vcr do
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq 9
    end
  end
end
