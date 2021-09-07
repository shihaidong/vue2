console.log("core/index1")
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
console.log("core/index2")
initGlobalAPI(Vue)
console.log("core/index3")
export default Vue
