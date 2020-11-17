<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightList" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>

        <el-table-column prop="authName" label="权限名称" width="380">
        </el-table-column>

        <el-table-column prop="path" label="路径" width="500px">
        </el-table-column>

        <el-table-column prop="level" label="权限等级" width="380">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">
              二级</el-tag
            >
            <el-tag v-else-if="scope.row.level == 2" type="warning">
              三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HomeRight',
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightList: [],
    }
  },
  methods: {
    async getRightsList() {
      let { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败')

      this.rightList = res.data
    },
  },
}
</script>

 <style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>