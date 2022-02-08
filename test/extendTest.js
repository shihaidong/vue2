import Vue from '../src/core/index'

let k = Vue.extend({
  name: 'shi',
  template: '<div>testExtend</div>',
  data() {
    return {
      name: 'shihaidong'
    }
  },
  methods: {
    getName() {
      return this.name
    }
  }
})
// let s = new k({
//   methods: {

//   },
// })
let ins = new k()
// console.log(ins)
