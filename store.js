/**
 * 状态管理类
 * @constructor 构造函数
 * @_data  内部数据，用来保存页面数据
 * @addData 添加页面数据的方法
 * @removeData 移除不需要的页面数据，减小内存压力
 */
class Store {
  constructor() {
    this._data = {};
  }

  /**
   * 向数据池里添加数据
   * @param { Object<this> } context 保存当前页面的执行上下文，也就是当前页面的 this
   * @param { String } name 当前页面数据的名字，用于在别的页面读取数据,默认值为当前页面的路径
   */
  addData(context, name) {
    // 如果传了 name 就用传过来的，如果未传就用页面路径
    let routeName = name ? name : context.route;
    //设置代理，用于简化操作
    let proxyContext = new Proxy(context, {
      // 获取数据,如果数据在外层,返回外层数据
      get: function(context, property) {
        if (property in context) {
          return context[property];
        } else {
          // 如果外层找不到数据, 就在 "this.data" 里找,若有，返回数据
          if (property in context.data) {
            return context.data[property];
          } else {
            //若没有,报错
            console.error(`${name}页面没有此属性`);
          }
        }
      },
      // 改变数据, 封装 "this.setData", 简化操作
      set: function(context, property, value) {
        context.setData({
          [property]: value
        });
        return true;
      },
      // 判断数据是否存在
      has: function(context, property) {
        return property in context.data;
      }
    });
    // 将代理对象添加进数据池
    this._data[routeName] = proxyContext;
  }

  /**
   * 从数据池里移除页面数据
   * @param { String } name 需要移除的页面的名字
   */
  removeData(name) {
    if (name in this._data) {
      delete this._data[name];
    } else {
      console.error(`希望删除的属性不存在`);
    }
  }
}

// 创建单例对象,全局共享一个数据池
const store = new Store();

// 创建代理, 私有化 _data, 简化用户操作, 提高安全性
let proxyStore = new Proxy(store, {
  // 若访问的属性为 add remove 函数, 直接返回函数
  get: function(store, property) {
    if (property in store) {
      return store[property];
    } else {
      // 若访问的数据为页面数据, 则返回页面代理对象
      if (property in store._data) {
        return store._data[property];
      } else {
        // 若没有页面信息, 报错
        console.error("访问的页面数据未载入数据池");
      }
    }
  }
});

export default proxyStore;
