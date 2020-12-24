<template>
  <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區塊 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 新增角色button -->
          <el-button type="primary" @click="addDialogVisible = true"
            >新增角色</el-button
          >
          <!--  -->
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <!-- 展開類 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 第1級權限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第2,3級權限 -->

              <el-col :span="19">
                <!-- 通過for來渲染二級權限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 3級權限 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                    <!-- v-for="(item3) in item2.children" :key="item3.id" >
                    <el-tag> {{item3.authName}}</el-tag> -->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- {{ scope.row }} -->
            <pre></pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名稱" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="showRoleDialog(scope.row.id)"
              icon="el-icon-edit"
              >編輯</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="delRole(scope.row.id)"
              icon="el-icon-delete"
              >刪除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配權限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 增加用戶的對話框 -->
    <el-dialog
      title="新增使用者"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 內容主體區 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleRef"
        label-width="80px"
      >
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部區 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">確 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的對話框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 內容主體區 -->
      <el-form
        :model="editRoleForm"
        :rules="editRoleRules"
        ref="editRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部區 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">確 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配權限對話框 -->
    <el-dialog
      title="分配權限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 樹狀結構元件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      //   新增用戶對話框
      addDialogVisible: false,
      // 控制分配權限對話框 顯示/Hidden
      setRightDialogVisible: false,
      // 存放回傳的權限列表用
      rightList: [],
      // 樹狀結構屬性綁定對象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 預設選中結果ID
      defKeys: [],
      // 目前即將分配權限的ID
      roleId: [],
      //   新增角色存放變數
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '請輸入角色名稱', trigger: blur },
          {
            min: 2,
            max: 16,
            message: '角色名稱2~16之間',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '請輸入角色描述', trigger: blur },
          {
            min: 0,
            max: 40,
            message: '說明長度0~40之間',
            trigger: 'blur'
          }
        ]
      },
      // 查詢到的用戶訊息
      editForm: {},
      //   修改使用者對話框
      editDialogVisible: false,
      //   修改角色存放變數
      editRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: '',
        rolePermissionDesc: ''
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '請輸入角色名稱', trigger: blur },
          {
            min: 3,
            max: 16,
            message: '角色名稱3~16之間',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '請輸入角色描述', trigger: blur },
          {
            min: 0,
            max: 40,
            message: '說明長度0~40之間',
            trigger: 'blur'
          }
        ]
      },
      // 分配角色對話框
      setRoleDialogVisible: false
    }
  },
  mounted() {
    this.getrolesList()
  },
  methods: {
    async getrolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('取得角色列表失敗')
      }
      this.rolesList = res.data
    },
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 送出新增角色資料post
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('新增角色失敗!!!')
        }
        this.$message.success('新增角色成功!')
        // 隱藏新增使用者對話框
        this.addDialogVisible = false
        // 重新載入使用者列表
        this.getrolesList()
      })
    },
    // addDialogClosed 關閉新增對話框時執行
    addDialogClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 查詢要修改角色的資料
    async showRoleDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查詢修改的使用者失敗')
      }
      this.editRoleForm = res.data
      console.log(res.data)
      //   顯示修改對話框，並依讀取資料送出
      this.editDialogVisible = true
    },
    // 修改角色對話框-修改
    editRoleInfo() {
      this.$refs.editRoleFormRef.validate(async valid => {
        console.log('aaa' + valid)
        console.log('editRoleForm ===>' + this.editRoleForm.roleId)
        if (!valid) return
        // 送出新增角色資料post
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        console.log(res)
        console.log(
          this.editRoleForm.roleName + '-----' + this.editRoleForm.roleDesc
        )

        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失敗!!!')
        }
        this.$message.success('修改角色成功!')
        // 隱藏修改使用者對話框
        this.editDialogVisible = false
        // 重新載入使用者列表
        this.getrolesList()
      })
    },
    // addDialogClosed 關閉新增對話框時執行
    editDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },

    // 刪除角色
    async delRole(id) {
      // 出現提示框確認是否刪除
      const result = await this.$confirm('是否刪除此角色?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(result)
      if (result !== 'confirm') {
        return
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除角色失敗!')
      }
      //   更新角色列表
      this.getrolesList()
      //   回應更新成功
      this.$message.success('更新角色成功!')
    },
    // 依ID刪除應對權限
    async removeRightById(role, rightId) {
      console.log(role)
      // 彈框訊息詢問是否刪除使用messagebox
      const confirmResult = await this.$confirm(
        '此動作會移除權限是否要移除?',
        '提示',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消刪除!!!')
      }
      // console.log('確認了刪除!!!')
      const { data: res } = await this.$http.delete(
        `/roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('刪除權限失敗!!!')
      }
      // this.getrolesList()
      role.children = res.data
    },
    // 展示分配權限的對話框
    async showSetRightDialog(role) {
      console.log('-----------')
      console.log(role)
      console.log('-----------')

      this.roleId = role.id // 將取得的role.id給roleID做權限指定用
      // 透過遞迴函數取得目前的三級節點
      this.getLeafKeys(role, this.defKeys)
      // 顯示權限對話框
      // 取得所有數據
      this.setRightDialogVisible = true
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('取得權限列表失敗!!!!')
      }
      // 把取得到的權限保存到rightList陣列中
      this.rightList = res.data
      console.log(this.rightList)
    },
    // 透過遞迴方式取得所有三級權限id，並保存到defKeys中
    getLeafKeys(node, arr) {
      // 如果當前node節點不含children則表示3級節點
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 監聽分配權限對話框關閉事件
    setRightDialogClosed() {
      // 清除選擇的項目，避免取得上次選擇的值
      this.defKeys = []
    },
    // 點擊選擇後為權限增加
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`/roles/${this.roleId}/rights`, { rids: idStr })
      // console.log(keys)
      if (res.meta.status !== 200) {
        return this.$message.error('指定權限列表失敗!!!!')
      }
      this.$message.success('設定權限列表成功!!!!')
      this.getrolesList()
      this.setRightDialogVisible = false
    }

  }
}
</script>
<style>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
