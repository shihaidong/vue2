import config from '../config'
import {
	noop, test
}from '../util'
import { createComponent } from '../vdom/create-component'


/**
 * @param {Component} vm
 */
export function initState(vm){
	vm._watchers = []
	const opts = vm.$options
	// if(opts.props) initProps(vm, opts.props)
	// if(opts.methods) initMethods(vm, opts.methods)
	
}

const sharedPropertyDefinition = {
	enumerabled: true,
	configurable: true,
	get: noop,
	set: noop
}

/**
 * 
 * @param {Object} target 
 * @param {string} sourceKey 
 * @param {string} key 
 */
export function proxy(target, sourceKey, key){
	sharedPropertyDefinition.get = function proxyGetter(){
		return this[sourceKey][key]
	}
	sharedPropertyDefinition.set = function proxySetter(val){
		this[sourceKey][key] = val
	}
	Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function defineComputed(target, key, userDef){
	test("/**isServerRend/")
	const shouldCache = true
	if(typeof userDef === 'function'){
		sharedPropertyDefinition.get = shouldCache
			? createComputedGetter(key)
			: createdGetterInvoker(userDef)
	} else{
		sharedPropertyDefinition.get = userDef.get
			? shouldCache && userDef.cache !== false
				? createComputedGetter(key)
				: createdGetterInvoker(userDef.get)
			: noop
		sharedPropertyDefinition.set = userDef.set || noop
	}
	if(process.env.NODE_ENV !== 'production' &&
		sharedPropertyDefinition.set === noop) {
			sharedPropertyDefinition.set = function(){
				console.error(`Computed property "${key}" was assigned to but it has no setter.`)
			}
	}
	Object.defineProperty(target, key, sharedPropertyDefinition)
}


function createComputedGetter(key){
	return function computedGetter(){
		const watcher = this._computedWatchers && this._computedWatchers[key]
	}
}
