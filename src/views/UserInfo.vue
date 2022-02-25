<template>
  <div>
    <v-container class="container-width">
      <Profile
        v-if="userInfo"
        :setUser="userInfo"
      />
    </v-container>
  </div>
</template>

<script>
import Profile from '@/components/Profile'
import { getFirestore, collectionGroup, query, where, getDocs, doc, getDoc } from '@firebase/firestore'

export default {
  name: 'UserInfo',
  components: {
    Profile
  },
  data() {
    return {
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
  }
</style>