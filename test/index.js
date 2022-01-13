import { observe } from '../src/core/observer'
import Vue from '../src/core'

let s1 = {
  name: 'shi',
  sex: 'male',
  age: 32
}

let k = observe(s1)
// Vue.set(k.value, 'address', 'xzsf')

let arr = [1, 2, 3]
let arr1 = observe(arr)
// console.log(arr1)

// k.value = Object.freeze(t)
// console.log(s1)

// console.log(k)
