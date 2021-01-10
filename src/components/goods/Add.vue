<template>
  <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>增加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <!-- 卡片視圖區 -->
    <el-card>
      <!-- 提示區 -->
      <el-alert
        title="增加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 提示區End -->
      <!-- 步驟條 -->
      <!-- activeIndex-0的用意是轉成數值 ，資料要與下面共用指定參數用 -->
      <el-steps
        :space="200"
        :active="activieIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本訊息"></el-step>
        <el-step title="商品參數"></el-step>
        <el-step title="商品屬性"></el-step>
        <el-step title="商品圖片"></el-step>
        <el-step title="商品內容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步驟條End -->
      <!-- 表單要包住所有tabs -->
      <el-form
        :model="addForm"
        :rules="addFormRules1"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <!-- Tabs區 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activieIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本訊息" name="0">
            <!-- 表單項目 -->
            <el-form-item label="商品名稱" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品價格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品數量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分類">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children'
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品參數" name="1">
            <!-- 渲染表單參數 -->
            <!-- 渲染表單item項 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <el-checkbox-group
                v-model="item.attr_vals"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  border
                  v-for="(attr_val, i) in item.attr_vals"
                  :label="attr_val"
                  :key="i"
                  >{{ attr_val }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>

            <!-- 渲染表單item項 -->
          </el-tab-pane>
          <el-tab-pane label="商品屬性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品圖片" name="3">
            <!-- action 表示圖面要上傳到後台API地址 -->
            <!-- list-type呈現列表方式指定不同值可顯示不同效果 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">點擊上傳</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品內容" name="4">
            <!-- 富文本編輯器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 文字編輯器end -->
            <el-button type="primary" class="btnAdd" @click="add"
              >增加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 表單結束 -->
    </el-card>
    <!-- 圖片預覽 -->
    <el-dialog title="圖片預覽" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 導入loadash
import _ from 'lodash'
export default {
  data() {
    return {
      // 控制步驟條和Tab位置用
      activieIndex: '0',
      // 增加商品表單資料
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品簡介-->綁定到文字編輯器
        goods_introduce: '',
        // 商品分類
        goods_cat: '[]',
        // 圖片陣列
        pics: [],
        // 靜態屬性、動態參數列表
        attrs: []
      },
      // 表單驗証規則
      addFormRules1: {
        goods_name: [
          { required: true, message: '請輸入商品名稱', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '請輸入商品價格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '請輸入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '請輸入商品數量', trigger: 'blur' }
        ]
      },
      // 存放產品分類列表
      catelist: [],
      // 動態參數存放回傳資料用
      manyTabData: [],
      checkList: [],
      // 靜態屬性存放回傳資料用
      onlyTabData: [],
      // upload URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 圖片上傳組件的請求header
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      // 圖片檔案路徑
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    // 取得所有產品分類列表
    this.getCateList()
  },
  methods: {
    // 取得所有商品分類
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('取得產品分類列表失敗!!!!')
      }
      console.log(res.data)
      this.catelist = res.data
    },
    // 選擇分類後事件
    handleChange() {
      console.log(this.addForm.goods_cat)

      // 確認是否選到的是第三級分類
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      // 如果已經選到三級分類
      // console.log(this.addForm.goods_cat[this.addForm.goods_cat.length - 1])
      // this.addForm.goods_cat = this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
    },
    // 在Tab頁籤切換前觸發
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    // Function(activeName, oldActiveName)
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即將離開的頁面名字是:' + oldActiveName + '即將進入的頁面名字是:' + activeName)
      // 如果
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('請先選擇商品分類!!!')
        return false
      }
    },
    // 當按下tab頁時觸發
    async tabClicked() {
      // console.log(this.activieIndex)
      // 訪問動態參數面板
      if (this.activieIndex === '1') {
        // console.log('動態參數面板')
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        // 判斷是否有回傳資料
        if (res.meta.status !== 200) {
          this.$message.error('取得動態參數資料失敗!!!')
        }
        // 取得資料成功，進行渲染
        console.log(res.data)
        // 處理attr_vals 回傳資料是以空白為分割，利用forEach轉成陣列
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === '' ? [] : item.attr_vals.split(' ')
        })

        this.manyTabData = res.data
      }
      // 商品屬性Tabs(靜態屬性)
      if (this.activieIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('取得靜態參數失敗！！！')
        }
        console.log('靜態參數:')
        console.log(res.data)
        this.onlyTabData = res.data
      }
    },
    handleCheckedCitiesChange() {
      console.log(this.checkList)
    },
    // 商品圖片事件
    // 處理圖片預覽事件
    handlePreview(file) {
      console.log(file)
      // previewPath
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 點擊圖片上傳刪除時觸發
    handleRemove(file) {
      console.log(file)
      // 1.取得將要刪除的圖片臨時路徑
      const filePath = 'file.response.data.tmp_path'
      // 2.從pic陣列中，找到圖片的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.調用函數splice方法，從pics中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 監聽事件上傳成功事件
    handleSuccess(response) {
      console.log(response)
      // 1.拼接得到一個圖片訊息對象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2.將圖片資料，push到pic物件資料中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 增加商品
    add() {
      // 進行其它from表單的驗証
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('請填寫必要的表單項目')
        }
        // 執行增加的必要項目邏輯
        // 到此步表示都輸入完成，打api進行存取
        // console.log(this.addForm)
        // 將原本字串，更換為一個字串拼接
        // 使用loadash 的colneDeep(obj)複制一份出來
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 取得必要參數-動態參數、靜態屬性
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })

        form.attrs = this.addForm.attrs

        // console.log(form)
        // 發起請求
        // 商品名稱必需是唯一
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          console.log(res.meta)
          return this.$message.error('新增商品失敗!!!')
        }
        // 成功
        this.$message.success('新增商品成功!!!!')
        // 重新導向頁面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
