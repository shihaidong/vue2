import { pushTarget, popTarget } from '../observer/dep'

export function handleError(err, vm, info) {
  pushTarget()
  try {
    if (vm) {
      let cur = vm
      while ((cur = cur.$parent)) {
        const hooks = cur.$options.errorCaptured
        if (hooks) {
          for (let i = 0; i < hooks.length; i++) {
            try {
              const capture = hooks[i].call(cur, err, vm, info) == false
              if (capture) return
            } catch (e) {
              console.log('error.js')
              // globalHandleError(e, cur, 'errorCaptured hook')
            }
          }
        }
      }
    }
  } finally {
    popTarget()
  }
}
export function invokeWithErrorHandling(handler, context, args, vm, info) {
  let res
  try {
    res = args ? handler.apply(context, args) : handler.call(context)
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch((e) => handleError(e, vm, info + '(Promise/async)'))
      res._handled = true
    }
  } catch (e) {
    handleError(e, vm, info)
  }
  return res
}
