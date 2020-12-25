// home页面
<template>
  <!-- 大盒子 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 左边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单栏 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="skyblue"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true" 
          :default-active="activePath"
        >
          <!-- 折叠按钮 -->
          <div class="flod-box" @click="toggleCollapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu
            :index="items.id + ''"
            v-for="items in menuList"
            :key="items.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObject[items.id]"></i>
              <!-- 文本 -->
              <span>{{ items.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + secondaryItems.path + ''"
              v-for="secondaryItems in items.children"
              :key="secondaryItems.id" 
              @click="navActive('/' + secondaryItems.path + '')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ secondaryItems.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- router占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单栏数据
      menuList: [],
      // 左侧菜单栏图标
      iconObject: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      // 折叠 默认关闭折叠
      isCollapse: false,
      // 选中二级菜单的index地址
      activePath: ''
    }
  },
  created() {
    // 获取左侧菜单栏信息 后端代码出错 接口获取不到
    this.getMenuList()
    // 从sessionStorage中拿出activePath的值并给activePath赋值
    this.activePath=window.sessionStorage.getItem("activePath")
  },
  methods: {
    // 退出按钮
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单栏数据
    async getMenuList() {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status !== 200)
        return this.$message.error(result.meta.msg)
      this.menuList = result.data
      // console.log(result)
    },
    // 折叠菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 二级菜单选中状态
    navActive(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath = activePath
    }
  },
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  background-color: #373d41;
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
    border-right: 0;
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

.flod-box {
  background-color: #4a5064;
  color: #fff;
  font-size: 12px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  line-height: 22px;
}
</style>