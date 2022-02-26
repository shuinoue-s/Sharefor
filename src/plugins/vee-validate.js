import { extend } from 'vee-validate'
import { required, max, image, size } from 'vee-validate/dist/rules'

extend('image', {
  ...image,
  message: '画像を選択してください'
})
extend('max', {
  ...max,
  message: '{length}文字以内で入力してください'
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
extend('unique', {
  validate: async (userId, {originUserId, userIdList}) => {
    if(originUserId === userId) {
      return true
    } else {
      const result = userIdList.includes(userId)
      return !result
    }
  },
  params: ['originUserId', 'userIdList'],
  message: 'すでに使用されているユーザーIDです'
})