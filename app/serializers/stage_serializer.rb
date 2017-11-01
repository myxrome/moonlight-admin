class StageSerializer < ActiveModel::Serializer
  attributes :id, :scenario_id, :order, :duration
end
