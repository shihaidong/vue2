console.log("core/instance/index1")
import { initMixin } from './init'
console.log("core/instance/index2")
function Vue(options){
	if(process.env.NODE_ENV !== 'production' &&
		!(this instanceof Vue)
	) {
		console.warn('Vue is a constructor and should be called with the `new` keyword')
	}
	this._init(options)
}

initMixin(Vue)
console.log("core/instance/index3")

export default Vue