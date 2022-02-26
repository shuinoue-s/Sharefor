<template>
  <div>
    <v-sheet
      outlined
      color="customLightGreen"
      class="mx-auto"
      elevation="3"
      :max-width="maxWidth"
      :min-height="minHeight"
    >
      <v-card
        outlined
        color="customAlmostWhite"
        class="rounded-0"
        :max-width="maxWidth"
        :min-height="minHeight"
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
      type: String,
      default: null
    },
    setMinHeight: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      maxWidth: this.setMaxWidth,
      minHeight: this.setMinHeight
    }
  }
}
</script>

<style>

</style>