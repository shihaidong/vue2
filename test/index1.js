test("test/index1")
import { test } from '../src/core/util/debug'
import Vue from '../src/core/index'
import Watcher from '../src/core/observer/watcher'
import mixin from './mixins'
test("test/index2")
// Vue.mixin({
// 	data(){
// 		return{
// 			name: 'shi'
// 		}
// 	},
// 	methods:{
// 		test1(){
// 			console.log('nn')
// 		}
// 	},
// 	beforeCreate(){
// 		console.log("****")
// 	}
// })
// Vue.mixin({
// 	data(){
// 		return {
// 			age: 23
// 		}
// 	},
// 	methods:{
// 		test3(){
// 			console.log('test3')
// 		}
// 	}
// })
// Vue.component('Yell', {
// 	data(){
// 		return {
			
// 		}
// 	}
// })
// Vue.use({
// 	install(Vue,options){
// 		console.log(arguments)
// 	}
// }, {name: 'shi'})
let k = new Vue({
	el:'#app',
	// mixins: [mixin],
	data(){
		return {
			name: 'shi'
		}
	},
	components:{
		age:function(){
			return this.name
		}
	},
	// filters: {
	// 	// dateAccess(data){

	// 	// }
	// },
	methods: {
		test2(){
			// console.log(this)
		}
	},
	beforeCreate(){
		// console.log('beforeCreate')
	},
	created(){
		// console.log("created")
		// console.log(this.name)
	}
});

// let watcher = new Watcher(k, '1$tes11t', function(e){
// 	// console.log(e)
// }, {deep: true}, true)
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