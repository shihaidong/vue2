test("test/index1")
import { test } from '../src/core/util/debug'
import Vue from '../src/core/index'
import Watcher from '../src/core/observer/watcher'
test("test/index2")
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

let watcher = new Watcher(k, '1$tes11t', function(e){
	console.log(e)
}, {deep: true}, true)
test("test/index3")
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