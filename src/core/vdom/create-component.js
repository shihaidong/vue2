import VNode from './vnode'
import { resolveConstructorOptions } from '../instance/init'
import { queueActivatedComponent } from '../observer/scheduler'

import { isDef, isUndef, isTrue, isObject } from '../util'

/**
 *
 * @param {Class<Component> | Function | Object | void} Ctor
 * @param {VNodeData} data
 * @param {Component} context
 * @param {Array<VNode>} children
 * @param {string} tag
 * @return {VNode | Array<VNode> | void}
 */
export function createComponent(Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return
  }
  const baseCtor = context.$options._base
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
}
