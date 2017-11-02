Rails.application.routes.draw do

  root to: 'application#index'

  resources :scenarios, except: [:new, :edit] do
    resources :stages, only: [:index]
  end
  resources :stages, except: [:index, :new, :edit] do
    resources :scenes, only: [:index]
  end
  resources :scenes, except: [:index, :show, :new, :edit]

end
