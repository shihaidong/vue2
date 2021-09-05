import { toArray } from './util'

/**
 * @param {Object} Vue
 * @param {Function | Object} plugin
 */
export function initUse(Vue) {
	Vue.use = function(plugin) {
		const installedPlugins = (this._installedPlugin || (this._installedPlugin = []))
		if(installedPlugins.indexOf(plugin) > -1){
			return this
		}
	}
	
	//additional parameters
	const args = toArray(arguments, 1);
	args.unshift(this)
	
	if(typeof plugin.install === 'function') {
		plugin.install.apply(plugin, args)
	}else if (typeof plugin === 'function'){
		plugin.apply(null, args)
	}
	installedPlugins.push(plugin)
	return this
}