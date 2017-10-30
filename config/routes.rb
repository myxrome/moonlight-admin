Rails.application.routes.draw do

  root to: 'application#index'
  resources :scenarios, except: [:new, :edit]

end
