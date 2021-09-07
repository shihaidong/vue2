console.log("test/index1")
import Vue from '../src/core/index'
console.log("test/index2")
let k = new Vue({
	el:'#app',
	data(){
		return {
			name: 'shi'
		}
	},
	methods: {
		
	}
});
console.log("test/index3")
// k.$options._base.mixin({
// 	methods:{
// 		test(){
// 			console.log('test')
// 		}
// 	}
// })

// let useObj = {
// 	install(Vue){
// 		console.log("***",this,arguments)
// 	}
// }
// k.$options._base.use(useObj, {edit: true})

console.log(k)