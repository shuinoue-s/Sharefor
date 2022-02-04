<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
      <form @submit.prevent="saveStorage()">
        <v-toolbar
          dark
          color="customGreen"
          dense
        >
          <v-btn
            icon
            dark
            @click="emitClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="custom-light-green mx-auto">POST</v-toolbar-title>
          <v-toolbar-items>
            <v-btn
              dark
              text
              type="submit"
              :disabled="invalid"
              @click="emitSend"
            >
              <v-icon>{{ mdiSend }}</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      
        <validation-provider
          v-slot="{ errors }"
          rules="required|max:50"
          name="タイトル"
        >
          <v-text-field
          class="ma-4"
            v-model="title"
            color="customGreen"
            :counter="50"
            :error-messages="errors"
            clearable
            label="おすすめの場所はどこですか？"

          ></v-text-field>
        </validation-provider>

        <div id="map" ref="map" />
        <validation-provider
          v-slot="{ errors }"
          name="searchMap"
          rules=""
        >
          <v-text-field
            class="mb-4 mx-4"
            v-model="address"
            @change="mapSearch"
            prepend-icon="mdi-map-marker"
            color="customGreen"
            clearable
            :error-messages="errors"
            label="住所から検索"
          >
            <template v-slot:append>
              <v-btn
                color="customGreen"
                style="color: #fff"
                @click="mapSearch"
              >
                検索
              </v-btn>
            </template>
          </v-text-field>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="body"
          rules="required|max:300"
        >
          <v-textarea
            class="mb-4 mx-4"
            v-model="body"
            name="body"
            color="customGreen"
            :error-messages="errors"
            :counter="300"
            clearable
            label="おすすめの理由は？"
            placeholder="厳かな雰囲気がありとても気に入っています。よく行きます！"
            hint="おすすめの理由を投稿してみましょう！"
          ></v-textarea>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="image"
          ref="provider"
          rules="required|image|size:5000"
        >
          <v-file-input
            class="mb-4 mx-4"
            v-model="image"
            @change="handleFileChange"
            :error-messages="errors"
            label="写真も一緒に投稿しましょう"
            prepend-icon="mdi-camera"
            color="customGreen"
            show-size
          ></v-file-input>
          <v-img
            max-height="300"
            max-width="400"
            contain
            :src="previewImage"
            class="mx-auto"
          >
          </v-img>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          rules="required|max:20|maxlength:10"
          name="タグ"
        >
            <v-combobox
              class="mb-4 mx-4"
              :error-messages="errors"
              :counter="10"
              v-model="selected"
              :items="tags"
              label="タグを入力してください"
              color="customGreen"
              item-color="customGreen"
              multiple
              chips
              deletable-chips
              clearable
            >
            </v-combobox>
        </validation-provider>

        <v-spacer></v-spacer>
        <v-btn 
        @click="clear"
        class="ma-4"
        >
          clear
        </v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { mdiSend } from '@mdi/js'
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import app from '../firebase/firebase'
import { ValidationObserver, ValidationProvider, setInteractionMode, extend } from 'vee-validate'
import { required, max, image, size } from 'vee-validate/dist/rules'
import { mapGetters, mapActions } from 'vuex'

setInteractionMode('eager');

extend('image', {
  ...image,
  message: '画像を選択してください',
})

extend('max', {
  ...max,
  message: '{_field_}は{length}文字以内で入力してください',
})

extend('required', {
  ...required,
  message: '入力必須です',
})

extend('size', {
  ...size,
  message: '{size}KB以内である必要があります'
})

extend('maxlength', {
  validate: (select, {max}) => {
    return select.length <= max
  },
  params: ['max'],
  message: '最大{max}個まで入力可能です'
})

export default {
  name: 'PostForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      mdiSend,
      db: '',
      storage: '',
      title: '',
      address: '',
      map: {},
      marker: null,
      geocoder: {},
      geopoint: { lat: 35.9919136, lng: 140.6410921 },
      body: '',
      image: '',
      fileName: '',
      filePath: '',
      // tags: [], mapGettersで取得
      selected: [],
      uid: '',
      name: '',
    }
  },
  created() {
    this.db = getFirestore(app)
    this.storage = getStorage(app)
  },
  mounted() {
    this.getGoogleMap()
  },
  methods: {
    ...mapActions('posts', ['getPosts']),
    getGoogleMap() {
    if(!window.mapLoadStarted) {
      window.mapLoadStarted = true
      let script = document.createElement('script')
      const googleMapAPI = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB0p-QsgCwcTqa5DKE2KG2WDaX9EzBoyyY&callback=initMap'
      script.src = googleMapAPI
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
        const marker = new window.google.maps.Marker({
          position: this.geopoint,
          map
        })
        map.addListener('click', mapsMouseEvent => this.clickOnMap(mapsMouseEvent))
        this.map = map
        this.marker = marker
        this.geocoder = new window.google.maps.Geocoder()
      }
    }, 500)
    },
    clickOnMap(mapEvent) {
      this.geopoint.lat = mapEvent.latLng.lat()
      this.geopoint.lng = mapEvent.latLng.lng()
      this.marker.setMap(null)
      this.marker = new window.google.maps.Marker({
        position: this.geopoint,
        map: this.map
      })
    },
    mapSearch() {
      this.geocoder.geocode({
        'address': this.address
      }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          this.map.setCenter(results[0].geometry.location)
          this.geopoint.lat = results[0].geometry.location.lat()
          this.geopoint.lng = results[0].geometry.location.lng()
          this.marker.setMap(null)
          this.marker = new window.google.maps.Marker({
            position: results[0].geometry.location,
            map: this.map
          })
        }
      })
    },
    emitClose() {
      this.$emit('recieve-close')
    },
    emitSend() {
      this.$emit('recieve-send')
    },
    clear() {
      this.title = ''
      this.geopoint = { lat: 35.9919136, lng: 140.6410921 }
      this.body = ''
      this.image = ''
      this.address = ''
      this.selected = []
      this.$refs.observer.reset()
      this.getGoogleMap()
    },
    handleFileChange(e) {
      this.$refs.provider.validate(e)
      this.fileName = e.name
    },
    saveStorage() {
      const storageRef = ref(this.storage, `images/${this.fileName}`)
      uploadBytes(storageRef, this.image).then(() => {
        getDownloadURL(storageRef).then(url => {
          this.sendPost(url)
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    async sendPost(filePath) {
      await addDoc(collection(this.db, "posts"), {
        title: this.title,
        body: this.body,
        geopoint: this.geopoint,
        file_name: this.fileName,
        file_path: filePath,
        tags: this.selected,
        icon_name: '',
        icon_path: '',
        uid: '',
        user_name: '',
        is_show: false,
        created_at: serverTimestamp()
      })
      this.clear()
      this.getPosts()
    },
  },
  computed: {
    ...mapGetters('posts', ['tags']),
    previewImage() {
      if(!this.image) return;
      return URL.createObjectURL(this.image);
    },
  },
}
</script>

<style scoped>
  .custom-light-green {
    color: #B0EACD;
  }

#map {
  height: 400px;
  width: 80%;
  margin: auto;
  background: gray;
}
</style>