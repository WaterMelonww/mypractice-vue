import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/views/Home'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
     component:Login
    },
    {
      path:'/home',
      name:'首页',
      component:Home,
      meta:{
        requireAuth:true
      },
      children:[
        {
          path:'/product/productlist',
          name:'商品列表',
          component:()=>import('@/components/common/ProductList')
        },
        {
          path:'/product/productadd',
          name:'添加商品',
          component:()=>import('@/components/common/AddProduct')
        },
        {
          path:'/product/productcategory',
          name:'商品分类',
          component:()=>import('@/components/common/CategoryProduct')
        },
        {
          path:'/order/orderlist',
          name:'订单列表',
          component:()=>import('@/components/common/OrderList')
        },
        {
          path:'/user/userlist',
          name:'用户列表',
          component:()=>import('@/components/common/UserList.vue')
        },
      ]}
  ]
})
