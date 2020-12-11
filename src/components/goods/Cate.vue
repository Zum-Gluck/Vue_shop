<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-button type="primary" @click="addBtnClick"> 添加分类 </el-button>
      </el-row>

      <!-- 树形表格 -->
      <tree-table
        :data="goodsList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 是否有效 作用域插槽 -->
        <template #isOk="{ row }">
          <!-- 判断当前作用域的cat_deleted变量 决定渲染哪个icon -->
          <i
            class="el-icon-success"
            v-if="!row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>

        <!-- 等级 作用域插槽 -->
        <template #level="{ row }">
          <el-tag size="mini" v-if="row.cat_level == 0">标签一</el-tag>
          <el-tag type="success" v-else-if="row.cat_level == 1">标签二</el-tag>
          <el-tag type="info" size="mini" v-else>标签三</el-tag>
          <!-- 判断当前作用域的cat_deleted变量 决定渲染哪个icon -->
        </template>

        <!-- 等级 作用域插槽 -->
        <template #btn>
          <el-button type="primary" size="small" icon="el-icon-edit">
            编辑
          </el-button>

          <el-button type="danger" size="small" icon="el-icon-delete">
            删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加按钮的对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
      <!-- 带有校验规则的表单 -->
      <el-form
        :model="cateForm"
        :rules="rules"
        ref="cateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="cateForm.name"></el-input>
        </el-form-item>

        <el-form-item label="分类名称" prop="name">
          <!-- options绑定数据源 -->
          <!-- <el-cascader
            v-model="value"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader> -->
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="addDialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'cate',
  data() {
    return {
      // 商品列表
      goodsList: [],
      // 查询商品的参数
      queryInfo: {
        type: 3,
        pagenum: 3,
        pagesize: 5,
      },
      // 商品总数
      total: 0,
      // tree-table第三方组件里需要的数据
      columns: [
        { label: '标题', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isOk' },
        { label: '分类', type: 'template', template: 'level' },
        { label: '分类', type: 'template', template: 'btn' },
      ],
      // 控制添加按钮的对话框是否显示
      addDialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请填写分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      // 要添加的数据对象
      cateForm: {
        // 分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类等级
        cat_level: 0,
      },
      // 用来保存父级分类的数据
      parentCateList: [],
    }
  },
  methods: {
    // 获取商品列表
    async getGoodslist() {
      // 发送axios请求
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      // 请求失败拦截执行并提示
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')

      // 保存数据
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    // 在此拿到最新的pagesize
    handleSizeChange(newSize) {
      // 拿到最新的query之后重新渲染
      this.queryInfo.pagesize = newSize
      this.getGoodslist()
    },
    // 在此拿到最新的pagenum
    handleCurrentChange(newNum) {
      // 拿到最新的query之后重新渲染
      this.queryInfo.pagenum = newNum
      this.getGoodslist()
    },
    // 监听添加分类按钮的点击
    addBtnClick() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      // 发送请求
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2,
        },
      })

      // 验证请求结果
      if (res.meta.status !== 200)
        return this.$message.error('获取父级分类列表失败')

      // 验证通过后的逻辑
      console.log(res.data)
    },
  },
  created() {
    this.getGoodslist()
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>