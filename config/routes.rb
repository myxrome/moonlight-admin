Rails.application.routes.draw do

  root to: 'application#index'

  resources :scenarios, except: [:new, :edit] do
    resources :stages, only: [:index]
  end
  resources :stages, except: [:index, :new, :edit]

end
