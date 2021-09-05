import config from '../config'



/**
 * @param {Component} vm
 */
export function initState(vm){
	vm._watchers = []
	const opts = vm.$options
	if(opts.props) initProps(vm, opts.props)
	if(opts.methods) initMethods(vm, opts.methods)
	
}
