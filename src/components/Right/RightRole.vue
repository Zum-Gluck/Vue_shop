<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rouleList" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bom_bor', 'center', index === 0 ? 'top_bor' : '']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-tag
                  closable
                  @close="removeRightById(scope.row.id, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  :class="['top_bor', 'center', index == 0 ? 'bom_bor_no' : '']"
                  v-for="(item2, index) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-col>
                      <el-tag
                        type="success"
                        closable
                        @close="removeRightById(scope.row.id, item2.id)"
                        >{{ item2.authName }}1</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row.id, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div @click="show(scope)"></div>
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="setRightBtnClick(scope.row)"
              >分配权限</el-button
            >

            <el-dialog
              title="提示"
              :visible.sync="setRightdialogVisible"
              width="30%"
              @close="closeTreeDialog"
            >
              <el-tree
                ref="treeRef"
                :data="rouleTree"
                :props="rouleProps"
                show-checkbox
                default-expand-all
                node-key="id"
                :default-checked-keys="chekoutIdArr"
              ></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setRightdialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="allotRight">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RightsRole',
  data() {
    return {
      rouleList: [],
      rouleTree: [],
      rouleId: '',
      setRightdialogVisible: false,
      rouleProps: {
        children: 'children',
        label: 'authName',
      },
      chekoutIdArr: [],
    }
  },
  created() {
    this.getRouleLsit()
  },
  methods: {
    async getRouleLsit() {
      let { data: res } = await this.$http.get('/roles')
      this.rouleList = res.data
    },
    async removeRightById(roleId, rightId) {
      //根据id删除权限
      let result = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (result !== 'confirm') return this.$message.info('取消删除')

      let { data: res } = await this.$http.delete(
        `roles/${roleId}/rights/${rightId}`
      )

      if (res.meta.status !== 200) return this.$message.error('删除失败')

      this.$message.success('删除成功')

      for (let item of this.rouleList) {
        if (item.id == roleId) {
          item.children = res.data
        }
      }
    },
    async setRightBtnClick(role) {
      this.rouleId = role.id
      this.setRightdialogVisible = true
      let { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) return this.$message.error('获取数据失败')

      this.rouleTree = res.data

      this.getChekOutId(role, this.chekoutIdArr)
    },
    getChekOutId(node, arr) {
      //如果没有children属性
      if (!node.children) {
        arr.push(node.id)
      } else {
        node.children.forEach((item) => {
          this.getChekOutId(item, arr)
        })
      }
    },
    closeTreeDialog() {
      // 需要节流
      this.chekoutIdArr = []
    },
    async allotRight() {
      // 分配权限
      let keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys(),
      ]

      console.log(this.rouleId)
      let idStr = keys.join(',')
      let { data: res } = await this.$http.post(
        `roles/${this.rouleId}/rights`,
        {
          rids: idStr,
        }
      )
      console.log(res)

      if (res.meta.status !== 200) return this.$message.error('更新失败')

      this.$message.success(res.meta.msg)

      this.getRouleLsit()

      this.setRightdialogVisible = false
    },
  },
}
</script>

 <style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.top_bor {
  border-top: 1px solid #eeeeee;
}
.bom_bor {
  border-bottom: 1px solid #eeeeee;
}
.bom_bor_no {
  border: 0;
}
.el-tag {
  margin: 7px;
}
.center {
  display: flex;
  align-items: center;
}
</style>