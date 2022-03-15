/**
 * @param {Component} vm
 */
import {
  test,
  invokeWithErrorHandling,
  remove,
  mark,
  measure,
  noop
} from '../util'
import { pushTarget, popTarget } from '../observer/dep'
import { createEmptyVNode } from '../vdom/vnode'
import config from '../config'
import Watcher from '../observer/watcher'
test('core/instance/lifecycle1')
export let activeInstance = null
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

export function setActiveInstance(vm) {
  const preActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = preActiveInstance
  }
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

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    const vm = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    if (!prevVnode) {
      // vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false)
    } else {
      // vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
  }

  Vue.prototype.$forceUpdate = function () {
    const vm = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }

  Vue.prototype.$destory = function () {
    const vm = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestory')
    vm._isBeingDestroyed = true
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
  }
}

export function mountComponent(vm, el, hydrating) {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el ||
        el
      ) {
        console.warn(
          'you are using the runtime-only build of Vue where the template compiler is not available. either pre-compile the templates into render function, or use the compiler-included build'
        )
      } else {
        console.wrrn(
          'Failed to mount component: template or render function not defined'
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  // 如果是非生产环境则获取加载所需时间
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      // vm._render会初始化vnode
      // vm._update会patchvnode
      vm._update(vm._render(), hydrating)
    }
  }

  // eslint-disable-next-line no-new
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate')
        }
      }
    },
    true
  )

  hydrating = false

  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }

  return vm
}
