# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :weathers, only: %i[index show create destroy]
      post '/get_weather_data', to: 'weathers#get_weather_data'
    end
  end
end
