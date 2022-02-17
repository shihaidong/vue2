import VNode from './vnode'
import { resolveConstructorOptions } from '../instance/init'
import { queueActivatedComponent } from '../observer/scheduler'
import {
  resolveAsyncComponent,
  createAsyncPlaceholder
} from './helpers/resolve-async-component'
import { isDef, isUndef, isTrue, isObject } from '../util'
import { activeInstance } from '../instance/lifecycle'

const componentVNodeHooks = {
  /**
   * @param {VNodeWithData} vnode
   * @param {boolean} hydrating
   */
  init(vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestoryed &&
      vnode.data.keepAlive
    ) {
      const mountedNode = vnode
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ))
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
  /**
   * @param {MountedComponentVNode} oldVnode
   * @param {MountedComponentVNode} vnode
   */
  prepatch(oldVnode, vnode) {
    const options = vnode.componentOptions
    const child = (vnode.componentInstance = oldVnode.componentInstance)
    // updateChildComponent(
    //   child,
    //   options.propsData,
    //   options.listeners,
    //   vnode,
    //   options.length
    // )
  },
  /**
   * @param {MountedComponentVNode} vnode
   */
  insert(vnode) {},
  /**
   *
   * @param {MountedComponentVNode} vnode
   */
  destory(vnode) {}
}

const hooksToMerge = Object.keys(componentVNodeHooks)
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
  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Invalid Component definition')
    }
    return
  }
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    if (Ctor === undefined) {
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
    }
  }
  data = data || {}
  resolveConstructorOptions(Ctor)

  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }
  const propsData = null
  // const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  if (isTrue(Ctor.options.functional)) {
    // return createFunctionComponent(Ctor, propsData, data, context, children)
  }

  const listeners = data.on

  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  installComponentHooks(data)

  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  // 此处有省略代码
  return vnode
}

export function createComponentInstanceForVnode(vnode, parent) {
  const options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}

/**
 *
 * @param {VNodeData} data
 */
function installComponentHooks(data) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

function mergeHook(f1, f2) {
  const merged = (a, b) => {
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data) {
  const prop = (options.model && options.model.prop) || 'value'
  const event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value
  const on = data.on || (data.on = {})
  const existing = on[event]
  const callback = data.model.callback
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing)
    } else {
      on[event] = callback
    }
  }
}
