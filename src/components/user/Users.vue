// 用户列表页面
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="userParams.query"
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
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEditDialogVisible(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>

            <!-- 用户权限按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="角色修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 主体内容区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的弹窗 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editUserData"
        :rules="editUserDataRules"
        ref="editUserDataRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserDataSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色修改弹窗 -->
    <el-dialog
      title="角色修改"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ this.userInfo.username }}</p>
        <p>当前的角色：{{ this.userInfo.role_name }}</p>
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱验证
    // 规则，需要校验的值，回调函数
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 自定义校验手机号
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户数据请求参数
      userParams: {
        // 搜索框的内容
        query: '',
        // 当前页
        pagenum: 1,
        // 每页显示条数
        pagesize: 2,
      },
      // 用户数据
      userList: [],
      total: 0,
      // 添加用户弹窗状态
      addDialogVisible: false,
      // 添加的用户信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 校验规则
      addFormRules: {
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
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          //  使用validator调用自定义验证
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 编辑弹窗默认关闭
      editDialogVisible: false,
      // 编辑用户的数据
      editUserData: {},
      // 编辑用户的校验规则
      editUserDataRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 控制角色修改弹窗显示与隐藏
      setRoleDialogVisible: false,
      // 修改角色的用户的信息
      userInfo: {},
      // 所有角色列表
      rolesList: [],
      // 已选中角色的ID
      selectedRoleId: '',
    }
  },
  created() {
    // 用户列表数据
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: result } = await this.$http.get('users', {
        params: this.userParams,
      })
      if (result.meta.status != 200)
        return this.$message.error('获取用户列表失败！')
      this.userList = result.data.users
      this.total = result.data.total
      // console.log(result)
    },
    // 每页条数
    handleSizeChange(perpageSize) {
      this.userParams.pagesize = perpageSize
      this.getUserList()
    },
    // 当前页
    handleCurrentChange(currentPage) {
      this.userParams.pagenum = currentPage
      this.getUserList()
    },
    // 状态改变处理
    async userStateChanged(userInfo) {
      console.log(userInfo)
      const { data: result } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (result.meta.status != 200) {
        // 更新失败状态恢复 取反
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('用户状态更新失败！')
      }
      this.$message.success('用户状态更新成功！')
    },
    // 监听用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 确定添加用户
    addUser() {
      // validate提交前预校验 valid返回true或false
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post('users', this.addForm)
        if (result.meta.status !== 201) {
          this.$message.error('用户添加失败！')
        }
        this.$message.success('用户添加成功！')
        // 隐藏弹窗
        this.addDialogVisible = false
        // 重新加载用户数据
        getUserList()
      })
    },
    // 点击编辑弹出弹窗
    async handleEditDialogVisible(id) {
      this.editDialogVisible = true
      const { data: result } = await this.$http.get('users/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('获取编辑用户数据失败！')
      }
      this.$message.success('获取编辑用户数据成功！')
      this.editUserData = result.data
    },
    // 监听编辑弹窗取消按钮 表单重置
    editDialogClosed() {
      this.$refs.editUserDataRef.resetFields()
    },
    // 编辑用户数据提交
    editUserDataSubmit() {
      // 预校验
      this.$refs.editUserDataRef.validate(async (valid) => {
        if (!valid) return
        // 校验通过发起修改请求
        const { data: result } = await this.$http.put(
          'users/' + this.editUserData.id,
          {
            email: this.editUserData.email,
            mobile: this.editUserData.mobile,
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error('修改提交失败！')
        }
        // 关闭弹窗
        this.editDialogVisible = false
        // 重新加载用户数据
        this.getUserList()
        // 提示成功
        this.$message.success('修改提交成功！')
      })
    },
    // 删除用户
    async deleteUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      // 确定 confirm  取消 cancle
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除用户')
      }
      // console.log('确认删除')
      const { data: result } = await this.$http.delete('users/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 权限角色修改
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 获取所有角色
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = result.data

      this.setRoleDialogVisible = true
    },
    // 确定权限角色修改
    async saveRoleInfo() {
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色！')
      }

      const {
        data: result,
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId,
      })
      if(result.meta.status !== 200){
        return this.$message.error('分配角色失败！')
      }
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听角色修改弹窗关闭
    setRoleDialogClosed(){
      this.userInfo = ''
      this.selectedRoleId = ''
    }
  },
}
</script>

<style lang="less" scoped>
</style>