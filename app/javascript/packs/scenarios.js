import Vue from 'vue/dist/vue.esm'

const scenarios = new Vue({
    el: '#scenarios',
    data: {
        scenarios: []
    },
    mounted: function() {
        fetch('/scenarios.json').then(function(response) {
            response.json().then(function(data) {
                    this.scenarios = data;
                }.bind(this)
            )
        }.bind(this))
    }
});
