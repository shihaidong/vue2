import {
  hasSymbol,
  isDef,
  isObject,
  isTrue,
  remove,
  once,
  isPromise,
  isUndef
} from '../../util'
import { createEmptyVNode } from '../vnode'
import { currentRenderingInstance } from '../../instance/render'
function ensureCtor(comp, base) {
  if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module')) {
    comp = comp.default
  }
  return isObject(comp) ? base.extend(comp) : comp
}
export function createAsyncPlaceholder(factory, data, context, children, tag) {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}

export function resolveAsyncComponent(factory, baseCtor) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }
  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  const owner = currentRenderingInstance
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    factory.owners.push(owner)
  }
  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    const owners = (factory.owners = [owner])
    let sync = true
    let timerLoading = null
    let timerTimeout = null

    owner.$on('hook:destoryed', () => remove(owners, owner))
    const forceRender = renderCompleted => {
      for (let i = 0, l = owners.length; i < l; i++) {
        owners[i].$forceUpdate()
      }
      if (renderCompleted) {
        owners.length = 0
        if (timerLoading !== null) {
          clearTimeout(timerLoading)
          timerLoading = null
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout)
          timerTimeout = null
        }
      }
    }
    const resolve = once(res => {
      factory.resolve = ensureCtor(res, baseCtor)

      if (!sync) {
        forceRender(true)
      } else {
        owners.length = 0
      }
    })

    const reject = once(reason => {
      process.env.NODE_ENV !== 'production' &&
        console.error('Failed to resolve async component')

      if (isDef(factory.errorComp)) {
        factory.error = true
        forceRender(true)
      }
    })

    const res = factory(resolve, reject)

    if (isObject(res)) {
      if (isPromise(res)) {
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject)
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject)
        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor)
        }
        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor)
          if (res.delay === 0) {
            factory.loading = true
          } else {
            timerLoading = setTimeout(() => {
              timerLoading = null
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true
                forceRender(false)
              }
            }, res.delay || 200)
          }
        }
        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(() => {
            timerTimeout = null
            if (isUndef(factory.resolved)) {
              reject(process.env.NODE_ENV !== 'production' ? 'timeout' : null)
            }
          }, res.timeout)
        }
      }
    }
    sync = false
    return factory.loading ? factory.loadingComp : factory.resolved
  }
}
