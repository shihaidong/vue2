import { isObject } from '../util'
import VNode from '../vdom/vnode'
const seenObjects = new Set()

/**
 *
 * @param {*} val
 *
 * { 'active': true, 'text-danger' : false}
 * [ 'active', {'text': true}, true ? 'start' : 'end']
 */
export function traverse(val) {
  _traverse(val, seenObjects)
  console.log(seenObjects)
  // seenObjects.clear()
}

function _traverse(val, seen) {
  let i, keys
  const isA = Array.isArray(val)

  if (
    (!isA && !isObject(val)) ||
    Object.isFrozen(val) ||
    val instanceof VNode
  ) {
    return
  }

  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
