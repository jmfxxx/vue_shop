<template>
  <el-container class="home-container">
    <!-- 頭部區 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>電商後台管理系統</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <!-- 頁面主體區 -->
    <el-container>
      <!-- 側邊欄 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          |||
        </div>
        <!-- 側邊欄菜單區 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EEF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition=false
          router
          :default-active="activePath"
        >
          <!-- 第1層Menu -->
          <!-- index讓它加一個空白會變成數值，不然會報錯 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 第1層Menu模版 -->
            <template slot="title">
              <!-- 圖標 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 第二層選單 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 圖標 -->
                <i class="el-icon-menu"></i>
                <!-- 文字 -->
                <span>{{subItem.authName}}</span>
              </template></el-menu-item
            >

          </el-submenu>
        </el-menu>
        <!-- 側邊欄菜單區 -->
      </el-aside>
      <!-- 右側內容主體 -->
      <el-main>
        <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左側Menu
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 預設不折疊false
      isCollapse: false,
      // 被選擇的連連地址
      activePath: ''

    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear() // 清空sessionStorage Token
      this.$router.push('/login') // 重新導向到登入頁面
    },
    // 取得所有選單
    async getMenuList() {
      // 解構回傳的data屬性，並將它重新命名為res
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
      console.log(this.menulist)
      // console.log('menulist' + this.menulist)
    },
    // toggleCollapse MENU摺疊與展開
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存連接點擊狀態
    savNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
 margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size:10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: .3em;
  cursor: pointer;
}

</style>
