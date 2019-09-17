<template>
  <div>
    <div class="select"><el-card class="box-card">
      <div><i class="el-icon-search"></i><span style="margin: 10px">筛选搜索</span></div>

      <el-form :inline="true" ref="ruleForm" :model="ruleForm" :rules="formRules">
        <el-form-item label="输入搜索" prop="selectname">
          <el-input placeholder="商品名称"  v-model="ruleForm.selectname"></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="selectid" >
          <el-input placeholder="商品货号" v-model="ruleForm.selectid" @blur="sendid(ruleForm.selectid)"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="selectCode">
          <el-select  placeholder="商品分类" v-model="ruleForm.selectCode" @focus="selectCode(ruleForm.selectCode)">
            <el-option  v-for="item in ruleForm.CodeList" :key="item.categoryid" :label="item.categoryName" :value="item.categoryCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态"  prop="selectStatus">
          <el-select  placeholder="上架状态" v-model="ruleForm.selectStatus">
            <el-option label="上架" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        <el-button style="position: fixed; right: 170px; top:100px; height:40px;width: 66px; " @click="resetForm">重置</el-button>
        <el-button  style="position: fixed; right: 70px; top:100px; height:40px;width: 66px;" type="primary" @click="submitForm('ruleForm')" >查询</el-button>
        </el-form-item></el-form>
    </el-card></div>


  <el-table
    :data="tableData"
    height="100vh"
    border
    style="width: 100%"
    >
  <el-table-column prop="productId" label="商品ID" :index="productId"  width="80px">
  </el-table-column>
  <el-table-column prop="productName" label="商品名称" width="100px">
  </el-table-column>
  <el-table-column prop="productPrice" label="商品价格"   width="80px">
  </el-table-column>
    <el-table-column prop="productIcon" label="商品图片" align="center">
      <template slot-scope="scope">
      <el-image
        style="width: 100px; height: 100px"
        :src="scope.row.productIcon"
        :preview-src-list="[scope.row.productIcon]"></el-image>
      </template>

    </el-table-column>
    <el-table-column prop="productStatus" label="商品状态" width="120px">
      <template slot-scope="scope">
      <el-switch
        v-model="scope.row.productStatus==0?true:false"
        active-text="上架"
        inactive-text="下架"
        disabled
        >
      </el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="categoryName" label="商品类型" width="80px">
    </el-table-column>
    <el-table-column prop="creatTime" label="创建时间" width="100px">
  </el-table-column>
    <el-table-column prop="updateTime" label="修改时间" width="100px">
    </el-table-column>
    <el-table-column prop="createName" label="创建人" width="80px">
    </el-table-column>
    <el-table-column prop="amendName" label="修改人" width="80px">
    </el-table-column>
    <el-table-column  label="操作" width="120px">
      <template slot-scope="scope">
      <el-button style="background-color:darkturquoise;color: white"  size="medium"
                 @click="amendproduct(scope.$index)">修改</el-button>
        <el-dialog title="修改信息" :visible.sync="modification" :before-close="handleDialogClose">
          <template>
              <el-form ref="amendForm" :model="amendForm" :rules="amendFormRules" label-width="80px" style="margin: 60px">
                <el-form-item label="商品名称" prop="productName">
                  <el-input v-model="amendForm.productName"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="productPrice">
                  <el-input v-model="amendForm.productPrice" @blur="sendid(amendForm.productPrice)"></el-input>
                </el-form-item>
                <el-form-item label="商品图片" prop="productIcon"  >
                  <el-upload v-model="amendForm.productIcon"
                             ref="upload"
                             action="http://localhost:8081/product/upload"
                             name="picture"
                             list-type="picture-card"
                             :limit="1"
                             :file-list="fileList"
                             :on-exceed="onExceed"
                             :before-upload="beforeUpload"
                             :on-preview="handlePreview"
                             :on-success="handleSuccess"
                             :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus" ></i>
                    </span>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible" >
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
                <el-form-item label="上架状态"  prop="productStatus">
                  <el-select  placeholder="上架状态" v-model="amendForm.productStatus">
                    <el-option  v-for="(items,index) in StatusList" :key="index" :value="items.value" :label="items.label"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品分类" prop="categoryCode">
                  <el-select  placeholder="商品分类" v-model="amendForm.categoryCode" @focus="selectCode(amendForm.categoryCode)">
                    <el-option  v-for="item in TypeList" :key="item.categoryid" :label="item.categoryName" :value="item.categoryCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary" @click="SubmitFrom">立即修改</el-button>
                  <el-button @click="callOff">取消</el-button>
                </el-form-item>
              </el-form>

          </template>
        </el-dialog>
      <el-button style="background-color:#FF6666;color: white" size="medium"
                 type="danger"
                 @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>

