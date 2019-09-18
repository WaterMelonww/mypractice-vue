<template>
  <div>
    <div class="select"><el-card class="box-card">
      <div><i class="el-icon-search"></i><span style="margin: 10px">筛选搜索</span></div>

      <el-form :inline="true" ref="ruleForm" :model="ruleForm">
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
              <el-form ref="amendForm" :model="amendForm"  label-width="80px" style="margin: 60px">
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
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
                <el-form-item label="上架状态"  prop="productStatus">
                  <el-select  placeholder="上架状态" v-model="amendForm.productStatus">
                    <el-option  v-for="(items,index) in StatusList" :key="index" :value="items.value" :label="items.label"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品分类" prop="categoryCode">
                  <el-select  placeholder="商品分类" v-model="amendForm.categoryCode" @focus="selectCode(amendForm.categoryName)">
                    <el-option  v-for="(itemss,index) in TypeList" :key="index" :value="itemss.categoryCode" :label="itemss.categoryName" >
                    </el-option>
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
                 @click="delectproduct(tableData[scope.$index].productId)">删除</el-button>
      </template>
    </el-table-column>

</el-table></div>
</template>

<script>
  export default {
    inject:['reload'],
    data() {
      return {
        tableData:[{    //查询时返回的数据绑定
          // productId:'',
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
        TypeList:[{
          // categoryName:'',
          // categoryCode:''
        }], //用来接收从接口中获取出来的值
        amendForm:{    //修改商品数据时的数据绑定
          productName:'',
          productPrice:'',
          productIcon:'',
          productStatus:'',
          categoryCode:'',
        },
        modification:false,
        dialogVisible: false,
        dialogImageUrl: '',
        notamend:[], //用来接受回滚时的数据
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
      //删除商品
      delectproduct(num){
        // this.notamend=this.tableData[num]
        this.$confirm('此操作将永久删除该商品, 是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{

          this.$axios.post('/product/delect',{
            productId:num
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
      //提交修改
      SubmitFrom(){
        this.$axios.post('/product/amend',{
          productId:this.amendForm.productId,
          productName:this.amendForm.productName,
          productPrice:this.amendForm.productPrice,
          productIcon:this.amendForm.productIcon,
          productStatus:this.amendForm.productStatus,
          categoryCode:this.amendForm.categoryCode,
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
        })
        .catch(failResponse => {
        })
        this.modification=true
        this.notamend=this.tableData[num]
        this.amendForm=JSON.parse(JSON.stringify(this.notamend))
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
      },
      //文件上传成功的钩子函数
      handleSuccess(res, file){
        this.$message.success("图片上传成功");
        if (file.response.code===200) {
          this.amendForm.productIcon=file.response.message
          //将返回的文件储存路径赋值picture字段
        }
      },
      handleRemove(file, fileList) {
        this.$message.success("删除成功");
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //上传的文件个数超出设定时触发的函数
      onExceed(files, fileList) {
        this.$message({
          type: 'info',
          message: '最多只能上传一个图片',
          duration: 2000
        });
      },
      //文件上传前的前的钩子函数
      //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
      beforeUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          alert('上传图片必须是JPG/GIF/PNG/BMP 格式!');
        }
        if (!isLt2M) {
          alert('上传图片大小不能超过 2MB!');
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      },
    }
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
