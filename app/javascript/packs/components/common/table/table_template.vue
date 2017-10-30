<script>
    import Draggable from 'vuedraggable'
    import TableHeaderRow from './header_row.vue'
    import SwitchRow from './switch_row.vue'
    import ItemEditRow from './item_edit_row.vue'

    export default {
        props: {
            storedItems: Array,
            newItems: Array,
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
            const storedItemRows = this.storedItems.map((item) => {
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
                            destroy: (id) => {
                                this.$emit("destroy", id);
                            },
                            save: (id) => {
                                this.$emit("update", id);
                            },
                            'switch': (id) => {
                                this.$emit("switch", id);
                            },
                        }
                    }, [
                        createElement(
                            'template', {
                                slot: 'show-row'
                            }, [
                                this.$scopedSlots["show-row-table"]({
                                    item: item
                                })
                            ]
                        ),
                        createElement(
                            'template', {
                                slot: 'edit-row'
                            }, [
                                this.$scopedSlots["edit-row-table"]({
                                    item: item
                                })
                            ]
                        ),
                    ]
                );
            });
            const newItemRows = this.newItems.map((item) => {
                return createElement(
                    ItemEditRow, {
                        key: item.data.id,
                        props: {
                            item: item,
                        },
                        on: {
                            cancel: (id) => {
                                this.$emit("destroyNew", id);
                            },
                            save: (id) => {
                                this.$emit("createNew", id);
                            },
                        }
                    }, [
                        this.$scopedSlots["new-row-table"]({
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
                            this.$emit("addNew");
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