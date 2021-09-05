import { initMixin } from './init'

function Vue(options){
	if(process.env.NODE_ENV !== 'production' &&
		!(this instanceof Vue)
	) {
		console.warn('Vue is a constructor and should be called with the `new` keyword')
	}
	this._init(options)
}


initMixin(Vue)


export default Vue