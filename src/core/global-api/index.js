import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del, observe } from '../observer/index'

import {
  extend,
  // nextTick,
  mergeOptions,
  defineReactive,
  test,
  ASSET_TYPES
} from '../util'
test('core/global-api/index1')
export function initGlobalAPI(Vue) {
  test('core/global-api/index2')
  const configDef = {}
  configDef.get = () => config

  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      console.error(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  Vue.util = {
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  // Vue.nextTick = nextTick
  Vue.observable = (obj) => {
    observe(obj)
    return obj
  }

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + 's'] = Object.create(null)
  })
  Vue.options._base = Vue
  // extend(Vue.options.components, builtInComponents);
  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
  test('core/global-api/index3')
}
