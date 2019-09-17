<template>
  <el-card class="box-card">
  <el-form ref="addForm" :model="addForm"  label-width="80px" style="margin: 60px">
    <el-form-item label="商品名称" prop="productname">
      <el-input v-model="addForm.productname"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" prop="productprice">
      <el-input v-model="addForm.productprice" @blur="sendprice(addForm.productprice)"></el-input>
    </el-form-item>
    <el-form-item label="商品图片" prop="producticon"  >
      <el-upload v-model="addForm.producticon"
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
    <el-form-item label="商品类型" prop="productcategory">
      <el-select v-model="addForm.productcategory" placeholder="商品类型"  @focus="selectCode(addForm.productcategory)">
        <el-option  v-for="items in addForm.TypeList" :key="items.categoryid" :label="items.categoryName" :value="items.categoryCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item >
      <el-button type="primary" @click="SubmitFrom">立即创建</el-button>
      <el-button @click="resetForm">取消</el-button>
    </el-form-item>
    </el-form>
  </el-card>

</template>


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

  .box-card {
    width: 600px;
    display: flex;
    align-items: center;
  }

</style>
<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        //图片列表（用于在上传组件中回显图片）
        addForm:{
          productname:'',
          productprice:'',
          producticon:'',
          productcategory:'',
          TypeList:[{}]
        },
        createid:'',
        createname:''
      }

    },

    methods:{
      //正则表达式 判断输入的价格是否为正整数 且小数点仅有后两位
      sendprice:function(num){
        var regId= /^\d+\.?\d{0,2}$/;
        if(!regId.test(num)){
          this.$message.error("请正确输入数字");
          this.addForm.productprice='';
        }
      },
      //提交添加商品表单 将数据添加到后台中
      SubmitFrom(){
        this.$axios.post('/product/save',{
          productname:this.addForm.productname,
          productprice:this.addForm.productprice,
          producticon:this.picture,
          productcategory:this.addForm.productcategory,
          createId:localStorage.getItem("userId"),
          createName:JSON.parse(window.localStorage.getItem('user')).username
        }).then(response=>{
          if(response.data.code===200){
            alert(response.data.message)
            this.$refs.addForm.resetFields();
          }else if(response.data.code===400){
            alert(response.data.message)
            this.$refs.addForm.resetFields();
          }
        })
      },
      //清空表单中的数据
      resetForm() {
        this.$refs.addForm.resetFields();
      },
      //下拉框动态查询商品类型
      selectCode(num){
        this.$axios.get('/category/findall')
          .then(res => {
            if (res.data) {
              this.addForm.TypeList=res.data
            }
          })
          .catch(failResponse => {
          })
      },
      //文件上传成功的钩子函数
      handleSuccess(res, file){
        this.$message.success("图片上传成功");
        if (file.response.code===200) {
          this.picture=file.response.message
          console.log(this.picture)
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

  }
</script>
