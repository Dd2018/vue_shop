// 商品参数页面
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品区域 -->
      <el-row class="cate-option">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 级联选择框区域 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
          <!-- tab标签区域 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                size="mini"
                :disabled="isButtonDisabled"
                @click="addParameterDialogVisible = true"
                >动态参数</el-button
              >
              <!-- 动态参数表格 -->
              <el-table :data="manyTableData" border stripe>
                <!-- 展开栏 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 循环渲染tag -->
                    <el-tag
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="removeTag(index, scope.row)"
                      >{{ item }}</el-tag
                    >
                    <!-- 输入框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 点击切换文本 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  label="参数名称"
                  prop="attr_name"
                ></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-edit"
                      @click="openEditParameterDialog(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="removeParameter(scope.row.attr_id)"
                    >
                      删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="only">
              <el-button
                type="primary"
                size="mini"
                :disabled="isButtonDisabled"
                @click="addParameterDialogVisible = true"
                >静态参数</el-button
              >
              <!-- 静态参数表格 -->
              <el-table :data="onlyTableData" border stripe>
                <!-- 展开栏 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 循环渲染tag -->
                    <el-tag
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="removeTag(index, scope.row)"
                      >{{ item }}</el-tag
                    >
                    <!-- 输入框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 点击切换文本 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  label="属性名称"
                  prop="attr_name"
                ></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-edit"
                      @click="openEditParameterDialog(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="removeParameter(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加弹窗 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParameterDialogVisible"
      width="50%"
      @close="addParameterDialogClosed"
    >
      <!-- 表单内容区域 -->
      <el-form
        :model="addParameterForm"
        :rules="addParameterFormRules"
        ref="addParameterFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParameterForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParameterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParameter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="editParameterDialogVisible"
      width="50%"
      @close="editParameterDialogClosed"
    >
      <!-- 表单内容区域 -->
      <el-form
        :model="editParameterForm"
        :rules="editParameterFormRules"
        ref="editParameterFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParameterForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParameterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParameter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //分类列表
      cateList: [],
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 默认开启的tab
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 控制添加弹窗
      addParameterDialogVisible: false,
      // 添加属性按钮的信息
      addParameterForm: {
        attr_name: '',
      },
      // 添加校验规则
      addParameterFormRules: {
        attr_name: [
          { required: true, message: '请输入添加数据', trigger: 'blur' },
        ],
      },
      // 控制编辑弹窗开启
      editParameterDialogVisible: false,
      // 编辑弹窗的数据
      editParameterForm: {
        attr_name: '',
      },
      // 编辑菜单的校验规则
      editParameterFormRules: {
        attr_name: [
          { required: true, message: '请输入添加数据', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) {
        return this.$message.error('获取分类列表失败！')
      }
      this.cateList = result.data
    },
    // 级联选择框改变会触发
    handleChange() {
      this.getParamsData()
    },
    // tab标签变化
    handleClick() {
      this.getParamsData()
    },
    // 获取参数列表
    async getParamsData() {
      // 如果选中的不是第三级 selectedCateKeys置空
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }

      // 根据分类的ID获取对应参数
      const { data: result } = await this.$http.get(
        `categories/${this.currentCateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (result.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }

      // 分隔
      result.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyTableData = result.data
      } else {
        this.onlyTableData = result.data
      }
    },
    // 监听对话框的关闭事件
    addParameterDialogClosed() {
      this.$refs.addParameterFormRef.resetFields()
    },
    // 点击添加参数
    addParameter() {
      this.$refs.addParameterFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          `categories/${this.currentCateId}/attributes`,
          {
            attr_name: this.addParameterForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (result.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addParameterDialogVisible = false
        this.getParamsData()
      })
    },
    // 控制编辑弹窗开启
    async openEditParameterDialog(attr_id) {
      const { data: result } = await this.$http.get(
        `categories/${this.currentCateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )
      if (result.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.editParameterForm = result.data
      this.editParameterDialogVisible = true
    },
    // 监听编辑弹窗关闭事件
    editParameterDialogClosed() {
      this.$refs.editParameterFormRef.resetFields()
    },
    //确定编辑
    editParameter() {
      this.$refs.editParameterFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.put(
          `categories/${this.currentCateId}/attributes/${this.editParameterForm.attr_id}`,
          {
            attr_name: this.editParameterForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (result.meta.status !== 200) {
          this.$message.error('修改失败！')
        }
        this.$message.success('修改成功！')
        this.getParamsData()
        this.editParameterDialogVisible = false
      })
    },
    // 移除参数
    async removeParameter(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！ ')
      }
      // 删除逻辑
      const { data: result } = await this.$http.delete(
        `categories/${this.currentCateId}/attributes/${attr_id}`
      )
      if (result.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getParamsData()
    },
    // enter和失去焦点都会触发
    async handleInputConfirm(row) {
      // 输入的都为空格
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入不为空
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrValues(row)
    },

    // 将输入数据保存到数据库
    async saveAttrValues(row) {
      const { data: result } = await this.$http.put(
        `categories/${this.currentCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          // 原数组是字符串格式
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (result.meta.status !== 200) {
        return this.$message.error('修改参数失败！')
      }
      this.$message.success('修改参数成功！')
    },

    //按钮切换到文本输入框
    showInput(row) {
      row.inputVisible = true
      // 页面重新渲染后才调用
      // 文本输入框自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 移除tag
    removeTag(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrValues(row)
    },
  },
  computed: {
    // 如果selectedCateKeys的长度不是3按钮不可选
    isButtonDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    //当前选中的三级分类的id
    currentCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 表格静动态返回
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style lang="less" scoped>
.cate-option {
  margin: 15px 0;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>