```javascript
let vue = {
	_isVue: true,
    _uid: 0,
    _self: Vue,

	//在调用实例init函数时初始化，调用marginOptions函数
​	$options:{	
		//实例化添加的options
​		el:'#app',
​		methods: {},
		//global-api下添加
​		_base: {
​			delete: function(){},
​			mixin: function(){},
    		//global-api初始化为一个空对象(Object.create(null))
​			options:{el: '#app', methods: {}},
​			set: function(){},
​			use: function(){},
​			util: {
​				defineReactive: function(){},
​				extend: function(){},
​				mergeOptions:function(){}
​			},
			//调用use方法时，将目标对象push到该数组中
​			_installedPlugins: [],
    		config: {...}
​		}
​	},
    //initLifcycle
    $parent: undefined,
    $root: {...},
    $children: [],
    $refs: {},
    _watcher: null,
    _directInactive: false,
    _inactive: null,
    _isMounted: false,
    _isBeingDestoryed: false,
    //initEvent
    _events: {},
    _hasHookEvent: false,    
}
```

> ​	es6模块加载路径

+ 模块加载也存在"提升"现象



> ​	初始化

+ 先执行globalapi初始化
+ 在Vue上添加方法并将其合并到Vue.options._base下
+ 



> ​	实例化

