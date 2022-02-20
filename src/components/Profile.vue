<template>
  <div>
    <v-container class="container-width">
      <GreenLineVCard class="my-4">
        <v-card-text class="text-style pa-1">
          自己紹介
        </v-card-text>
        <v-card-text class="description-style pt-1 pb-2">
          <p class="body-style mb-0">{{ userInfo.description }}</p>
        </v-card-text>
      </GreenLineVCard>

      <GreenLineVCard class="mb-4">
        <v-card-text class="text-style pa-1">
          お気に入りの場所
        </v-card-text>
        <v-card-text  class="description-style pt-1 pb-2">
          <p class="body-style mb-0">{{ userInfo.favorite_place }}</p>
        </v-card-text>
      </GreenLineVCard>

      <GreenLineVCard class="mb-4">
        <v-card-text class="text-style pa-1">
          推し選手
        </v-card-text>
        <v-card-text v-for="player in userInfo.favorite_player" :key="player" class="description-style pt-1 pb-2">
          <p class="body-style mb-0">{{ player }}</p>
        </v-card-text>
      </GreenLineVCard>

      <GreenLineVCard class="mb-4">
        <v-card-text class="text-style pa-1">
          推しチーム
        </v-card-text>
        <v-card-text v-for="team in userInfo.favorite_team" :key="team" class="description-style pt-1 pb-2">
          <p class="body-style mb-0">{{ team }}</p>
        </v-card-text>
      </GreenLineVCard>
    </v-container>
  </div>
</template>

<script>
import GreenLineVCard from '@/components/GreenLineVCard'

export default {
  name: 'Profile',
  components: {
    GreenLineVCard
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

<style scoped>
  .container-width {
    width: 95%;
  }
  .description-style {
    white-space: pre-line;
  }
  .text-style {
    font-size: 12px;
  }
  .body-style {
    color: #000;
  }

  @media screen and (min-width: 800px) {
    .container-width {
      width: 40%;
    }
  }
</style>