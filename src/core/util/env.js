// 判断当前环境是否可以使用原型链
export const hasProto = '__proto__' in {}

// 判断浏览器环境

export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()

export const inWeex =
  // eslint-disable-next-line no-undef
  typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
// eslint-disable-next-line no-undef
export const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
export const isIE = UA && /mise|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isIOS =
  (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === 'ios'

// Firefox has a 'watch' function on Object prototype
export const nativeWatch = {}.watch

export function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
export const hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol)
typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)
