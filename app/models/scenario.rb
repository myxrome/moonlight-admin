class Scenario < ActiveModelSerializers::Model
  include Her::Model

  attributes :title, :description, :order, :active
  has_many :stages

  parse_root_in_json true, format: :active_model_serializers
  include_root_in_json true
end