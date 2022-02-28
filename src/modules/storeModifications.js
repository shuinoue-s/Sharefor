import Vue from 'vue'
import { format } from 'date-fns'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import app from '@/firebase/firebase'

function arrayDateFormat(list) {
  for(let i = 0; i < list.length; i++) {
    const dateFormat = list[i].created_at.toDate()
    Vue.set(list[i], 'created_at', format(dateFormat, 'yyyy/MM/dd HH:mm:ss'))
  }
  return list
}

function arraySplitTags(list) {
  let tags = []
  for(let i = 0; i < list.length; i++) {
    tags.push(...list[i].tags)
  }
  return tags
}

async function arrayAddUserInfo(list) {
  const db = getFirestore(app)
  for(let i = 0; i < list.length; i++) {
    const userIdDocRef = doc(db, 'users', list[i].uid, 'unique', 'user_id')
    const userIdDocSnap = await getDoc(userIdDocRef)
    const userId = userIdDocSnap.data().user_id
    const docRef = doc(db, 'users', list[i].uid)
    const docSnap = await getDoc(docRef)
    const userInfo = docSnap.data()
    Vue.set(userInfo, 'user_id', userId)
    Vue.set(list[i], 'userInfo', userInfo)
  }
  return list
}

function dateFormat(data) {
  const dateFormat = data.created_at.toDate()
  Vue.set(data, 'created_at', format(dateFormat, 'yyyy/MM/dd HH:mm:ss'))
  return data
}

function splitTags(data) {
  let tags = []
  tags.push(...data.tags)
  return tags
}

async function addUserInfo(data) {
  const db = getFirestore(app)
  const userIdDocRef = doc(db, 'users', data.uid, 'unique', 'user_id')
  const userIdDocSnap = await getDoc(userIdDocRef)
  const userId = userIdDocSnap.data().user_id
  const docRef = doc(db, 'users', data.uid)
  const docSnap = await getDoc(docRef)
  const userInfo = docSnap.data()
  Vue.set(userInfo, 'user_id', userId)
  Vue.set(data, 'userInfo', userInfo)
  return data
}

export {
  arrayDateFormat,
  arraySplitTags,
  dateFormat,
  splitTags,
  arrayAddUserInfo,
  addUserInfo
}