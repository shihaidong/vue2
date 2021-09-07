/**
 * @param {Component} vm
 */
import { test } from '../util'
test("core/instance/lifecycle1")
export function initLifecycle(vm){
	test('core/instance/lifecycle2')
	const options = vm.$options
	let parent = options.parent
	if(parent && !options.abstract) {
		while(parent.$options.abstract && parent.$parent){
			parent = parent.$parent
		}
		parent.$children.push(vm)
	}
	vm.$parent = parent
	vm.$root = parent ? parent.$root : vm

	vm.$children = []
	vm.$refs = {}

	vm._watcher = null
	vm._inactive = null
	vm._directInactive = false
	vm._isMounted = false
	vm._isDestroyed = false
	vm._isBeingDestroyed = false
	test('core/instance/lifecycle3')
}

