// activatedChildren: Array<Component>
const activatedChildren = []

export function queueActivatedComponent(vm) {
  vm._inactive = false
  activatedChildren.push(vm)
}
