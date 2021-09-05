import { mergeOptions } from '../util'

/**
 * @param {Object} Vue
 * @param {Object} mixin
 */
export function initMixin (Vue) {
	Vue.mixin = function(mixin) {
		console.log("************",this)
		this.options = mergeOptions(this.options, mixin)
		return this
	}
}