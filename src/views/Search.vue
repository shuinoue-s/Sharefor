<template>
  <div>
    <v-text-field
      outlined
      dense
      color="customGreen"
      v-model="keyword"
      @input="onChangeInput"
    ></v-text-field>

    {{searchResults}}
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch'

export default {
  name: 'Search',
  data() {
    return {
      searchClient: algoliasearch(
        'ZPBZS0LVL1',
        'd90da7dd0304b5b616f96311ce8160c1'
      ),
      keyword: null,
      searchResults: null
    }
  },
  methods: {
    async onChangeInput(input) {
      if(!input) {
        this.keyword = null
        this.searchResults = null
      } else {
          const algoliaId = 'ZPBZS0LVL1'
          const algoliaKey = 'd90da7dd0304b5b616f96311ce8160c1'
          const client = algoliasearch(algoliaId, algoliaKey)
          const index = client.initIndex('posts')
          const result = await index.search(input)
        if(result) {
          this.searchResults = result.hits.map(hit => hit)
        } else {
          this.searchResults = null
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
