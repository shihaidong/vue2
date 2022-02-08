import { emptyObject, defineReactive } from '../util'
import { createElement } from '../vdom/create-element'
import { resolveSlots } from './render-helpers/resolve-slots'

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
