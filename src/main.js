// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from  'element-ui'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import qs from  'qs'



Vue.prototype.$qs=qs;
var axios =require('axios')
axios.defaults.baseURL='http://localhost:8081/'
Vue.prototype.$axios=axios
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)

router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    if(store.state.user.username){
      next()
    }else {
      next({
        path:'login',
        query:{redirect:to.fullPath}
      })
    }
  }else {
    next()
  }
})


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


