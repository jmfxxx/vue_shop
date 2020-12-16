<template>
    <div class="login_container">
     <div class="login_box">
         <div class="avatar_box">
             <!-- 頭像區 -->
             <img src="../assets/logo.png" alt="">
         </div>
             <!-- 登入表單區 -->
             <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
                 <!-- 使用者 -->
                <el-form-item prop="username" >
                 <el-input  prefix-icon="iconfont icon-user" v-model="loginForm.username" >   </el-input>
                </el-form-item>
                <!-- 密碼 -->
                 <el-form-item prop="password" >
                    <el-input type="password"  prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" ></el-input>
                </el-form-item>
                <!-- 按鈕區 -->
                  <el-form-item class="btns" >
                <el-button type="primary" @click="login">登入</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
                  </el-form-item>
                </el-form>
     </div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      // 表單綁定變數
      loginForm: {
        username: '',
        password: ''
      },
      //   表單驗証規則物件
      loginFormRules: {
        //   驗証username
        username: [
          { required: true, message: '請輸入登入名稱', trigger: 'blur' },
          { min: 3, max: 20, message: '長度 3 到 20 字元', trigger: 'blur' }
        ],
        //   驗証password
        password: [
          { required: true, message: '請輸入使用者密碼', trigger: 'blur' },
          { min: 5, max: 20, message: '長度 5 到 20 字元', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    //   重置登入表單
    resetLoginForm () {
    //   console.log(this)    //會得到vue實例物件
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登入失敗')
        this.$message.success('登入成功')
        // 1.將登錄成功後之token保存到Client端的sessionStorage中
        // 1.1.項目中出了登錄之外的API接口，必需在登錄之後才能訪問
        // 1.2.token只應用在目前網頁打開期間生效，所以將token保存在sessionStorage中
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通過編程式導航跳轉到後台主頁，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background:#fff;
    border-radius: 3px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
 .avatar_box {
     height: 130px;
     width: 130px;
     border:1px solid #eee;
     border-radius: 50%;
     padding: 10px;
     box-shadow: 0 0 10px #ddd;
     position: absolute;
     left:50%;
     transform: translate(-50%,-50%);
     background-color: #fff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.btns {
    display:flex;
    justify-content: flex-end;
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box;
}
}

</style>
