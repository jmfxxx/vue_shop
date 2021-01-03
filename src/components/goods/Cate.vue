<template>
  <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>產品管理</el-breadcrumb-item>
      <el-breadcrumb-item>產品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片視圖區 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDailog"
            >增加分類</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        border
        show-index
        index-text="#"
        class="TreeTable"
      >
        <!--是否有效  -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;font-size:24px"
          ></i>
          <i class="el-icon-error" v-else style="color:red;font-size:24px"></i>
        </template>
        <!-- 排序slot -->
        cat_level
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一級</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二級</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三級</el-tag>
        </template>
        <!--操作功能  -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >編輯</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >刪除</el-button
          >
        </template>
      </tree-table>
      <!-- 分頁區 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 新增產品分類 -->
    <el-dialog
      title="新增產品分類"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="addCatDialogClosed"
    >
      <!-- 新增產品分類表單 -->
      <el-form
        :model="AddCatForm"
        :rules="AddCatFormRules"
        ref="addCatFormRef"
        label-width="150px"
      >
        <el-form-item label="產品分類名稱" prop="cat_name">
          <el-input v-model="AddCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父級分類">
          <!-- options 資料選項
         props用來指定配置對象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover', //移動到會顯示
              value: 'cat_id',        //對應到的值是cat_id
              label: 'cat_name',      //顯示對應到類別名稱
              children: 'children'    //子選單對應名稱
            }"
           clearable
           change-on-select
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 表單結束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCatsubmitForm">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分類列表
      catelist: [],
      // API需要之參數值
      queryInfo: {
        type: 3, // 取得1-3級列表
        pagenum: 1, // 第1頁
        pagesize: 5 // 每頁5筆資料
      },
      total: 0, // 總資料筆數
      // TreeTable用的列的定義
      columns: [
        {
          label: '分類名稱',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 表示使用自定義模版
          type: 'template',
          // 模版名稱
          template: 'opt'
        }
      ],
      // 控制新增產品分類對話框
      addCatedialogVisible: false,
      // 新增產品分類表單變數
      AddCatForm: {
        // 父層分類
        cat_pid: 0,
        // 指定分類,
        cat_name: '',
        // 第一級分類
        cat_level: 0
      },
      // 產品分類名稱驗証規則
      AddCatFormRules: {
        cat_name: [
          { required: true, message: '請輸入分類名稱', trigger: blur },
          {
            min: 2,
            max: 16,
            message: '分類名稱2~16之間',
            trigger: 'blur'
          }
        ]
      },
      // 父級分類的列表
      parentCateList: [],
      // 指定級聯的選擇器配對對象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 選中的父級分類的id數組
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 取得商品分類列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('取得產品分類失敗')
      }
      this.catelist = res.data.result
      console.log(this.catelist)
      this.total = res.data.total // 取出總筆數
    },
    // 頁數改變時觸發-監聽pageSize
    handleSizeChange(newPagSize) {
      this.queryInfo.pagesize = newPagSize
      this.getCateList()
    },
    // 監聽pagenum的改變
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 點擊新增產器分類按鈕
    showAddCateDailog() {
      this.addCatedialogVisible = true
      this.getParentCateList()
      console.log(this.AddCatForm)
    },

    addCatDialogClosed() {
      this.$refs.addCatFormRef.resetFields()
      // 清空選擇項目
      this.selectedKeys = []
      // 將預設選擇的變數清除 級別及父類 恢復預設值
      this.AddCatForm.cat_level = 0
      this.AddCatForm.cat_pid = 0
    },
    // 點下確認後送
    AddCatsubmitForm() {
      console.log(this.AddCatForm)
      // 驗証輸入內容
      this.$refs.addCatFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.AddCatForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('增加分類失敗!!!')
        }
        this.$message.success('新增產品分類成功!!!!')
        // 重新取得列表
        this.getCateList()
        // 關閉對話框
        this.addCatedialogVisible = false
      })
    },
    // 取得分類列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('取得產品分類失敗')
      }
      // console.log(res)
      this.parentCateList = res.data
    },
    // 選擇項發生變化觸發這個function
    parentCateChange() {
      console.log(this.selectedKeys)
      // 判斷是否有選擇項目，用sleectedKeys來判斷 >0有選
      if (this.selectedKeys.length > 0) {
        // 父級分類ID
        this.AddCatForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 為目前分類加上分類等級
        this.AddCatForm.cat_level = this.selectedKeys.length
      } else {
        // 若都不符合，則都是屬於第1級
        this.AddCatForm.cat_pid = 0
        this.AddCatForm.cat_level = 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
.TreeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
