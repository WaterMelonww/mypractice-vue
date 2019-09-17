<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" >
    <el-breadcrumb-item
      v-for='(item,index) in levelList'
      :key='index' v-if='item.name'>{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
    export default {
      name:'Breadcrumb',
       data(){
         return {
           levelList:null
         }
       },
      created(){
        this.getBreadcrumb();
      },
      methods:{
        getBreadcrumb(){
          let matched =this.$route.matched.filter(item => item.name);
          const first=matched[0];//清空面包屑中已经匹配的路径
          this.levelList=matched; //把新添加的记录存入监听集合
        }
      },
      watch:{
        $route(){
          this.getBreadcrumb(); //面包屑监听
        }
    }
    }
</script>

<style>
  .el-breadcrumb{
    font-size: 15px;
    float: left;
    margin: 28px
  }
</style>
