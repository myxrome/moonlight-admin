<script>
    import Draggable from 'vuedraggable'
    import TableHeaderRow from './header_row.vue'
    import SwitchRow from './switch_row.vue'
    import ItemEditRow from './item_edit_row.vue'

    export default {
        props: {
            stored: Array,
            added: Array,
            draggable: {
                type: Boolean,
                'default': false,
            },
        },
        components: {
            Draggable,
            TableHeaderRow,
            SwitchRow,
            ItemEditRow,
        },
        render: function (createElement) {
            const storedItemRows = this.stored.map((item) => {
                return createElement(
                    SwitchRow, {
                        'class': { 
                            'draggable-item': this.draggable
                        },
                        key: item.data.id,
                        props: {
                            item: item,
                        },
                        on: {
                            remove: (id) => {
                                this.$emit("removeStoredItem", id);
                            },
                            save: (id) => {
                                this.$emit("saveStoredItem", id);
                            },
                            'switch': (id) => {
                                this.$emit("switchRow", id);
                            },
                        }
                    }, [
                        createElement(
                            'template', {
                                slot: 'show-row'
                            }, [
                                this.$scopedSlots["stored-show-row"]({
                                    item: item
                                })
                            ]
                        ),
                        createElement(
                            'template', {
                                slot: 'edit-row'
                            }, [
                                this.$scopedSlots["stored-edit-row"]({
                                    item: item
                                })
                            ]
                        ),
                    ]
                );
            });
            const newItemRows = this.added.map((item) => {
                return createElement(
                    ItemEditRow, {
                        key: item.data.id,
                        props: {
                            item: item,
                        },
                        on: {
                            cancel: (id) => {
                                this.$emit("removeNewItem", id);
                            },
                            save: (id) => {
                                this.$emit("saveNewItem", id);
                            },
                        }
                    }, [
                        this.$scopedSlots["added-row"]({
                            item: item
                        })
                    ]
                );
            });
            let tbodyRows = storedItemRows.concat(newItemRows);

            let tbody = undefined;
            if (this.draggable) {
                tbody = createElement(
                    Draggable, {
                        props: {
                            element: 'tbody',
                            options: {
                                filter: 'a, input, textarea, .switch',
                                preventOnFilter: false,
                                draggable: '.draggable-item',
                                dragClass: 'draggable-ghost',
                                chosenClass: 'draggable-chosen'
                            }
                        },
                        on: {
                            end: (event) => {
                                this.$emit("dragEnd", event);
                            }
                        }
                    },
                    tbodyRows
                )
            } else {
                tbody = createElement(
                    'tbody',
                    tbodyRows
                );
            }
            const addButton = createElement(
                'a', {
                    attrs: {
                        'class': 'float-right',
                        href: '#'
                    },
                    on: {
                        click: (event) => {
                            this.$emit("addNewItem");
                            event.preventDefault();
                        }
                    }
                }, [
                    createElement('i', {attrs: {'class': 'fi-plus'}})
                ]
            );

            const thead = createElement(
                'thead', [createElement(TableHeaderRow, this.$slots['thead'])]
            );
            const contentTable = createElement(
                'table', [thead, tbody]
            );
            return createElement(
                'div', [contentTable, addButton]
            );
        }
    }

</script>