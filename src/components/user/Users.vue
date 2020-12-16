/* eslint-disable vue/no-unused-vars */ /* eslint-disable vue/no-unused-vars */
<template>
  <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片視圖 -->
    <el-card>
      <!-- 搜索與增加區 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="請輸入內容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addDialogVisible = true"
            >增加使用者</el-button
          ></el-col
        >
      </el-row>
      <!-- 用戶列表區 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="Email" prop="email"></el-table-column>
        <el-table-column label="電話" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="狀態">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改 -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 刪除按鈕 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="刪除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete "
                size="mini"
                @click="delUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按鈕 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="設定"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁區域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 卡片視圖  -->
    <!-- 增加用戶的對話框 -->
    <el-dialog
      title="新增使用者"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 內容主體區 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="使用者" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="電話" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部區 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">確 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用戶的對話框 -->
    <el-dialog
      title="修改用戶"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="使用者">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 驗証emial規則
    var checkEmail = (rule, value, cb) => {
      // 驗証email正則表達式
      // eslint-disable-next-line no-useless-escape
      const regEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      if (regEmail.test(value)) {
        // 合法的email
        return cb()
      }
      cb(new Error('請輸入合法的信箱'))
    }

    // 驗証信箱規則
    var checkMobile = (rule, value, cb) => {
      // 驗証手機正則表達式
      const regMobile = /^((0\d{3}-\d{6}))$/
      if (regMobile.test(value)) {
        // 合法的email
        return cb()
      }
      cb(new Error('請輸入合法的手機號碼'))
    }

    return {
      // 取得用戶列表參數物件
      queryInfo: {
        query: '',
        // 當前頁數
        pagenum: 1,
        // 每頁顯示多少筆
        pagesize: 2
      },
      userlist: [],
      total: 0,
      //   控制新增用戶對話框顯示與隱藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 增加表單驗証規則
      addFormRules: {
        username: [
          { required: true, message: '請輸入使用者名稱', trigger: blur },
          {
            min: 3,
            max: 10,
            message: '使用者帳號長度3~10之間',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '請輸入使用者密碼', trigger: blur },
          {
            min: 6,
            max: 15,
            message: '使用者帳號長度6~15之間',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '請輸入使用者Email', trigger: 'blur' },
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: '請輸入使用者電話', trigger: 'blur' },
          { validator: checkMobile }
        ]
      },
      // 控制使用者修改對話框 顯示和隱藏．
      editDialogVisible: false,
      // 查詢到的用戶訊息
      editForm: {},
      // 修改表單驗証規則
      editFormRules: {
        email: [
          { required: true, message: '請輸入使用者Email', trigger: 'blur' },
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: '請輸入使用者電話', trigger: 'blur' },
          { validator: checkMobile }
        ]
      }
    }
  },
  created() {
    //   發起請求
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('取得用戶資料失敗!')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 監聽Pagesize改變事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 頁碼值發生變化時事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 監聽開關狀態的改變
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      console.log(res)
      //   操作失敗時
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('使用者更新狀態失敗')
      }
      //   更新態成功
      this.$message.success('更新狀態成功!')
    },
    // 對話框關閉事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 點擊增加新用戶
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 可以發起增加用戶請求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('增加使用者失敗!!!!')
        }
        this.$message.success('新增使用者成功!!!!')
        // 隱藏增加用戶的對話框
        this.addDialogVisible = false
        // 重誅取得使用者列表
        this.getUserList()
      })
    },
    // 修改對話框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查詢使用者失敗')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      // console.log(id)
    },
    // 監聽修改使用者對話框事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改使用者資料並送出
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 發起修改訊息的資料請求

        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新使用者資料失敗！')
        }
        // 關閉對話框
        this.editDialogVisible = false

        // 刷新資料列表
        this.getUserList()

        // 提示修改成功
        this.$message.success('更新資料成功!!!!')
      })
    },
    // 刪除提示框
    async delUser(id) {
      console.log('---------------')
      console.log(id)
      const result = await this.$confirm('此操作會永久刪除使用者,是否繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(result)
      if (result !== 'confirm') {
        return
      }
      const { data: res } = await this.$http.delete('users/' + id)
      // 判斷回傳資料
      // 如果沒有刪除成功，則回應訊息，並跳出
      if (res.meta.status !== 200) {
        return this.$message.error('刪除使用者失敗！')
      }
      // 更新使用者列表
      this.getUserList()
      // 回應訊息
      this.$message.success('刪除資料成功!!!!')
    }
  }
}
</script>
<style lang="less" scoped></style>
