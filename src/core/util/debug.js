import config from '../config'
export function test(msg) {
  if (process.env.NODE_ENV !== 'production' && config.isTest) {
    console.log(msg)
  }
}
