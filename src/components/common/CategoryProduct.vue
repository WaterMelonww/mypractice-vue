<template>
  <div>
    <el-card class="box-card">
      <div><i class="el-icon-circle-plus-outline"></i><span style="margin: 10px">增加类别</span></div>

      <el-form :inline="true" style="padding: 18px" :model="AddCategoryForm" ref="AddCategoryForm" >
        <el-form-item label="添加类别" prop="addcategoryname">
          <el-input placeholder="类别名称" v-model="AddCategoryForm.AddCategoryName" ></el-input>
        </el-form-item>
        <el-form-item label="类别类型" prop="AddCategoryType">
          <el-input placeholder="请输入类别编号" v-model="AddCategoryForm.AddCategoryCode" @blur="selectcategory" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  @click="resetAdd">重置</el-button>
          <el-button  style="background-color: cornflowerblue;color: white" @click="addCategory">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  <el-table
    :data="categoryTable"
    height="100vh"
    border
    style="width: 100%">
    <el-table-column prop="categoryId" label="类别ID" :index="categoryId">
    </el-table-column>
    <el-table-column prop="categoryName" label="类别名称" >
    </el-table-column>
    <el-table-column prop="categoryCode" label="类别类型">
    </el-table-column>
    <el-table-column prop="createName" label="创建人" width="80px">
    </el-table-column>
    <el-table-column prop="amendName" label="修改人" width="80px">
    </el-table-column>
    <el-table-column prop="creatTime" label="创建时间">
    </el-table-column>
    <el-table-column prop="updateTime" label="修改时间">
    </el-table-column>
    <el-table-column  label="操作">
      <template slot-scope="scope">
        <el-button style="background-color:darkturquoise;color: white"  size="small" @click="amendcategory(scope.$index)"
                   >修改</el-button>
        <el-dialog title="修改信息" :visible.sync="showdialog" :before-close="amendDialogClose">
          <template>
            <el-form ref="amendcategoryForm" :model="amendcategoryForm"  label-width="80px" style="margin: 60px">
              <el-form-item label="类别名称" prop="categoryName">
                <el-input v-model="amendcategoryForm.categoryName"></el-input>
              </el-form-item>
              <el-form-item label="类别类型" prop="categoryCode">
                <el-input v-model="amendcategoryForm.categoryCode" @blur="selectcategory"></el-input>
              </el-form-item>

              <el-form-item >
                <el-button type="primary" @click="SubmitAmendFrom">立即修改</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>

          </template>
        </el-dialog>
        <el-button style="background-color:#FF6666;color: white" size="small"
                   type="danger" @click="delectcategory(categoryTable[scope.$index].categoryId)"
                  >删除</el-button>
      </template>
    </el-table-column>

  </el-table></div></template>

<script>
    export default {
      inject:['reload'],
      data() {
        return {
          categoryTable: [{
          }],
          AddCategoryForm:[{
            AddCategoryName:'',
            AddCategoryCode:''
          }],
          amendcategoryForm:[{
            categoryName:'',
            categoryCode:''
          }],
          showdialog:false,
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
        delectcategory(num){
          this.$confirm('此操作将永久删除该类别, 是否继续?','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$axios.post('/category/delect',{
              categoryId:num
            }).then(responses=>{
              if(responses.data.code===200){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.reload();
              }else{
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
                this.reload();
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        SubmitAmendFrom(){
          this.$axios.post('/category/amendCategory',{
            categoryId:this.amendcategoryForm.categoryId,
            categoryName:this.amendcategoryForm.categoryName,
            categoryCode:this.amendcategoryForm.categoryCode,
            amendId:localStorage.getItem("userId"),
            amendName:JSON.parse(window.localStorage.getItem('user')).username
          }).then(response=>{
            if(response.data.code===200){
              // alert(response.data.message)
              this.$message.info("修改成功");
              this.reload();
            }else if(response.data.code===400){
              alert(response.data.message)
              this.$message.error("修改失败");
              this.modification=false;
              this.reload();
            }
          })

        },
        amendDialogClose(){
          this.cancel()
        },
        amendcategory(num){
          this.showdialog=true
          this.notamend=this.categoryTable[num]
          this.amendcategoryForm=JSON.parse(JSON.stringify(this.notamend))
        },
        cancel(){
          this.showdialog=false
          this.amendcategoryForm=JSON.parse(JSON.stringify(this.notamend))
        },
        addCategory(){
          this.$axios.post('/category/save',{
            categoryCode:this.AddCategoryForm.AddCategoryCode,
            categoryName:this.AddCategoryForm.AddCategoryName,
            createId:localStorage.getItem("userId"),
            createName:JSON.parse(window.localStorage.getItem('user')).username
          }).then(res=>{
            if(res.data.code===200){
              this.$message.success(res.data.message);
            }this.reload();
          })
        },
        selectcategory(){
          this.$axios.post('/category/byCategoryCode',{
            categoryCode:this.AddCategoryForm.AddCategoryCode
          }).then(res=>{
            if(res.data.code===200){
              this.$message.error(res.data.message);
              this.AddCategoryForm.AddCategoryCode='';
            }
          })
        },
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
