class Stage < ActiveModelSerializers::Model
  include Her::Model

  attributes :order, :duration
  belongs_to :scenario
  has_many :scenes

  parse_root_in_json true, format: :active_model_serializers
  include_root_in_json true
end