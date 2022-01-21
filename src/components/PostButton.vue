<template>
  <div>
    <v-menu
      offset-x
      left
      min-width="100"
      transition="slide-y-reverse-transition"
    >
    <template v-slot:activator="{ on, attrs }">
    <v-btn
      class="mr-2 mb-2"
      color="customGreen"
      fab
      dark
      fixed
      right
      bottom
      v-bind="attrs"
      v-on="on"
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    </template>
    <v-list>
        <v-list-item>
            <v-list-item-title class="text-center">投稿</v-list-item-title>
        </v-list-item>
        <v-list-item>
            <v-list-item-title class="text-center">募集</v-list-item-title>
        </v-list-item>
    </v-list>
    </v-menu>
  </div>
</template>

<script>
// import { mdiCloseCircleOutline } from '@mdi/js';
export default {
    data() {
        return {
            
        }
    }
}
</script>

<style>
</style>