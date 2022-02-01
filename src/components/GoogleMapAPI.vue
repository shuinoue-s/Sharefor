<template>
  <div>
    <div id="map" ref="map" />
  </div>
</template>

<script>
export default {
  name: 'GoogleMapAPI',
  props: ['geopoint'],
  data() {
    return {
    }
  },
  mounted() {
    this.getGoogleMap()
  },
  methods: {
    getGoogleMap() {
      if(!window.mapLoadStarted) {
        window.mapLoadStarted = true
        let script = document.createElement('script')
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB0p-QsgCwcTqa5DKE2KG2WDaX9EzBoyyY&callback=initMap'
        script.async = true
        document.head.appendChild(script)
      }
      window.initMap = () => window.mapLoaded = true
      let timer = setInterval(() => {
        if(window.mapLoaded) {
          clearInterval(timer)
          const map = new window.google.maps.Map(this.$refs.map, {
            center: this.geopoint,
            zoom: 7
          }) 
          new window.google.maps.Marker({
            position: this.geopoint,
            map
          })
        }
      }, 500)
    }
  }
}
</script>

<style scoped>
  #map {
    height: 200px;
    margin: auto;
    background: gray;
  }
</style>