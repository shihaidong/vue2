import { invokeWithErrorHandling, toArray } from '../util'
// 所有event会被注册到当前实例的_events数组中
export function initEvents(vm) {
  vm._events = Object.create(null)
  //  当有@hook:<hook>时会被置为true
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners

  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

let target

function add(event, fn) {
  target.$on(event, fn)
}

function remove(event, fn) {
  target.$off(event, fn)
}
function createOnceHandler(event, fn) {
  const _target = target
  return function onceHandler() {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}
export function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm
  // updateListeners(
  //   listeners,
  //   oldListeners || {},
  //   add,
  //   remove,
  //   createOnceHandler,
  //   vm
  // )
  target = undefined
}

export function eventsMixin(Vue) {
  const hookRE = /^hook:/
  /**
   * @param {string | Array} event
   * @param {Function} fn
   * @return {Component}
   */
  Vue.prototype.$on = function (event, fn) {
    const vm = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      ;(vm._events[event] || (vm._events[event] = [])).push(fn)
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }
  Vue.prototype.$once = function (event, fn) {
    const vm = this
    function on() {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event, fn) {
    const vm = this
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event) {
    const vm = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        console.log('**')
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
}
