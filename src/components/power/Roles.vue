// 用户角色页面
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesdialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe="">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'level-bottom-border',
                i1 == 0 ? 'level-top-border' : '',
                'longitudinal-center',
              ]"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[
                    i2 == 0 ? '' : 'level-top-border',
                    'longitudinal-center',
                  ]"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesdialogVisible"
      width="50%"
      @close="addRolesdialogClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="rolesListRules"
        ref="rolesListRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="rightsTreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultRightsKeys"
        ref="rightsTreeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRihts">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色信息
      rolesList: [],
      // 添加用户角色弹窗
      addRolesdialogVisible: false,
      // 添加角色信息
      addRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加校验规则
      rolesListRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 编辑按钮弹窗
      editRolesDialogVisible: false,
      // 编辑角色信息
      editRoleForm: {},
      //编辑角色校验规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 分配权限弹窗
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      // 权限树形对象
      rightsTreeProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选择树节点
      defaultRightsKeys: [],
      // 选中角色的id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.rolesList = result.data
    },
    // 监听关闭添加角色弹窗
    addRolesdialogClosed() {
      this.$refs.rolesListRef.resetFields()
    },
    // 添加角色
    addRoles() {
      this.$refs.rolesListRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          'roles',
          this.addRolesForm
        )
        if (result.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        // 隐藏弹窗
        this.addRolesdialogVisible = false
        // 重新加载用户列表
        this.getRolesList()
      })
    },
    // 编辑角色
    async editRole(id) {
      this.editRolesDialogVisible = true
      const { data: result } = await this.$http.get('roles/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('获取角色信息失败！')
      }
      this.$message.success('获取角色信息成功！')
      this.editRoleForm = result.data
    },
    // 点击确认修改角色
    editRoleSubmit() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error('修改角色信息失败！')
        }
        this.$message.success('修改角色信息成功！')
        //关闭弹窗
        this.editRolesDialogVisible = false
        // 重新加载角色列表
        this.getRolesList()
      })
    },
    // 根据id删除角色
    async deleteRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除角色')
      }
      const { data: result } = await this.$http.delete('roles/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('删除角色失败!')
      }
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 根据id移除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: result } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (result.meta.status !== 200) {
        return this.$message.error('移除权限失败！')
      }
      return this.$message.success('移除权限成功！')

      //  重新载入权限
      role.children = result.data
    },
    // 分配权限弹窗
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: result } = await this.$http.get('rights/tree')
      if (result.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.$message.success('获取权限列表成功！')
      this.rightsList = result.data
      // 获取节点id
      this.getLeafKeys(role, this.defaultRightsKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取三级权限的id存储到defaultRightsKeys中
    getLeafKeys(node, idArray) {
      if (!node.children) {
        return idArray.push(node.id)
      }
      node.children.forEach((element) => this.getLeafKeys(element, idArray))
    },
    // 监听分配权限弹窗关闭事件
    setRightDialogClosed() {
      this.defaultRightsKeys = []
    },
    // 确定提交分配的权限
    async allotRihts() {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
     const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.level-top-border {
  border-top: 1px solid #ccc;
}
.level-bottom-border {
  border-bottom: 1px solid #ccc;
}
.longitudinal-center {
  display: flex;
  align-items: center;
}
</style>