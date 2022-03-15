import { mountComponent } from '@/core/instance/lifecycle'
import { createElement as h } from '../../src/core/vdom/create-element'
import Vue from '../../src/core/index'
export const VueObj = {
  name: 'Test',
  data() {
    return {
      name: '这是一个测试render函数的数据'
    }
  },
  methods: {
    getName() {
      console.log(this.name)
    }
  },
  created() {
    // setTimeout(() => {
    //   this.name = 'aa'
    // }, 5000)
  },
  render(h) {
    return h('div', this.name)
  }
}

const VueCtor = Vue.extend(VueObj)
const instance = new VueCtor()

// const k = h(instance, 'div', [
//   h(instance, 'h1', { class: { red: true } }, 'title'),
//   h(instance, 'p', 'this is content')
// ])
// console.log(k)
console.log(instance)

mountComponent(instance, document.createElement('div'))
