# 小程序跨页面访问数据解决方案

## 简介

主要是想解决小程序跨页面访问数据的问题，常见的解决方法有，将数据暂存到 localStorage 里然后在另一个页面 get 这个值，也有许多大手子写了 订阅发布 模式的小程序状态管理。但是我想用一种最简单，最优雅，并且让用户可以很方便的使用的小工具。

## 安装

将 store.js 文件放在 utils 文件夹( 可以是任意文件夹 )下即可，然后引入文件。

## 引入

```js
import store from "path/store.js"
```

## 使用

推荐的使用流程是这样的，比如 b 页面需要用到 a 页面里的数据。

1. 先在 a 页面引入 store 然后在 onload 方法里使用 `store.addData(this, "a")` 来将当前页面的执行上下文加载到 store 的数据池里。
2. 在 b 页面引入 store ，然后就可以在 b 页面通过 `store.a.数据名` 来获取相应数据的值，也可以通过 `store.a.数据名 = "balabala"` 来给相应的数据赋值，这里注意，这样的赋值方式是响应式的，不需要通过 `setData` 函数来赋值就可以达到效果。(暂未实现 `setData` 方式赋值，推荐使用直接赋值)

## 方法简介

- 添加页面数据

  ```js
  store.addData( context, name )
  ```

  参数说明：

  - context

    执行上下文，也就是当前页面的 `this`

  - name

    命名当前页面，也就是在别的页面取值的时候 `store.name.属性`，默认值为当前页面的路径

- 移除页面数据

  ```
  store.removeData( name )
  ```

  参数说明

  - name

    希望删除的页面数据的名字

- 获取数据

  ```
  let value = store.页面name.属性
  ```

  这样既可获取数据，后台是用代理封装了数据池，从而方便用户使用

- 修改数据

  ```js
  store.页面name.属性 = value
  ```

  这样赋值即可，后台使用的依然是封装的 `setData` 

- 检测属性是否存在

  ```
  property in store.页面name
  ```

  