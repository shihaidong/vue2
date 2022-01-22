import { observe, shouldObserve, toggleObserving } from '../observer'
import { hasOwn, hyphenate, isObject } from './util'
// type PropOptions = {
//   type: Function | Array<Function> | null,
//   default: any,
//   required: ?boolean,
//   validator: ?Function
// }
export function validateProp(key, propOptions, propsData, vm) {
  //  组件内部的props参数
  const prop = propOptions[key]
  //  组件实际传递的props数据
  const absent = !hasOwn(propsData, key)
  let value = propsData[key]
  // boolean casting
  const booleanIndex = getTypeIndex(Boolean, prop.type)
  if (booleanIndex > -1) {
    //  布尔类型的props默认为false
    if (absent && !hasOwn(prop, 'default')) {
      value = false
    } else if (value === '' || value === hyphenate(key)) {
      const stringIndex = getTypeIndex(String, prop.type)
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true
      }
    }
  }
  //  check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    const prevShouldObserve = shouldObserve
    toggleObserving(true)
    observe(value)
    toggleObserving(toggleObserving)
  }
  /**
   * 还有为定义代码
   */
  return value
}

function getPropDefaultValue(vm, prop, key) {
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  const def = prop.default
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    console.warn('Invalid default for prop')
  }

  if (
    vm &&
    vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm.props[key]
  }
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

const functionTypeCheckRE = /^\s*function (\w+)/
/**
 * use function string name to check built-in types,
 * because a simple equality check will fail when runing
 * across different wms / iframes
 */
function getType(fn) {
  const match = fn && fn.toString().match(functionTypeCheckRE)
  return match ? match[1] : ''
}
function isSameType(a, b) {
  return getType(a) === getType(b)
}
function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (let i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}
