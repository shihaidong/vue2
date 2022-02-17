import config from '../config'
import { isDef, isUndef, isTrue, isRegexp, invokeWithErrorHandling } from '../util'
import VNode from './vnode'

export const emptyNode = new VNode('', {}, [])

const hooks = ['create', 'activate', 'update', 'remove', 'destory']

function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory.error)))
  )
}

function sameInputType(a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type
  const typeB = isDef((i = b.data)) && isDef((i = i.attr)) && i.type
  // return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB))
  return typeA === typeB
}

export function createPatchFunction(backend) {
  let i, j
  /**
   * cbs = {
   *  create:[fn],
   *  activate: [fn],
   *  update: [fn],
   * ...
   * }
   */
  const cbs = {}
  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  function emptyNode(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb(childElm, listeners) {
    function remove() {
      if (--remove.listeners === 0) {
        removeNode(childElm)
      }
    }
    remove.listeners = listeners
    return remove
  }
  function removeNode(el) {
    const parent = nodeOps.parentNode(el)
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el)
    }
  }

  function isUnknownElement(vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(ignore => {
          return isRegexp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      )
    )
  }

  function invokeDestoryHook(vnode){
    let i,j
    const data = vnode.data
    if(isDef(data)){
      if(isDef(i=data.hook) && isDef(i = i.destory)) i(vnode)
    }
  }
  return function patch(oldVnode, vnode, hydrating, removeOnly){
    if(isUndef(vnode)){
      if(isDef(oldVnode) invokeDestoryHook(oldVnode))
      return
    }
  }
}
