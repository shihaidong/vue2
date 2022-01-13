import { proxy, defineComputed } from '../src/core/instance/state'

let k = {
  name: 'shi',
  age: 32
}
let t = {
  k
}

proxy(t, 'k', 'name')

// console.log(t)
