import { format } from 'date-fns'

const dateFormat = function dateFormatServerTimeStamp(list) {
  for(let i = 0; i < list.length; i++) {
    list[i].created_at = list[i].created_at.toDate()
    list[i].created_at = format(list[i].created_at, 'yyyy/MM/dd HH:mm:ss')
  }
  return list
}

const splitArray =  function splitArrayFirestore(list) {
  let tags = []
  for(let i = 0; i < list.length; i++) {
    tags.push(...list[i].tags)
  }
  return tags
}

export { dateFormat, splitArray }