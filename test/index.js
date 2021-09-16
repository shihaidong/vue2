import { observe } from '../src/core/observer'
import Vue from '../src/core'

let s1 = {
	name: 'shi',
	sex: 'male',
	age: 32,
}

let k = observe(s1, true);


// k.value = Object.freeze(t)
// console.log(s1)


// function def(obj, key) {
// 	let val = obj[key]
// 	Object.defineProperty(obj, key, {
// 		get: function () {
// 			return val
// 		},
// 		set: function (newVal) {
// 			if (val == newVal) return
// 			val = newVal
// 		}
// 	})
// }
// def(s1, 'age')
// s1.age = 35
// console.log(s1)