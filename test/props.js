import Vue from '../src/core/index'

const i = Vue.extend({
  name: 'shi',
  template: '<div>testExtend</div>',
  props: {
    weibo: {
      type: String,
      default: () => ''
    },
    'wei-Xin': {
      type: Number,
      default: 0
    },
    name: {
      type: Boolean
    },
    others: {
      type: Object,
      default: () => {
        return { name: 'shi' }
      }
    }
  }
})
console.log(new i(), '((((')
