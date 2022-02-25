<template>
  <div>
    <v-container class="container-width">
      <v-container class="card-container-width">
        <v-card
          outlined
          color="white"
        >
          <v-card-actions class="py-1 px-0">
            <v-avatar
              v-if="userInfo"
              class="my-0 mr-2"
              size="50"
            >
              <img
                :src="userInfo.icon_path"
                :alt="userInfo.icon_name"
              >
            </v-avatar>
            <v-avatar
              v-if="!userInfo"
              class="my-0 mr-2"
              size="50"
            >
              <v-icon
                size="70"
              >{{ mdiAccountCircle }}</v-icon>
            </v-avatar>
            <div v-if="userInfo">
              <p class="card-title mb-0">{{ userInfo.user_name}}</p>
              <p class="card-text mb-0">@{{ userInfo.user_id }}</p>
            </div>
          </v-card-actions>
        </v-card>
        <v-divider class="mb-4"></v-divider>
      </v-container>
      
      <Profile
        v-if="userInfo"
        :setUser="userInfo"
      />
    </v-container>
  </div>
</template>

<script>
import { mdiAccountCircle } from '@mdi/js'
import Profile from '@/components/Profile'
import { getFirestore, collectionGroup, query, where, getDocs, doc, getDoc } from '@firebase/firestore'

export default {
  name: 'UserInfo',
  components: {
    Profile
  },
  data() {
    return {
      mdiAccountCircle,
      userInfo: null
    }
  },
  async beforeRouteEnter(to, from, next) {
    const db = getFirestore()
    const userIdCollectionGroup = collectionGroup(db, 'unique')
    const q = query(userIdCollectionGroup, where('user_id', '==', to.params.userId))
    const querySnapshot = await getDocs(q)
    const user = querySnapshot.docs.map(doc => doc.data())[0]
    if(user) {
      const userId = user.user_id
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      const userInfo = docSnap.data()
      userInfo.user_id = userId
      next(vm => {
        vm.userInfo = userInfo
      })
    } else {
      next({ path: '/not_found' })
    }
  }
}
</script>

<style scoped>
  .container-width {
    width: 95%;
  }
  
  @media screen and (min-width: 800px) {
    .container-width {
      width: 80%;
    }
    .card-container-width {
      width: 80%;
    }
  }
</style>