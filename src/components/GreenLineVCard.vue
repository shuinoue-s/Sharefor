<template>
  <div>
    <v-sheet
      outlined
      color="customLightGreen"
      class="mx-auto"
      elevation="3"
      :max-width="maxWidth"
    >
      <v-card
        outlined
        color="customAlmostWhite"
        class="rounded-0"
        :max-width="maxWidth"
      >
        <slot />
      </v-card>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'GreenLineVCard',
  props: {
    setMaxWidth: {
      type: String
    }
  },
  data() {
    return {
      maxWidth: this.setMaxWidth
    }
  }
}
</script>

<style>

</style>