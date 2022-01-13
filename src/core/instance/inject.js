import { toggleObserving, defineReactive } from '../observer'
import { hasSymbol, hasOwn } from '../util'
export function initProvide(vm) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function' ? provide.call(vm) : provide
  }
}
export function initInjections(vm) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach((key) => {
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          console.error(
            'Avoid mutating an injected value directly since the changes will be ' +
              'overwritten whenever the provided component re-renders. ' +
              `injection being mutated: "${key}"`
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    toggleObserving(true)
  }
}

export function resolveInject(inject, vm) {
  if (inject) {
    const result = Object.create(null)
    const keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keyw(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key === '__ob__') continue
      const provideKey = inject[key].from
      let source = vm
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
      if (!source) {
        if ('default' in inject[key]) {
          const provideDefault = inject[key].default
          result[key] =
            typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          console.warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}
