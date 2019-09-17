<template>
<div><el-table
  :data="tableData"
  height="100vh"
  border
  style="width: 100%">
  <el-table-column prop="orderid" label="订单编号">
  </el-table-column>
  <el-table-column prop="username" label="买家名称" >
  </el-table-column>
  <el-table-column prop="orderamount" label="订单总金额">
  </el-table-column>
  <el-table-column prop="orderstatus" label="订单状态">
  </el-table-column>
  <el-table-column prop="paystatus" label="支付状态">
  </el-table-column>
  <el-table-column prop="creattime" label="创建时间">
  </el-table-column>
  <el-table-column prop="updatetime" label="修改时间">
  </el-table-column>
  <el-table-column  label="操作">
    <template slot-scope="scope">
      <el-button @click="dialogTableVisible = true" size="small">查看详情</el-button>
      <el-dialog title="订单详情" :visible.sync="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column property="productname" label="商品名称" width="150"></el-table-column>
          <el-table-column property="productquantity" label="商品数量" width="200"></el-table-column>
          <el-table-column property="productprice" label="商品单价"></el-table-column>
          <el-table-column property="productpricetotal" label="商品价格"></el-table-column>
          <el-table-column property="producticon" label="商品图片"></el-table-column>
        </el-table>
      </el-dialog>
    </template>
  </el-table-column>

</el-table></div>
</template>

<script>
    export default {
      data() {
        return {
          tableData:[{
            orderid: '2016-05-02',
            username: '王小虎',
            orderamount: '上海市普陀区金沙江路 1518 弄',
            orderstatus: 'xxx.png',
            paystatus: '0',
            updatetime: '2016-05-02',
            creattime: '2016-05-02',
          }],
          gridData: [{
            productname: '锅包肉',
            productquantity: '1',
            productprice: '10.5',
            productpricetotal:'productquantity*productprice',
            producticon:'xxx.png'
          }, {
            productname: '酸辣土豆丝',
            productquantity: '2',
            productprice: '10.5',
            producticon:'xxx.png'
          }, {
            productname: '鱼香茄子',
            productquantity: '1',
            productprice: '10.5',
            producticon:'xxx.png'
          }, {
            productname: '荷兰豆',
            productquantity: '1',
            productprice: '10.5',
            producticon:'xxx.png'
          }],
          dialogTableVisible: false,
          dialogFormVisible: false,
          form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          },
          formLabelWidth: '120px'
        };
      }
    }
</script>

<style scoped>

</style>
