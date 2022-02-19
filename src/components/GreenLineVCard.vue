<template>
  <div>
    <v-sheet
      outlined
      color="customLightGreen"
      class="mx-auto"
      elevation="3"
    >
      <v-card
        outlined
        color="customAlmostWhite"
        class="rounded-0"
      >
        <slot />
      </v-card>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'GreenLineVCard'
}
</script>

<style>

</style>