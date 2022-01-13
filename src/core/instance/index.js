import { test } from '../util'
import { initMixin } from './init'
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
test('core/instance/index3')

export default Vue
