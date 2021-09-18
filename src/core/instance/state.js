import config from '../config'
import {
	noop, test, hasOwn, isReserved, bind, isPlainObject
}from '../util'
import { createComponent } from '../vdom/create-component'
import { observe } from '../observer'
import { pushTarget, popTarget } from '../observer/dep'


/**
 * @param {Component} vm
 */
export function initState(vm){
	vm._watchers = []
	const opts = vm.$options
	if(opts.props) initProps(vm, opts.props)
	if(opts.methods) initMethods(vm, opts.methods)
	if(opts.data){
		initData(vm)
	}else{
		observe(vm._data = {}, true)
	}
	if(opts.computed) initComputed(vm, ops.computed)
	if(opts.watch && opts.watch !== nativeWatch) {
		initWatch(vm, opts.watch)
	}
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

function initMethods (vm, methods){
	const props = vm.$options.props
	for(const key in methods) {
		if(process.env.NODE_ENV !== 'production') {
			if(typeof methods[key] !== 'function') {
				console.error(
					`Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`
				)
			}
			if(props && hasOwn(props, key)){
				console.error(
					`Method "${key}" has already been defined as a prop.`
				)
			}
			if((key in vm) && isReserved(key)){
				console.error(
					`Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
				)
			}
		}
		vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
	}
}


function initData(vm) {
	let data = vm.$options.data
	data = vm._data = typeof data === 'function'
		? getData(data, vm)
		: data || {}
	if(!isPlainObject(data)) {
		data = {}
		process.env.NODE_ENV !== 'production' && console.error(
			'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function'
		)
	}
	//proxy data on instance
	const keys = Object.keys(data)
	const porps = vm.$options.props
	let i = keys.length
	while(i--){
		const key = keys[i]
		if(process.env.NODE_ENV !== 'production') {
			if(methods && hasOwn(methods, key)) {
				console.error(
					`Method "${key}" has already been defined as a data property.`
				)
			}
		}

		if(props && hasOwn(props, key)) {
			process.env.NODE_ENV !== 'production' && console.error(
				`The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`
			)
		} else if(!isReserved(key)) {
			proxy(vm, `_data`, key)
		}
	}
	observe(data, true)
}

/**
 * 
 * @param {Functoin} data 
 * @param {Component} vm 
 */
export function getData(data, vm) {
	pushTarget()
	// data.call(vm, vm)
	try{
		return data.call(vm, vm)
	} catch (e){
		// handleError(e, vm, `data()`)
		return {}
	} finally {
		popTarget()
	}
}
