// 添加商品页面
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="stepsIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <!--tab栏区域-->
        <el-tabs
          :tab-position="'left'"
          v-model="stepsIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoodsForm.goods_cate"
                :options="goodsCateList"
                :props="goodsProps"
                @change="handleGoodsCateChange"
                prop="goods_cascader"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 循环渲染多选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(checkItem, index) in item.attr_vals"
                  :key="index"
                  :label="checkItem"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodsForm.goods_introduce" />
            <!-- 添加商品按钮 -->
            <el-button
              type="primary"
              class="add-goods-button"
              @click="addGoodsSubmit"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片弹窗 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewPictureDialogVisible"
      width="50%"
    >
      <img :src="previewPictureUrl" alt="" class="preview-image" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤条步骤索引
      stepsIndex: '0',
      // 添加商品表单数据
      addGoodsForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 选中商品分类
        goods_cate: [],
        // 上传图片
        pics: [],
        // 商品描述
        goods_introduce: '',
        // 商品的参数（数组）
        attrs: [],
      },
      // 添加商品表单校验规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_cascader: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 商品分类数据
      goodsCateList: [],
      // 商品分类级联选择器props
      goodsProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 提交路径
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的header请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 预览图片的路径
      previewPictureUrl: '',
      // 预览图片的弹窗
      previewPictureDialogVisible: false,
    }
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    // 获取所有商品分类
    async getGoodsCate() {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.goodsCateList = result.data
    },
    // 级联选择器选择商品会触发
    handleGoodsCateChange() {
      // 耳机分类不可选
      if (this.addGoodsForm.goods_cate.length !== 3) {
        this.addGoodsForm.goods_cate = []
      }
    },
    // 切换tab栏之前的钩子函数
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cate.length !== 3) {
        this.$message.error('先选择商品分类！')
        return false
      }
    },
    // tab被选中时
    async tabClicked() {
      // console.log(this.stepsIndex)
      // 获取商品动态参数
      if (this.stepsIndex === '1') {
        const { data: result } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'many' },
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }

        result.data.forEach((element) => {
          element.attr_vals =
            element.attr_vals.length == 0 ? [] : element.attr_vals.split(' ')
        })

        this.manyTableData = result.data
      } else if (this.stepsIndex === '2') {
        const { data: result } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'only' },
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error('获取参数属性失败！')
        }
        this.onlyTableData = result.data
      }
    },
    // 控制上传图片预览
    handlePreview(file) {
      console.log(file)
      this.previewPictureUrl = file.response.data.url
      this.previewPictureDialogVisible = true
    },
    // 控制上传图片删除
    handleRemove(file) {
      // 图片临时路径
      const filePath = file.response.data.tmp_path
      // pics中图片的索引
      const fileIndex = this.addGoodsForm.pics.findIndex((x) => {
        x.pic === filePath
      })
      // 移除对应索引的路径
      this.addGoodsForm.pics.splice(fileIndex, 1)
    },
    // 上传成功
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
    },
    // 提交添加商品
    addGoodsSubmit() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写所有信息！')
        }
        // 使用lodash深拷贝
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cate = form.goods_cate.join(',')
        // 处理动态参数列表
        this.manyTableData.forEach((item) => {
          const newManyTable = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addGoodsForm.attrs.push(newManyTable)
        })

        // 处理静态属性列表
        this.onlyTableData.forEach((item) => {
          const newOnlyTable = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodsForm.attrs.push(newOnlyTable)
        })
        form.attrs = this.addGoodsForm.attrs
        console.log(form)
        // 发起添加请求
        const { data: result } = await this.$http.post('goods', form)
        if (result.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    // 获取当先选中三级分类的id
    catId() {
      if (this.addGoodsForm.goods_cate.length === 3) {
        return this.addGoodsForm.goods_cate[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0;
}
.preview-image {
  width: 100%;
}
.add-goods-button {
  margin-top: 15px;
}
</style>