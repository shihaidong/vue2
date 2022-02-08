import config from '../config'
import VNode, { createEmptyVNode } from './vnode'
import { createComponent } from './create-component'
import {
  isPrimitive,
  isTrue,
  isDef,
  isUndef,
  isObject,
  resolveAsset
} from '../util'
import { traverse } from '../observer/traverse'

import { normalizeChildren, simpleNormalizeChildren } from './helpers/index'
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

/**
 * this.$createElement = (vm, a, b, c, d, true)
 * @param {Component} context                 | vm
 * @param {any} tag                           | a
 * @param {any} data                          | b
 * @param {any} children                      | c
 * @param {any} normalizationType             | d
 * @param {boolean} alwaysNormalize           | true
 * @returns {Vnode | Array<VNode>}
 */
export function createElement(
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  /**
   * <div>
   *  <h1 class="title">title</h1>
   *  <p>this is content</p>
   * </div>
   * createElement(vm, 'div', [createElement(vm, {class:{title: true}}, 'title'), createElement(vm, 'p', 'this is content')])
   */
  // 如果第二个参数不是对象，是一个数组或者javascript基本数据类型，则认为该标签不包含data
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }

  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }

  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement(
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef(data.__ob__)) {
    process.env.NODE_ENV !== 'production' &&
      console.error(
        `Avoid using observed data object as vnode data: ${JSON.stringify(
          data
        )}\n` + 'Always create fresh vnode data objects in each render!'
      )
    return createEmptyVNode()
  }

  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    return createEmptyVNode()
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    isDef(data) &&
    isDef(data.key) &&
    !isPrimitive(data.key)
  ) {
    /* eslint-disable no-undef */
    if (!__WEEX__ || !('@binding' in data.key)) {
      console.error(
        'Avoid using non-primitive value as key, ' +
          'use string/number value instead.'
      )
    }
  }

  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }

  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
    console.log('createelement', children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    console.log(ns)
    if (config.isReservedTag(tag)) {
      if (
        process.env.NODE_ENV !== 'production' &&
        isDef(data) &&
        isDef(data.nativeOn) &&
        data.tag !== 'component'
      ) {
        console.error(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`
        )
      }

      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      )
    } else if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      vnode = new VNode(tag, data, children, undefined, undefined, context)
      console.log('**')
    }
  } else {
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS(vnode, ns, force) {
  vnode.ns = ns
  if (vnode.tag === 'foreignObject') {
    ns = undefined
    force = true
  }
  if (isDef(vnode.children)) {
    for (let i = 0, l = vnode.children.length; i < l; i++) {
      const child = vnode.children[i]
      if (
        isDef(child.tag) &&
        (isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))
      ) {
        applyNS(child, ns, force)
      }
    }
  }
}

function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style)
  }
  if (isObject(data.class)) {
    traverse(data.class)
  }
}
