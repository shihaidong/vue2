/**
 * @param {Component} vm
 */
import { test, invokeWithErrorHandling } from '../util'
import { pushTarget, popTarget } from '../observer/dep'
test('core/instance/lifecycle1')

export const isUpdatingChildComponent = false
export function initLifecycle(vm) {
  test('core/instance/lifecycle2')
  const options = vm.$options
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
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

/**
 *
 * @param {Component} vm
 * @param {string} hook
 */
export function callHook(vm, hook) {
  pushTarget()

  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
