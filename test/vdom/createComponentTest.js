import Vue from '../../src/core'
import { createElement as h } from '../../src/core/vdom/create-element'
import { VueObj } from './createElementTest'
const vueInstance = new Vue({
  name: 'shi',
  template: '<div>testExtend</div>',
  data() {
    return {
      name: 'shihaidong'
    }
  },
  components: {
    VueObj
  },
  methods: {
    getName() {
      return this.name
    }
  }
})

// const k = h(vueInstance, 'VueCtor', {}, 'shi', 2)
// const k = h(vueInstance, VueCtor, {}, 'shi')
const k = h(vueInstance, VueObj, {})
console.log(k)
