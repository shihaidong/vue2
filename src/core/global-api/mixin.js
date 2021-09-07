import { mergeOptions } from '../util'

/**
 * @param {Object} Vue
 * @param {Object} mixin
 */
console.log("core/global-api/mixin1")
export function initMixin (Vue) {	
	console.log("core/global-api/mixin2")
	Vue.mixin = function(mixin) {
		/**
		 * 静态方法中的this指向该类的构造器(构造器也是一个应用类型)
		 * console.log(this)
		*/
	
		this.options = mergeOptions(this.options, mixin)
		console.log("core/global-api/mixin3")
		return this
	}
}