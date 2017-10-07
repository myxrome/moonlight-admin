<template lang="haml">
%table{'v-if': 'scenarios.length > 0'}
  %thead
    %tr
      %th Title
      %th Description
  %tbody
    %tr{'v-for': 'scenario in scenarios', ':key': 'scenario.id'}
      %td='{{ scenario.title }}'
      %td='{{ scenario.description }}'
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    scenarios: 'list'
  }),
  methods: mapActions([
    'upload'
  ]),
  mounted: function() {
    this.upload();
  }
}
</script>