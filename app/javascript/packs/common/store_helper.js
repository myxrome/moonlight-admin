export function addStoredOrderedItem(store, value) {
    let index = store.findIndex((item) => {
        return value.order < item.data.order;
    });
    index = index < 0 ? store.length : index;
    let created = {
        data: value,
        cache: {},
        meta: { state: 'show' },
    };
    store.insert(index, created);
}

export function updateStoredOrderedItem(store, value) {
    return store.some((item, index) => {
        if (item.data.id === value.id) {
            const updated = {
                data: Object.assign({}, item.data, value),
                cache: Object.assign({}, item.cache),
                meta: Object.assign({}, item.meta),
            };
            store.replace(index, updated);
            if (index !== updated.data.order) {
                store.move(index, item.data.order);
            }
            return true;
        }
        return false;
    });
}
