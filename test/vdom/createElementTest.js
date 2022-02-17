import { createElement as h } from '../../src/core/vdom/create-element'
import Vue from '../../src/core/index'
export const VueObj = {
  name: 'Test',
  data() {
    return {
      name: 'shi'
    }
  },
  methods: {
    getName() {
      console.log(this.name)
    }
  }
}

const VueCtor = Vue.extend(VueObj)
const instance = new VueCtor()
const k = h(instance, 'div', [
  h(instance, 'h1', { class: { red: true } }, 'title'),
  h(instance, 'p', 'this is content')
])

console.log(k)
