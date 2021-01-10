<template>
  <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <!-- 卡面視圖 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="請輸入內容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">增加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格區 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="商品名稱" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品價格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="創建時間" prop="add_time" width="130px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
            @click="ggg"
              >編輯</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
              >刪除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁區 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[15, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
      <!-- 分頁區Eend -->
    </el-card>

  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查詢參數物件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 15
      },
      //   產品列表
      goodslist: [],
      //   總筆數
      total: 0

    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   依據分頁獲取對應的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      // 如果取得的資料錯誤
      if (res.meta.status !== 200) {
        return this.$message.error('取得商品列表失敗!!!')
      }
      // 取得成功
      console.log(res)
      this.goodslist = res.data.goods
      this.total = res.data.total
      //   this.queryInfo.pagenum = res.data.pagenum
    },
    // 分頁區用methods
    // 每頁顯示筆數改變
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 跳轉到新的頁數去
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 刪除產品
    async removeById(id) {
      const result = await this.$confirm(
        '此動作會刪除該產品，是否繼續?',
        '提示',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已經取消刪除!!')
      }
      // 打api執行刪除
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除資料失敗!!!!')
      }
      // 刪除成功，出現刪除成功，重新讀取資料列表
      this.$message.success('刪除資料成功!!!!')
      this.getGoodsList()
    },
    // 點擊新增商品按紐,透過$route跳轉到其它頁面
    goAddpage() {
      this.$router.push('/goods/add')
    },
    ggg() {
      console.log('功能待修')
    }

  }
}
</script>
<style lang="less" scoped></style>
