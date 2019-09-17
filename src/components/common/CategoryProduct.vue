<template>
  <div>
    <el-card class="box-card">
      <div><i class="el-icon-circle-plus-outline"></i><span style="margin: 10px">增加类别</span></div>

      <el-form :inline="true" style="padding: 18px" :model="categoryform" ref="categoryform" >
        <el-form-item label="添加类别" prop="addcategoryname">
          <el-input placeholder="类别名称" v-model="categoryform.addcategoryname" ></el-input>
        </el-form-item>
        <el-form-item label="类别类型" prop="addcategorytype">
          <el-input placeholder="请输入类别编号" v-model="categoryform.addcategorytype" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  @click="resetAdd">重置</el-button>
          <el-button  style="background-color: cornflowerblue;color: white" @click="addProduct('categoryform')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  <el-table
    :data="categoryTable"
    height="100vh"
    border
    style="width: 100%">
    <el-table-column prop="categoryId" label="类别ID">
    </el-table-column>
    <el-table-column prop="categoryName" label="类别名称" >
    </el-table-column>
    <el-table-column prop="categoryCode" label="类别类型">
    </el-table-column>
    <el-table-column prop="creatTime" label="创建时间">
    </el-table-column>
    <el-table-column prop="updateTime" label="修改时间">
    </el-table-column>
    <el-table-column  label="操作">
      <template slot-scope="scope">
        <el-button style="background-color:darkturquoise;color: white"  size="small"
                   >修改</el-button>
        <el-button style="background-color:#FF6666;color: white" size="small"
                   type="danger"
                  >删除</el-button>
      </template>
    </el-table-column>

  </el-table></div></template>

<script>
    export default {
      data() {
        return {
          categoryTable: [{
            categoryid: '',
            categoryname: '',
            categorytype: '',
            updatetime: '',
            creattime: '',
          }],
          categoryform:[{
            addcategoryname:'',
            addcategorytype:''
          }]
        }
      },
      created(){
        this.mounted();
      },
      mounted(){
        var that = this;
        this.$axios.get('http://localhost:8081/category/findall')
          .then(res => {
            if (res.data) {
              this.categoryTable=res.data
            }
          })
          .catch(failResponse => {
          })
      },
      methods:{
        resetAdd() {
          this.$refs.categoryform.resetFields();
        },
      }
    }
</script>

<style scoped>
  .el-form-item{
    margin-right: 40px;
  }
</style>
