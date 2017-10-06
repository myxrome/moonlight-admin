<template lang="haml">
%table{'v-if': 'scenarios.length > 0'}
  %thead
    %tr
      %th Title
      %th Description
  %tbody
    %tr{'v-for': 'scenario in scenarios'}
      %td='{{ scenario.title }}'
      %td='{{ scenario.description }}'
</template>

<script>
import axios from 'axios';

export default {
  data: function() {
    return {
      scenarios: []
    }
  },
  mounted: function() {
    axios.get('/scenarios.json').then(function(response) {
        this.scenarios = response.data;
    }.bind(this))
  }
}
</script>