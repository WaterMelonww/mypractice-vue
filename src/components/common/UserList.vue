<template>
<div><el-table
  :data="tableData"
  height="100vh"
  border
  style="width: 100%">
  <el-table-column prop="buyerid" label="用户ID">
  </el-table-column>
  <el-table-column prop="buyername" label="用户名称" >
  </el-table-column>
  <el-table-column prop="buyerphone" label="用户手机号">
  </el-table-column>
  <el-table-column prop="creattime" label="创建时间">
  </el-table-column>
  <el-table-column  label="操作">
    <template slot-scope="scope">
      <el-button style="background-color:darkturquoise;color: white"
                 @click="dialogFormVisible = true">修改</el-button>
    </template>
  </el-table-column>

</el-table></div>
</template>

<script>
    export default {
      data() {
        const item = {
          buyerid: '007',
          buyername: '王小虎',
          buyerphone: '1339999999',
          creattime: '2016-05-02',
        };
        return {
          tableData: Array(5).fill(item),
          value1:true
        }
      }
    }
</script>

<style scoped>

</style>
