<template>
  <div>
    <v-footer
      absolute
      outlined
      height="70"
      color="customLightGreen"
    >
      <div class="font mx-auto">
        <router-link to="/" tag="span" style="cursor: pointer" class="font footer-text">2022 - sharefor</router-link>
      </div>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
  @import '../css/style.css';

  .footer-text {
    font-size: 14px;
    color: #fff;
  }
</style>