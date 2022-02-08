<template>
  <div>
    <v-alert
      :value="!!message"
      :type="type"
      dense
      class="mt-0 text-center"
      transition="slide-y-transition"
    >
      {{message}}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'MessageAlert',
  props: ['message', 'type']
}
</script>