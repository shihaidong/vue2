import config from '../config'
import { unicodeRegExp } from './lang'
import { isBuiltInTag  } from './util'
import { set } from '../observer'

import {
	ASSET_TYPES,
	LIFECYCLE_HOOKS
} from './constants'

const strats = config.optionMergeStrategies

if(process.env.NODE_ENV != 'production') {
	strats.el = strats.propsData = function(parent, child, vm, key) {
		if(!vm) {
			console.error(`option "${key}" can only be used during instance ` +
			'creation with the `new` keyword.'
			)
		}
		return defaultStrat(parent, child)
	}
}

const defaultStrat = function(parentVal, childVal) {
	return childVal === undefined ? parentVal : childVal
}


/**
 * Validate component names
 * @param {Object} options
 */
function checkComponents(options) {
	for(const key in options.components) {
		validateComponentName(key)
	}
}
/**
 * @param {string} name
 */
export function validateComponentName (name) {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    console.error(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }
	/**
	 * slot和component不可作为name
	 */
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    console.error(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}
/**
 * @param {Object} parent 
 * @param {Object} child
 * @param {vm} Component
 * @return {Object}
 */
export function mergeOptions (parent, child, vm) {
	return Object.assign(parent, child)
	if(process.env.NODE_ENV !== 'production') {
		//检查所有注册在该vue实例上的组件名称是否‘合法’
		checkComponents(child);
	}
	
	// if(typeof child === 'function') {
	// 	child = child.options
	// }
	// normalizeProps(child, vm)
	// normalizeInject(child, vm)
	// normalizeDirectives(child)
	// if(!child._base) {
	// 	if(child.extends) {
	// 		parent = mergeOptions(parent, child.extends, vm)
	// 	}
	// 	if(child.mixins){
	// 		for(let i = 0, l = child.mixins.length; i < 1; i++){
	// 			parent = mergeOptions(parent, child.mixins[i], vm)
	// 		}
	// 	}
	// }
	
	// const options = {}
	// let key
	// for(key in parent){
	// 	mergeField(key)
	// }
	// for(key in child){
	// 	if(!hasOwn(parent, key)){
	// 		mergeField(key)
	// 	}
	// }
	// function mergeField(key){
	// 	const strat = strats[key] || defaultStrat
	// 	options[key] = strat(parent[key], child[key], vm, key)
	// }
	// return options
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 * @param {Object} options 
 * @param {vm} vm
 */

function normalizeProps(options, vm) {
	const props = options.props
	if(!props) return;
}

function normalizeInject(options, vm){
	const inject = options.inject
	if (!inject) return
}
function normalizeDirectives(options, vm){
	
}