export const emptyObject = Object.freeze({})
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
export function isDef(v) {
  return v !== undefined && v !== null
}
export function isUndef(v) {
  return v === undefined || v === null
}

export function isTrue(v) {
  return v === true
}

export function isFalse(v) {
  return v === false
}
/**
 * check if value is primitive
 * @param {Object} value
 */
export function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

const _toString = Object.prototype.toString

/**
 *
 * val = '[object Array]'
 * output = 'Array'
 */
export function toRawType(val) {
  return _toString.call(val).slice(8, -1)
}

/**
 * Strick object type check. Only returns true for plain JavaScript objects.
 */
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

/**
 * check if val is a valid  array index.
 * @param {Object} val
 */
export function isValidArrayIndex(val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
export function isPromise(val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
/**
 * check whether a object has the prototype;
 * @param {Object} obj
 * @param {string} key
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function isRegexp(obj) {
  return _toString.call(obj) === '[object RegExp]'
}
export function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}
/**
 * Capitalize a string
 */
export const capitalize = cached(str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})
/**
 * str = 'background-color'
 * output = 'backgroundColor'
 */
const camelizeRE = /-(\w)/g
export const camelize = cached(str => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

/**
 * Hyphenate a camelCase string
 * str = 'BackgroundColor'
 * output = 'background-color'
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached(str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})
/**
 * Remove an item from an array.
 * @param {Array} arr
 * @param {any} item
 * @return {Array}
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * @param {string} str
 * @param {boolean} expectsLowerCase
 * @return {function} (key:string) => true | void
 */
export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}

/**
 * Check if a tag is a build-in tag
 */

export const isBuiltInTag = makeMap('slot,component', true)

/**
 * Alowys return false
 */
export const no = (a, b, c) => false

/**
 * Mix properties into target object.
 * @param {Object} to
 * @param {Object} _from
 * @return {Object}
 */
export function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
/**
 * @param {Object} list
 * @param {number} start
 * @return {Array}
 * input [1,2,3,4,5]
 *  -> toArray(list, 2)
 * output [3,4,5]
 */
export function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
export function once(fn) {
  let tag = true
  return function () {
    if (tag) {
      tag = false
      fn.apply(this, arguments)
    }
  }
}

function polyfillBind(fn, ctx) {
  function boundFn(a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  boundFn.length = fn.length
  return boundFn
}
function nativeBind(fn, ctx) {
  return fn.bind(ctx)
}
export const bind = Function.prototype.bind ? nativeBind : polyfillBind

export function noop(a, b, c) {}

export const identity = _ => _