</el-table></div>
</template>

<script>
  export default {
    data() {
      return {
        tableData:[{    //查询时返回的数据绑定
          // productid:'',
          // productname:'',
          // productprice:'',
          // producticon:'',
          // productStatus:'',
          // createtime:'',
          // uptime:''
        }],
        ruleForm:{    //按条件动态查询时的数据绑定
          selectname:'',
          selectd:'',
          selectCode:'',
          selectStatus:'',
          CodeList:[{
          }]
        },
        TypeList:[], //用来接收从接口中获取出来的值
        amendForm:{    //修改商品数据时的数据绑定
          productName:'',
          productPrice:'',
          productIcon:'',
          productStatus:'',
          categoryCode:'',
        },
        modification:false,
        notamend:[],
        StatusList:[
          {
            value:0,
            label:'上架'
          },
          {
            value:1,
            label:'下架'
          }
        ],
      }

    },
    created(){
      this.mounted();
    },
    mounted(){
      var that = this;
      this.$axios
        .post('/product/findbydinamic', {    //初始化页面时，按动态查询条件都为空
          selectid:  this.ruleForm.selectid,
          selectname: this.ruleForm.selectname,
          selectCode:this.ruleForm.selectCode,
          selectStatus:this.ruleForm.selectStatus
        })
        .then(successResponse => {
          if (successResponse.data) {
            this.tableData=successResponse.data.map(i=> {
              i.productIcon==null||i.productIcon==""?i.productIcon=null:i.productIcon=i.productIcon
              return i
            })
          }
        })
        .catch(failResponse => {
        })
    },
    methods:{
      //点击取消按钮 dom元素中的事务回滚
      callOff(){
        this.modification=false
        this.amendForm=JSON.parse(JSON.stringify(this.notamend))
      },
      //点击关闭按钮 dom元素中的事务回滚
      handleDialogClose(){
        this.callOff()
      },
      //修改商品时，将当前要修改的记录赋值给修改表单 省去一次查询
      amendproduct(num){
        this.$axios.get('/category/findall')
        .then(res => {
          if (res.data) {
            this.TypeList=res.data
          }
          // alert(JSON.stringify(this.TypeList))
        })
        .catch(failResponse => {
        })
        this.modification=true
        this.notamend=this.tableData[num]
        this.amendForm=JSON.parse(JSON.stringify(this.notamend))
         // alert(JSON.stringify(this.notamend))
      },
      //正则表达式  判断该输入框是否为正整数 且最多输入小数点后两位
      sendid:function(num){
        var regId= /^\d+\.?\d{0,2}$/;
        if(!regId.test(num)){
          this.$message.error("请正确输入数字");
          this.ruleForm.selectid='';
          this.amendForm.productPrice='';
        }
      },
      //下拉框动态查询商品类型
      selectCode(num){
        this.$axios.get('/category/findall')
          .then(res => {
            if (res.data) {
              this.ruleForm.CodeList=res.data
              this.TypeList=res.data
            }
          })
          .catch(failResponse => {
          })
      },
      //清除表单 当点击取消或者重置时
      resetForm() {
        this.$refs.ruleForm.resetFields();
      },
      //按条件动态查询结果
      submitForm(){
        // console.log(this.ruleForm.selectid)
        //   console.log(this.ruleForm.selectname)
        //   console.log(this.ruleForm.selectCode)
        //   console.log(this.ruleForm.selectStatus)

        this.$axios
          .post('/product/findbydinamic', {
            selectid:  this.ruleForm.selectid,
            selectname: this.ruleForm.selectname,
            selectCode:this.ruleForm.selectCode,
            selectStatus:this.ruleForm.selectStatus
          })
          .then(successResponse => {
            if (successResponse.data) {
              this.tableData=successResponse.data.map(i=> {
                // i.productStatus ==1 ? i.productStatus = false:i.productStatus = true;
                i.productIcon==null||i.productIcon==""?i.productIcon=null:i.productIcon=i.productIcon
                return i
              })
            }
          })
          .catch(failResponse => {
          })
    }}
  };
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .el-form-item{

  }
  .box-card {
    width: 100%;
    /*height: 300px;*/

  }
  .el-button{
    padding: 6px;
  }
  .el-switch{
    height: 52px;

  }
  .select{
    margin-bottom: 10px;
  }
</style>
