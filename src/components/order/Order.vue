<template>
  <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>產品管理</el-breadcrumb-item>
      <el-breadcrumb-item>產品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片視圖區域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="請輸入內容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 訂單列表-表格 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="訂單編號" prop="order_number"></el-table-column>
        <el-table-column label="訂單價格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否發貨" prop="is_send"></el-table-column>
        <el-table-column label="下單時間" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox()"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁區 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="更改收件地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市區/縣" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addressVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addressVisible = false"
          >確 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 時間軸 -->

    <el-dialog
      title="查看出貨進度"
      :visible.sync="progressVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
80
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      addressVisible: false,
      progressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      progressInfo: [],
      addressFormRules: {
        address1: {
          reqired: true,
          message: '請選擇省市區縣',
          trigger: 'blur'
        },
        address2: {
          reqired: true,
          message: '請輸入完整地址',
          trigger: 'blur'
        }
      },
      cityData: cityData,
      activities: [
        {
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        },
        {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        },
        {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }
      ]
    }
  },
  created() {
    this.getOrderlist()
  },
  methods: {
    async getOrderlist() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('取得訂單列表失敗！！')
      }
      //   成功取得資料

      console.log(res.data)
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderlist()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderlist()
    },
    // 展示修改地址對話框
    showBox() {
      this.addressVisible = true
    },
    // 按下關閉對話框-地址
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 顯下時間軸
    async showProgressBox() {
      this.progressInfo = this.activities
      this.progressVisible = true
      // console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
