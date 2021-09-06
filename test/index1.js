import Vue from '../src/core/index'
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
k.$options._base.mixin({
	methods:{
		test(){
			console.log('test')
		}
	}
})

let useObj = {
	install(Vue){
		console.log("***",this,arguments)
	}
}
k.$options._base.use(useObj, {edit: true})

console.log(k)