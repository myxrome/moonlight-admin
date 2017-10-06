class Scenario < ActiveModelSerializers::Model
  include Her::Model

  attributes :title, :description, :order, :active
  parse_root_in_json true, format: :active_model_serializers
  include_root_in_json true
end