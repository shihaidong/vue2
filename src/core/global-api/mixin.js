import { mergeOptions } from '../util'

/**
 * @param {Object} Vue
 * @param {Object} mixin
 */
export function initMixin (Vue) {
	Vue.mixin = function(mixin) {
		/**
		 * 静态方法中的this指向该类的构造器(构造器也是一个应用类型)
		 * console.log(this)
		*/
		this.options = mergeOptions(this.options, mixin)
		return this
	}
}