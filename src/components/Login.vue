// 登录组件
<template>
  <!-- 最外部大盒子，背景颜色 -->
  <div class="login_container">
    <!-- 登录框盒子 -->
    <div class="login_box">
      <!-- 头像盒子 -->
      <div class="avator_box">
        <img src="@/assets/logo.png" alt="头像" title="头像" />
      </div>
      <!-- 登录表单 -->
      <!-- ref为表单的实例对象 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <!-- prop是绑定校验 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_button">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单绑定数据对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //   登录表单校验规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //重置表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.loginForm)
        // console.log(result.data);
        if (result.meta.status !== 200) return this.$message.error('登录失败！')
        // $message为自定义弹窗
        this.$message.success('登录成功！')
        // 登录城功后的token存入sessionStorage中
        // console.log(result);
        window.sessionStorage.setItem('token', result.data.token)
        // 登录成功后重定向到home
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  border-radius: 4px;
  background-color: #fff;
}
.avator_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
}
.avator_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.login_button {
  display: flex;
  justify-content: flex-end;
}
</style>