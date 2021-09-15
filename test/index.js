import { observe } from '../src/core/observer'
import Vue from '../src/core'

let s1 = {
	name: 'shi',
	sex: 'male',
	age: 32,
	address: 'xzsf',
}


let k = observe(s1, true);
console.log(k.value)
Vue.set(k.value, 'x', 'xx')
console.log(k)

// k.value = Object.freeze(t)
// console.log(s1)