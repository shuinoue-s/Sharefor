import { format } from 'date-fns'

const arrayDateFormat = (list) => {
  for(let i = 0; i < list.length; i++) {
    list[i].created_at = list[i].created_at.toDate()
    list[i].created_at = format(list[i].created_at, 'yyyy/MM/dd HH:mm:ss')
  }
  return list
}

const arraySplitTags = (list) => {
  let tags = []
  for(let i = 0; i < list.length; i++) {
    tags.push(...list[i].tags)
  }
  return tags
}

const dateFormat = (data) => {
  data.created_at = data.created_at.toDate()
  data.created_at = format(data.created_at, 'yyyy/MM/dd HH:mm:ss')
  return data
}

const splitTags = (data) => {
  let tags = []
  tags.push(...data.tags)
  return tags
}

export { arrayDateFormat, arraySplitTags, dateFormat, splitTags }