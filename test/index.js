import { observe } from '../src/core/observer'

let s1 = {
	name: 'shi',
	sex: 'male',
	age: 32,
	address: 'xzsf',
	otherInformation: {
		skill: 'computer',
		hobbity: 'basketball'
	}
}


let k = observe(s1, true);


// k.value = Object.freeze(t)
// console.log(s1)