import config from '../config'
import {
  noop,
  test,
  hasOwn,
  isReserved,
  bind,
  isPlainObject,
  hyphenate,
  validateProp,
  nativeWatch,
  defineReactive,
  invokeWithErrorHandling
} from '../util'
import { isUpdatingChildComponent } from './lifecycle'
import { createComponent } from '../vdom/create-component'
import { observe, toggleObserving, set, del } from '../observer'
import Dep, { pushTarget, popTarget } from '../observer/dep'
import Watcher from '../observer/watcher'

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

/**
 * @param {Component} vm
 */
export function initState(vm) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe((vm._data = {}), true)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    // initWatch(vm, opts.watch)
  }
}
function initProps(vm, propsOptions) {
  const propsData = vm.$options.propsData || {}
  const props = (vm._props = {})
  const keys = (vm.$options._propKeys = [])
  const isRoot = !vm.$parent
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          console.warn('避免在组件内部修改props')
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    if (!(key in vm)) {
      proxy(vm, '_props', key)
    }
  }
  toggleObserving(true)
}
const computedWatcherOptions = { lazy: true }

function initComputed(vm, computed) {
  const watchers = vm._computedWatchers
  // computed properties are just getters during SSR
  // isServerRendering()
  const isSSR = false
  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      console.error(`Getter is missing for computed property "${key}".`)
    }
  }
  if (!SSR) {
    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      computedWatcherOptions
    )
  }

  if (!(key in vm)) {
    defineComputed(vm, key, userDef)
  } else if (process.env.NODE_ENV !== 'production') {
    if (key in vm.$data) {
      console.error(
        `The computed property "${key}" is already defined in data.`
      )
    } else if (vm.$options.props && key in vm.$options.props) {
      console.error(
        `The computed property "${key}" is already defined as a prop.`
      )
    } else if (vm.$options.methods && key in vm.$options.methods) {
      console.error(
        `The computed property "${key}" is already defined as a method.`
      )
    }
  }
}

/**
 *
 * @param {Object} target
 * @param {string} sourceKey
 * @param {string} key
 * @description 将sourceKey下的key代理到target下
 */
export function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function defineComputed(target, key, userDef) {
  test('/**isServerRend/')
  const shouldCache = true
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function () {
      console.error(
        `Computed property "${key}" was assigned to but it has no setter.`
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this)
  }
}

function initMethods(vm, methods) {
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        console.error(
          `Method "${key}" has type "${typeof methods[
            key
          ]}" in the component definition. ` +
            'Did you reference the function correctly?'
        )
      }
      if (props && hasOwn(props, key)) {
        console.error(`Method "${key}" has already been defined as a prop.`)
      }
      if (key in vm && isReserved(key)) {
        console.error(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
            'Avoid defining component methods that start with _ or $.'
        )
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' &&
      console.error(
        'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function'
      )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        console.error(
          `Method "${key}" has already been defined as a data property.`
        )
      }
    }

    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' &&
        console.error(
          `The data property "${key}" is already declared as a prop. ` +
            'Use prop default value instead.'
        )
    } else if (!isReserved(key)) {
      proxy(vm, '_data', key)
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
  try {
    return data.call(vm, vm)
  } catch (e) {
    // handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}

export function stateMixin(Vue) {
  const dataDef = {}
  dataDef.get = function () {
    return this._data
  }
  const propsDef = {}
  propsDef.get = function () {
    return this._props
  }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      console.warn(
        'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.'
      )
    }
    propsDef.set = function () {
      console.warn('$props is readonly.')
    }
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      const info = `callback for immediate watcher "${watcher.expression}`
      pushTarget()
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
      popTarget()
    }
    return function unwatchFn() {
      watcher.teardown()
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
