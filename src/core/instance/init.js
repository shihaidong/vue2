import { mark, measure } from '../util/perf'
import { mergeOptions } from '../util'
import config from '../config.js'

import { initLifecycle } from './lifecycle'
import { initEvents } from './event'

let uid = 0

export function initMixin(Vue){
	Vue.prototype._init = function(options){
		const vm = this;
		vm._uid = uid++
		let startTag, endTag
		if(process.env.NODE_ENV !== 'production' && config.performance && mark) {
			startTag = `vue-perf-start:${vm._uid}`
			endTag = `vue-perf-end:${vm._uid}`
			mark(startTag)
		}
		//a flag to avoid this being observed
		vm._isVue = true;
		
		// merge options
		if(options && options._isComponent) {
			initInternalComponent(vm, options)
		}else{
			vm.$options = mergeOptions(
				resolveConstructorOptions(vm.constructor),
				options || {},
				vm
			)
		}
		
		if(process.env.NODE_ENV !== 'production') {
			// initProxy(vm)
		}else{
			vm._renderProxy = vm
		}
		vm._self = vm;
		
		// initState(vm)
		initLifecycle(vm)
		// initEvents(vm)

		if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
			// vm._name = formatComponentName(vm, false)
			mark(endTag)
			measure(`vue lll init`, startTag, endTag)
			console.log(performance.getEntriesByName('vue lll init')[0].duration)
			
		}

		// if (vm.$options.el) {
		// 	// vm.$mount(vm.$options.el)
		// }
	}
}

/**
 * @param {Component} Ctor
 * 
 * @test input { name: 'shi', age: 32, super: k}
 */

function resolveConstructorOptions(Ctor){
	let options = Ctor.options
	if(Ctor.super){
		const superOptions = resolveConstructorOptions(Ctor.super)
		const cachedSuperOptions = Ctor.superOptions
		if(superOptions !== cachedSuperOptions) {
			Ctor.superOptions = superOptions
			const modifiedOptions = resolveModifiedOptions(Ctor)
			if(modifiedOptions){
				extend(Ctor.extendOptions, modifiedOptions)
			}
			options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
			if(options.name) {
				options.components[options.name] = Ctor
			}
		}
	}
	return options
}


function resolveModifiedOptions (Ctor) {
	let modified
	const latest = Ctor.options
	const sealed = Ctor.sealedOptions
	for(const key in latest){
		if(latest[key] !== sealed[key]) {
			if(!modified) modified = {}
			modified[key] = latest[key]
		}
	}
	return modified
}
function initInternalComponent(){
	
}