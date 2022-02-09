import { test } from '../util'
import { initMixin } from './init'
import { stateMixin } from './state'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
test('core/instance/index1')
test('core/instance/index2')
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    console.warn(
      'Vue is a constructor and should be called with the `new` keyword'
    )
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
test('core/instance/index3')

export default Vue
