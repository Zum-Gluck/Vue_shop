<template>
  <el-container class="main">
    <el-header>
      <div class="logo_box">
        <div class="logo">
          <img src="~assets/img/home_logo.png" />
        </div>
        <div class="logo_font">电商后台管理系统</div>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '40px' : '200px'">
        <div class="toggle_btn" @click="toggleClick">
          <span class="iconfont icon-qiehuan"></span>
        </div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="currentRouter"
        >
          <el-submenu
            v-for="(item, index) in menuList"
            :key="item.id"
            :index="index + ''"
          >
            <template slot="title">
              <i :class="iconClass[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + childItem.path"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="saveState(childItem.path)"
            >
              <template>
                <i class="el-icon-menu"></i>
                {{ childItem.authName }}
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconClass: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-integral-fill',
        101: 'iconfont icon-dingdan',
        102: 'iconfont icon-signboard-fill',
        145: 'iconfont icon-shuju',
      },
      isCollapse: false,
      currentRouter: '',
    }
  },
  created() {
    this.getMenuList()
    this.currentRouter = window.sessionStorage.getItem('currentPath')
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      let { data: res } = await this.$http.get('menus')
      // 如果数据加载失败 给出提示信息
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList)
    },
    toggleClick() {
      this.isCollapse = !this.isCollapse
    },
    saveState(path) {
      window.sessionStorage.setItem('currentPath', '/' + path)
      // this.currentRouter = '/' + path
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #363D40;
  .logo_box {
    width: 230px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid gray;
      box-shadow: 0 0 10px gray;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .logo_font {
      font-size: 18px;
      color: #fff;
    }
  }
}
.el-main {
  background-color: #E9EDF1;
  height: 100%;
}
.el-aside {
  background-color: #313743;
  .el-menu {
    border-right: none;
  }
}
.el-button {
  height: 40px;
}
.iconfont {
  margin-right: 10px;
}
.toggle_btn {
  color: #fff;
  height: 24px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: #ccc;
    background-color: #272C36;
  }
}
</style>