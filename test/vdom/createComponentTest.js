import Vue from '../../src/core'
import { createComponent as h } from '../../src/core/vdom/create-component'
import { VueCtor } from './createElementTest'
let ComponentTest = {
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
}

const Ctor = Vue.extend(ComponentTest)
console.log(VueCtor)
const k = h(new Ctor(), {}, VueCtor)
console.log(k)
