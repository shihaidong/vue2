import { emptyObject, defineReactive, nextTick } from '../util'
import { createElement } from '../vdom/create-element'
import VNode, { createEmptyVNode } from '../vdom/vnode'
import { resolveSlots } from './render-helpers/resolve-slots'
import { normalizeScopedSlots } from '../vdom/helpers/normalize-scoped-slots'

export function initRender(vm) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-onde cached trees
  const options = vm.$options
  const parentVnode = (vm.$vnode = options._parentVnode)
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it
  // args order: tag, data, children, normalizationType, alwaysNormalize
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  const parentData = parentVnode && parentVnode.data
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(
      vm,
      '$attrs',
      (parentData && parentData.attrs) || emptyObject,
      () => {
        // !isUpdatingChildComponent && console.error('$attrs is readonly')
      },
      true
    )
    defineReactive(
      vm,
      '$listeners',
      options._parentListeners || emptyObject,
      () => {
        // !isUpdatingChildComponent && console.error('$listeners is readonly.')
      },
      true
    )
  } else {
    defineReactive(
      vm,
      '$attrs',
      (parentData && parentData.attrs) || emptyObject,
      null,
      true
    )
    defineReactive(
      vm,
      '$listeners',
      options._parentListeners || emptyObject,
      null,
      true
    )
  }
}

export let currentRenderingInstance = null

// for testing only
export function setCurrentRenderingInstance(vm) {
  currentRenderingInstance = vm
}

export function renderMixin(Vue) {
  // installRenderHelper(Vue.prototype)

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function () {
    const vm = this
    const { render, _parentVnode } = vm.$options
    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    vm.$vnode = _parentVnode

    let vnode
    try {
      currentRenderingInstance = vm
      // render函数的回调为h
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      // 假设不会出现异常
      console.log('instance/render.js')
    } finally {
      currentRenderingInstance = null
    }

    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        console.error('有且只能有一个根节点')
      }
      vnode = createEmptyVNode()
    }
    vnode.parent = _parentVnode
    return vnode
  }
}
