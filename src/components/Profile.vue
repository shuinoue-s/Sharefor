<template>
  <div>
    <DisplayProfile
      :setUser="userInfo"
    />
  </div>
</template>

<script>
import DisplayProfile from '@/components/DisplayProfile'

export default {
  name: 'Profile',
  components: {
    DisplayProfile
  },
  props: {
    setUser: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      userInfo: this.setUser
    }
  },
  watch: {
    setUser(newValue) {
      this.userInfo = newValue
    }
  }
}
</script>