<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="usersQuery.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchBtn">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column prop="username" label="姓名" width="200">
        </el-table-column>

        <el-table-column prop="email" label="邮箱" width="200">
        </el-table-column>

        <el-table-column prop="mobile" label="电话" width="200">
        </el-table-column>

        <el-table-column prop="role_name" label="角色" width="200">
        </el-table-column>

        <el-table-column prop="mg_state" label="状态" width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip content="设置" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersQuery.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="usersQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HomeUsers',
  data() {
    return {
      usersQuery: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
    }
  },
  created() {
    this.getUsersData()
  },
  methods: {
    async getUsersData() {
      let { data: res } = await this.$http.get('/users', {
        params: this.usersQuery,
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(Size) {
      console.log(Size)
      this.usersQuery.pagesize = Size
      this.getUsersData()
    },
    async handleCurrentChange(currentPage) {
      this.usersQuery.pagenum = currentPage
      this.getUsersData()
    },
    async stateChange(res) {
      let { data: resData } = await this.$http.put(
        `users/${res.id}/state/${res.mg_state}`
      )
      if (resData.meta.status !== 200) {
        res.mg_state = !res.mg_state
        return this.$message.error('修改状态失败')
      }
      this.$message.success('用户状态修改成功')
    },
    searchBtn() { 
      this.getUsersData()
    },
  },
}
</script>

 <style lang="less" scoped>
.el-breadcrumb {
  font-size: 14px;
}
.box-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 10px;
}
</style>