<template>
  <div>
    <DisplayAskList
      v-if="asks"
      :setAsks="asks"
    />

    <InfiniteLoading v-if="posted" ref="infiniteLoading" spinner="spiral" @infinite="infiniteLoad">
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </InfiniteLoading>
  </div>
</template>

<script>
import DisplayAskList from '@/components/DisplayAskList'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AskList',
  components: {
    InfiniteLoading,
    DisplayAskList
  },
  setup() {
    const posted = ref(false)
    return { posted }
  },
  data() {
    return {
      lastVisiblePost: {},
      posted: ''
    }
  },
  async created() {
    this.lastVisiblePost = await this.firstGetAsks()
    this.posted = true
  },
  methods: {
    ...mapActions('asks', [('firstGetAsks')]),
    ...mapActions('asks', [('nextAsks')]),
    async infiniteLoad() {
      this.lastVisiblePost = await this.nextAsks(this.lastVisiblePost)
      this.$refs.infiniteLoading.stateChanger.loaded()
      if(!this.lastVisiblePost) {
        this.$refs.infiniteLoading.stateChanger.complete()
      }
    },
  },
  computed: {
    ...mapGetters('asks', ['asks'])
  }
}
</script>