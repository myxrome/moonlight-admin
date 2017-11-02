class Scene < ActiveModelSerializers::Model
  include Her::Model

  attributes :content, :sex, :example
  belongs_to :stage

  parse_root_in_json true, format: :active_model_serializers
  include_root_in_json true
end