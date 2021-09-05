
//判断当前环境是否可以使用原型链
export const hasProto = '__proto__' in {}

//判断浏览器环境

export const inBrowser = typeof window !== undefined



