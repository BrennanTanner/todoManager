class ListSerializer
  include JSONAPI::Serializer
  attributes :title, :class_list

  attribute :items do |list|
    ItemSerializer.new(list.items).serializable_hash
  end
end
