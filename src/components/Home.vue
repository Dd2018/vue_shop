// home页面
<template>
  <div>
    <h1>home 页面</h1>
    <el-button @click="logout" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出按钮
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>