<template>
  <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>參數列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <!-- 卡片視圖 -->
    <el-card>
      <!-- 頭部警告區 -->
      <el-alert
        title="注意：只允許為第三級分類設定相關參數"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 選擇商品分類 -->
      <el-row class="cat_opt">
        <el-col>
          <span
            >選擇商品分類:
            <el-cascader
              v-model="selectedKeys"
              :options="catelist"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
              }"
              @change="handleChange"
            ></el-cascader>
          </span>
          <!-- 選擇商品級聯選擇框 -->
        </el-col>
      </el-row>
      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 增加動態參數面板 -->
        <el-tab-pane label="動態參數" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisable = true"
            >增加參數</el-button
          >
          <!-- 動態參數表格 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展開行 -->
            <el-table-column type="expand"
              >#
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"

                  >
                  {{ item }}
                </el-tag>
                <!-- 循環tag標籤 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 增加的按鈕 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
                <!--  -->
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="參數名稱" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >刪除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 靜態屬性 -->
        <el-tab-pane label="靜態屬性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisable = true"
            >增加靜態屬性</el-button
          >
          <!-- 靜態參數表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展開行 -->
                        <el-table-column type="expand"
              >#
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"

                  >
                  {{ item }}
                </el-tag>
                <!-- 循環tag標籤 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 增加的按鈕 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
                <!--  -->
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="屬性名稱" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >刪除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 增加參數對話框 -->
    <el-dialog
      :title="'增加' + titleText"
      :visible.sync="addDialogVisable"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 表單 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表單結束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addParams">確定</el-button>
      </span>
    </el-dialog>
    <!-- 修改參數對話框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisable"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 表單 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表單結束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editParams">確定</el-button>
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
      //   級聯選擇框雙向綁定
      selectedKeys: [],
      // Tab目前啟動的頁面
      activeName: 'many',
      // 動態參數資料
      manyTabData: [],
      // 靜態參數資料
      onlyTabData: [],
      // 控制對話框顯示與隱藏
      addDialogVisable: false,
      // 增加對話框表單
      addForm: {},
      // 表單驗証規則
      addFormRules: {
        attr_name: [
          { required: true, message: '請輸入參數名稱', trigger: 'blur' }
        ]
      },
      // 存放修改資料
      editForm: {},
      // 控制修改按鈕對話框 顯示與隱藏
      editDialogVisable: false,
      // 修改表單驗証規則
      editFormRules: {
        attr_name: [
          { required: true, message: '請輸入參數名稱', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 取得所有分類列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('取得商品分類失敗')
      }

      this.catelist = res.data
      console.log(this.catelist)
    },
    // 級聯選擇，選擇後會觸發
    handleChange() {
      this.getParamsData()
    },
    handleTabClick(tab, event) {
      // console.log(tab, event)
      console.log(this.activeName)
      this.getParamsData()
    },
    // 取得後端資料
    async getParamsData() {
      //   只允許是三級分類
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        return this.$message.error('未選中任何項目，請選擇第三級分類')
      }
      //   証明選中的是三級分類
      console.log(this.selectedKeys)

      // 發起axios請求,依所選id及所屬面板取得對應參數
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('取得參數列表資料失敗！！')
      }

      // 獲取成功
      // 判斷是靜態或是動態的資料指定給對應的變數
      res.data.forEach(item => {
        // 如果為空，則給空陣列，避免無資料時會多一個空白
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        // 控制文本框顯示與隱藏
        item.inputVisible = false
        // 文本框輸入的值
        item.inputValue = ''
      })

      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    // 增加對話框關閉事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 點擊確定新增對話框資料
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        // 如果為false表示格式不符， return
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.catId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('新增參數失敗!!!!')
        }
        this.$message.success('新增參數成功')
        this.addDialogVisable = false
        this.getParamsData()
      })
    },
    // showEditDialog 點擊按鈕展示修改對話框
    async showEditDialog(attrid) {
      console.log('88888')
      // 發起請求，依傳入id取得
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes/${attrid}`,
        {
          params: { add_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('查詢參數失敗!!!')
      }
      this.editForm = res.data
      this.editDialogVisable = true
      console.log(res)
    },
    // 修改對話框關閉事件 清空表單
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    // 點擊修改確定新增對話框資料
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        // 如果為false表示格式不符， return
        if (!valid) return
        // 通過格式驗証
        const { data: res } = await this.$http.put(
          `categories/${this.catId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改資料失敗!!!!')
        }
        this.$message.success('修改資料成功')
        this.editDialogVisable = false
        this.getParamsData()
      })
    },
    // 依據id刪除對應項目
    async removeParams(attrid) {
      const confirmResult = await this.$confirm(
        '此操作會刪除該參數，是否繼續?',
        '提示',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 使用者取消了刪除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消刪除')
      }

      // 進行刪除  ..... 程序邏輯
      const { data: res } = await this.$http.delete(
        `categories/${this.catId}/attributes/${attrid}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('刪除參數失敗!!!')
      }
      this.$message.success('刪除參數成功!!!')
      this.getParamsData()
    },
    // 輸入框失去焦點或Enter觸發
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果沒有retrun則需做後續處理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 將對attr_vals的操作，寫到資料庫
    async saveAttrVals(row) {
      // 發起請求將資料寫回後端
      const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('更新資料失敗')
      }
      this.$message.success('修改資料表成功!!!!')
    },
    // 按下按鈕，展示輸入框
    showInput(row) {
      row.inputVisible = true
      // $nextTick當列頁原去被重新渲染後才會指定回調函數
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 刪除tag呼叫 -對應可選項
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  },
  mounted() {
    //   取得所有產品分類列表
    this.getCateList()
  },
  computed: {
    // 控制tabs中的button依是否選擇，回傳是否啟用
    // 如果button要被禁用返回true
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      } else return false
    },
    // 目前選中的三級分類id
    catId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 動態屬性及靜態屬性對話框判斷-標題
    titleText() {
      if (this.activeName === 'many') {
        return '動態參數'
      } else return '靜態屬性'
    }

  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin:10px
}
.input-new-tag {
  width: 150px;
}
</style>
