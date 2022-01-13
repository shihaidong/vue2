// 判断当前环境是否可以使用原型链
export const hasProto = '__proto__' in {}

// 判断浏览器环境

export const inBrowser = typeof window !== undefined

// Firefox has a 'watch' function on Object prototype
export const nativeWatch = {}.watch

export function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
export const hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol)
typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)
