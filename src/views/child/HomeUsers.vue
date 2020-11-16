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
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 弹出框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogFormVisible"
        @close="closeDiglog"
      >
        <el-form :model="userinfo" :rules="rules" ref="ruleForm">
          <el-form-item label="姓名" prop="username">
            <el-input autocomplete="off" v-model="userinfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input autocomplete="off" v-model="userinfo.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input autocomplete="off" v-model="userinfo.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input autocomplete="off" v-model="userinfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
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
          <template slot-scope="scope">
            <el-dialog
              title="修改用户信息"
              :visible.sync="editdialogVisible"
              width="30%"
            >
              <el-form :model="editUserInfo" :rules="editRules" ref="editForm">
                <el-form-item label="姓名" prop="username">
                  <el-input
                    disabled
                    autocomplete="off"
                    v-model="editUserInfo.username"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    autocomplete="off"
                    v-model="editUserInfo.email"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                  <el-input
                    autocomplete="off"
                    v-model="editUserInfo.mobile"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit">确 定</el-button>
              </span>
            </el-dialog>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="getInfo(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
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
        :page-sizes="[1, 2, 5, 10]"
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
      dialogFormVisible: false,
      userinfo: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editUserInfo: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请选择请输入邮箱', trigger: 'blur' },
        ],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
      },
      editRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请选择请输入邮箱', trigger: 'blur' },
        ],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
      },
      editdialogVisible: false,
      editSubinfo: {
        id: '',
        email: '',
        mobile: '',
      },
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
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return this.$message.error('添加失败')
        this.$http.post('/users ', this.userinfo)
        this.getUsersData()
        this.dialogFormVisible = false
      })
    },
    closeDiglog() {
      this.$refs.ruleForm.resetFields()
    },
    async getInfo(id) {
      this.editdialogVisible = true
      let { data: res } = await this.$http.get(`users/${id}`)
      this.editUserInfo = res.data
    },
    editSubmit() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入正确的是格式')

        let { data: res } = await this.$http.put(
          'users/' + this.editUserInfo.id,
          {
            email: this.editUserInfo.email,
            mobile: this.editUserInfo.mobile,
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('修改用户信息失败')
        this.getUsersData()
        this.editdialogVisible = false
        this.$message.success('修改用户信息成功')
      })
    },
    async deleteUser(id) {
      let res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (res == 'cancel') return this.$message.info('取消删除')

      let { data: response } = await this.$http.delete('users/' + id)
      if (response.meta.status !== 200) return this.$message.error('删除失败')
      this.getUsersData()
      this.$message.success('删除成功')
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