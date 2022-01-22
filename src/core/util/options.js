import config from '../config'
import { unicodeRegExp } from './lang'
import { nativeWatch, hasSymbol } from './env'
import {
  isBuiltInTag,
  hasOwn,
  isPlainObject,
  extend,
  toRawType,
  camelize
} from './util'
import { set } from '../observer'

import { ASSET_TYPES, LIFECYCLE_HOOKS } from './constants'

// Object.create(null)
const strats = config.optionMergeStrategies

if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      console.error(
        `option "${key}" can only be used during instance ` +
          'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }
}

const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal
}
strats.data = function (parentVal, childVal, vm, key) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' &&
        console.error(
          'The "data" option should be a function ' +
            'that returns a per-instance value in component ' +
            'definitions.'
        )
      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }
  return mergeDataOrFn(parentVal, childVal, vm)
}
/**
 *
 * @param {Function} parentVal
 * @param {Function} childVal
 * @param {*} vm
 * parentVal = function(){
 *  return {
 *    name: 'shi'
 *  }
 * }
 * childVal = function(){
 *  return {
 *    age: 32
 *  }
 * }
 */
export function mergeDataOrFn(parentVal, childVal, vm) {
  if (!vm) {
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    return function mergedDataFn() {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstnceDataFn() {
      // instance merge
      const instanceData =
        typeof childVal === 'function' ? childVal.call(vm, vm) : childVal
      const defaultData =
        typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
/**
 *
 * @param {Object} to
 * @param {?Object} from
 * @returns {Object}
 */
function mergeData(to, from) {
  if (!from) return to
  let key, toVal, fromVal
  const keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from)
  for (let i = 0; i < keys.length; i++) {
    key = key[i]
    // in case the object is already observed...
    if (key === '__ob__') continue
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
/**
 *
 * @param {Array<Function>} parentVal
 * @param {Function | Array<Functoin>} childVal
 * @returns {Array<Functoin>}
 */
function mergeHook(parentVal, childVal) {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
      ? childVal
      : [childVal]
    : parentVal
  return res ? dedupeHooks(res) : res
}

function dedupeHooks(hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
function mergeAssets(parentVal, childVal, vm, key) {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

function assertObjectType(name, value, vm) {
  if (!isPlainObject(value)) {
    console.error(
      `Invalid value for option "${name}": expected an Object, ` +
        `but got ${toRawType(value)}.`
    )
  }
}

strats.watch = function (parentVal, childVal, vm, key) {
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /** istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child)
      ? child
      : [child]
  }
  return ret
}

strats.props =
  strats.methods =
  strats.inject =
  strats.computed =
    function (parentVal, childVal, vm, key) {
      if (childVal && process.env.NODE_ENV !== 'production') {
        assertObjectType(key, childVal, vm)
      }
      if (!parentVal) return childVal
      const ret = Object.create(null)
      extend(ret, parentVal)
      if (childVal) extend(ret, childVal)
      return ret
    }

strats.provide = mergeDataOrFn

/**
 * Validate component names
 * @param {Object} options
 */
function checkComponents(options) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}
/**
 * @param {string} name
 */
export function validateComponentName(name) {
  if (
    !new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)
  ) {
    console.error(
      'Invalid component name: "' +
        name +
        '". Component names ' +
        'should conform to valid custom element name in html5 specification.'
    )
  }
  /**
   * slot和component不可作为name
   */
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    console.error(
      'Do not use built-in or reserved HTML elements as component ' +
        'id: ' +
        name
    )
  }
}
/**
 * @param {Object} parent
 * @param {Object} child
 * @param {vm} Component
 * @return {Object}
 */
export function mergeOptions(parent, child, vm) {
  if (process.env.NODE_ENV !== 'production') {
    // 检查所有注册在该vue实例上的组件名称是否‘合法’
    checkComponents(child)
  }
  if (typeof child === 'function') {
    child = child.options
  }
  // 用于vuecomponent
  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    /**
     * components directives filters _base
     */
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      //* **与下列有关 */
      mergeField(key)
    }
  }
  function mergeField(key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key) //* **与上列有关 */
  }
  return options
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 * @param {Object} options
 * @param {vm} vm
 */

function normalizeProps(options, vm) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        console.error('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val) ? val : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    console.error(
      'Invalid value for option "props": expected an Array or an Object, ' +
        `but got ${toRawType(props)}.`
    )
  }
  options.props = res
}

function normalizeInject(options, vm) {
  const inject = options.inject
  if (!inject) return
  const normalized = (options.inject = {})
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: key }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    console.error(
      'Invalid value for option "inject": expected an Array or an Object, ' +
        `but got ${toRawType(inject)}.`
    )
  }
}
function normalizeDirectives(options) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}

export function resolveAsset(options, type, id, warnMissing) {
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelized(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    console.error('Failed to resolve ' + type.slice(0, -1) + ': ' + id)
  }
  return res
}
