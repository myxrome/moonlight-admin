require 'her/model'

module Her
  module Model

    module Update

      def update(attributes)
        assign_attributes(attributes.to_h)
        save
      end

    end
    include Her::Model::Update

  end
end