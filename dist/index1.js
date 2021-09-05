"use strict";
(self["webpackChunkwebpackvue3"] = self["webpackChunkwebpackvue3"] || []).push([["index1"],{

/***/ "./src/js/array.js":
/*!*************************!*\
  !*** ./src/js/array.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayMethods": () => (/* binding */ arrayMethods)
/* harmony export */ });
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/index */ "./src/js/util/index.js");
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dep */ "./src/js/dep.js");


const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)


const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  ;(0,_util_index__WEBPACK_IMPORTED_MODULE_0__.def)(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})

/***/ }),

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  // _lifecycleHooks: LIFECYCLE_HOOKS
});

/***/ }),

/***/ "./src/js/dep.js":
/*!***********************!*\
  !*** ./src/js/dep.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Dep),
/* harmony export */   "pushTarget": () => (/* binding */ pushTarget),
/* harmony export */   "popTarget": () => (/* binding */ popTarget)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/js/util/index.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/js/config.js");


let uid = 0;
class Dep {
  static target;
  // id: number;
  // subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    (0,_util__WEBPACK_IMPORTED_MODULE_0__.remove)(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if ( true && !_config_js__WEBPACK_IMPORTED_MODULE_1__.default.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target
}

function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _observer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer.js */ "./src/js/observer.js");


let s = {
	name: 'shi',
	sex: 'male',
	age: 32,
	address: 'xzsf',
	otherInformation: {
		skill: 'computer',
		hobbity: 'basketball'
	}
	
}


let k = new _observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer(s)


// k.value = Object.freeze(t)
console.log(k.value)

/***/ }),

/***/ "./src/js/observer.js":
/*!****************************!*\
  !*** ./src/js/observer.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shouldObserve": () => (/* binding */ shouldObserve),
/* harmony export */   "toggleObserving": () => (/* binding */ toggleObserving),
/* harmony export */   "Observer": () => (/* binding */ Observer),
/* harmony export */   "observe": () => (/* binding */ observe),
/* harmony export */   "defineReactive": () => (/* binding */ defineReactive),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "del": () => (/* binding */ del)
/* harmony export */ });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ "./src/js/dep.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/js/util/index.js");
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./array */ "./src/js/array.js");




const arrayKeys = Object.getOwnPropertyNames(_array__WEBPACK_IMPORTED_MODULE_2__.arrayMethods)


/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
let shouldObserve = true

function toggleObserving (value) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
class Observer {
  // value: any;
  // dep: Dep;
  // vmCount: number; // number of vms that have this object as root $data

  constructor (value) {
    this.value = value
    this.dep = new _dep__WEBPACK_IMPORTED_MODULE_0__.default()
    this.vmCount = 0
    ;(0,_util__WEBPACK_IMPORTED_MODULE_1__.def)(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (true) {
        protoAugment(value, _array__WEBPACK_IMPORTED_MODULE_2__.arrayMethods)
      } else {}
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
/**
 * @param {Object} src 
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * @param {any} value 
 * @param {asRootData} boolean 
 * @return {Observer | void}  
 */
function observe (value, asRootData) {
	//value instanceof VNode
  if (!(0,_util__WEBPACK_IMPORTED_MODULE_1__.isObject)(value) || false) {
    return
  }
  let ob;
  if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    // !isServerRendering() &&
    (Array.isArray(value) || (0,_util__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * @param {Object} obj 
 * @param {String} key 
 * @param {any} val 
 * @param {Function} customSetter?
 * @param {boolean} shallow?
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  const dep = new _dep__WEBPACK_IMPORTED_MODULE_0__.default()
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (_dep__WEBPACK_IMPORTED_MODULE_0__.default.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 * 
 * @param {Array | Object} target
 * @param {any} key
 * @param {any} val
 * @return {any}  
 */
function set (target, key, val) {
  if ( true &&
    ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isUndef)(target) || (0,_util__WEBPACK_IMPORTED_MODULE_1__.isPrimitive)(target))
  ) {
    console.warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target)}`)
  }
  if (Array.isArray(target) && (0,_util__WEBPACK_IMPORTED_MODULE_1__.isValidArrayIndex)(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
     true && console.warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 * @param {Array | Object} target
 * @param {any} key  
 */
function del (target, key) {
  if ( true &&
    ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isUndef)(target) || (0,_util__WEBPACK_IMPORTED_MODULE_1__.isPrimitive)(target))
  ) {
    console.warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target)}`)
  }
  if (Array.isArray(target) && (0,_util__WEBPACK_IMPORTED_MODULE_1__.isValidArrayIndex)(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
     true && console.warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!(0,_util__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 * @param {Array} value  
 */
function dependArray (value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}




/***/ }),

/***/ "./src/js/util/index.js":
/*!******************************!*\
  !*** ./src/js/util/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "def": () => (/* reexport safe */ _lang_js__WEBPACK_IMPORTED_MODULE_0__.def),
/* harmony export */   "hasOwn": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_1__.hasOwn),
/* harmony export */   "isObject": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_1__.isObject),
/* harmony export */   "isPlainObject": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject),
/* harmony export */   "isPrimitive": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_1__.isPrimitive),
/* harmony export */   "isUndef": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_1__.isUndef),
/* harmony export */   "isValidArrayIndex": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_1__.isValidArrayIndex),
/* harmony export */   "remove": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_1__.remove)
/* harmony export */ });
/* harmony import */ var _lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lang.js */ "./src/js/util/lang.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./src/js/util/util.js");



/***/ }),

/***/ "./src/js/util/lang.js":
/*!*****************************!*\
  !*** ./src/js/util/lang.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "def": () => (/* binding */ def)
/* harmony export */ });
/**
 * @param {Object} obj 
 * @param {string} key 
 * @param {val} any 
 * @param {boolean} enumerable 
 */

function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/***/ }),

/***/ "./src/js/util/util.js":
/*!*****************************!*\
  !*** ./src/js/util/util.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isUndef": () => (/* binding */ isUndef),
/* harmony export */   "isPrimitive": () => (/* binding */ isPrimitive),
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject),
/* harmony export */   "isValidArrayIndex": () => (/* binding */ isValidArrayIndex),
/* harmony export */   "hasOwn": () => (/* binding */ hasOwn),
/* harmony export */   "remove": () => (/* binding */ remove)
/* harmony export */ });
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isUndef (v) {
  return v === undefined || v === null
}

/**
 * check if value is primitive
 * @param {Object} value
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

const _toString = Object.prototype.toString;

/**
 * Strick object type check. Only returns true for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

/**
 * check if val is a valid  array index.
 * @param {Object} val
 */
function isValidArrayIndex (val){
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * check whether a object has the prototype;
 * @param {Object} obj 
 * @param {string} key
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}


/**
 * Remove an item from an array.
 * @param {Array} arr  
 * @param {any} item
 * @return {Array}   
 */
function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/js/index.js"));
/******/ }
]);
//# sourceMappingURL=index1.js.map