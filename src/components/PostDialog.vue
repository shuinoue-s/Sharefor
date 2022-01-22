<template>
  <div>

  </div>
</template>

<script>
export default {
  data() {
    return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
    }
  },
  methods: {
    toPostForm() {
      this.dialog = false
      this.$emit('post-form', this.dialog)
    }
  }
}
</script>

<style>

</style>