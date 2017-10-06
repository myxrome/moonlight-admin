Rails.application.routes.draw do

  resources :scenarios, except: [:new, :edit]

end
