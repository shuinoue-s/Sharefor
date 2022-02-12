import { format } from 'date-fns'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import app from '@/firebase/firebase'

function arrayDateFormat(list) {
  for(let i = 0; i < list.length; i++) {
    list[i].created_at = list[i].created_at.toDate()
    list[i].created_at = format(list[i].created_at, 'yyyy/MM/dd HH:mm:ss')
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

function dateFormat(data) {
  data.created_at = data.created_at.toDate()
  data.created_at = format(data.created_at, 'yyyy/MM/dd HH:mm:ss')
  return data
}

function splitTags(data) {
  let tags = []
  tags.push(...data.tags)
  return tags
}

async function arrayAddUserInfo(list) {
  const db = getFirestore(app)
  for(let i = 0; i < list.length; i++) {
    const docRef = doc(db, 'users', list[i].uid)
    const docSnap = await getDoc(docRef)
    list[i].userInfo = docSnap.data()
  }
  return list
}

async function addUserInfo(data) {
  const db = getFirestore(app)
  const docRef = doc(db, 'users', data.uid)
  const docSnap = await getDoc(docRef)
  data.userInfo = docSnap.data()
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