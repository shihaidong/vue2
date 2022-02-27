import { isDef, isObject } from 'shared/util'

/**
 *
 * data = {
 *  class: { test1: true}
 *  staticClass: 'test test1 test2'
 * }
 * fn(d) => 'test1 test test2'
 */
/**
 * 根据vnode获取对应的className
 */
export function genClassForVnode(vnode) {
  let data = vnode.data
  let parentNode = vnode
  let childNode = vnode
  while (isDef(childNode.componentInstance)) {
    // 只有被渲染后才能获取到_vnode属性
    childNode = childNode.componentInstance._vnode
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data)
    }
  }
  while (isDef((parentNode = parentNode.parent))) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data)
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  }
}
export function renderClass(staticClass, dynamicClass) {
  if (isDef(staticClass) || isObject(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  return ''
}
export function concat(a, b) {
  return a ? (b ? a + ' ' + b : a) : b || ''
}

export function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  return ''
}

function stringifyArray(value) {
  let res = ''
  let stringified
  for (let i = 0, l = value.length; i < l; i++) {
    if (isDef((stringified = stringifyClass(value[i]))) && stringified !== '') {
      if (res) res += ' '
      res += stringified
    }
  }
}

function stringifyObject(value) {
  let res = ''
  for (const key in value) {
    if (value[key]) {
      if (res) res += ' '
      res += key
    }
  }
  return res
}
