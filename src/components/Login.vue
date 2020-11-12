<template>
  <div id="login">
    <div class="login_form">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="~assets/img/logo.png" />
      </div>
      <!-- 表单 -->
      <el-form
        ref="elFormRef"
        :model="userInfo"
        :rules="rules"
        class="element_form"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user1"
            v-model="userInfo.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-lock"
            v-model="userInfo.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="element_btn">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="restClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      userInfo: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    restClick() {
      this.$refs.elFormRef.resetFields();
    },
    loginClick() {
      this.$refs.elFormRef.validate(async (valid) => {
        if (!valid) return; //如果为false 执行return 阻止向下执行
        let { data: res } = await this.$http.post("login", this.userInfo);
        if (res.meta.status != 200) return this.$message.error("登录失败"); //如果状态码不为二百阻止并打印
        this.$message.success("登录成功");
        // 登录成功之后的token保存到客户端的sessionStorage中
        // token 只应当存在当前网站打开期间生效，所有将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped >
#login {
  height: 100vh;
  background-color: #264A6B;
}
.login_form {
  position: relative;
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  position: absolute;
  top: -75px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 0 10px #eee;
  img {
    width: 100%;
    height: 100%;
    background-color: #eee;
  }
}
.element_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px 15px;
  box-sizing: border-box;
  .element_btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>  