Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :weathers, only: [:index, :show, :create, :destroy]
      get '/get_coordinates', to: 'weathers#get_coordinates'
      get '/get_whether_data', to: 'weathers#get_whether_data'
    end
  end
end
