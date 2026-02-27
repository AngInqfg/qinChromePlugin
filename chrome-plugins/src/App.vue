<template>
  <div class="user" @click="handleUserClick">{{ userInfo ? userInfo.nickname : '登录' }}</div>
  <Main ref="mainRef" />
  <UserLogin v-model:visible="loginVisible" @login-success="handleLoginSuccess" />
  <UserMenuDialog
    v-model:visible="logoutDialogVisible"
    :user-info="userInfo"
    @logout="handleLogoutConfirm"
    @sync-success="handleSyncSuccess"
  />
  <div class="w-full bg-[#E0E5EC] fixed bottom-[0] left-[0] text-center text-[#4a5568]">
    别搞 不涉及商用 请自行分辨使用，有问题请发邮件1446714867@qq.com
    </div>
</template>
<script setup>
import { ref } from "vue";
import Main from "./views/main.vue";
import UserLogin from "./components/UserLogin.vue";
import UserMenuDialog from "./components/UserMenuDialog.vue";

const loginVisible = ref(false);
const userInfo = ref(JSON.parse(localStorage.getItem('qChromeUser') || 'null'));
const logoutDialogVisible = ref(false);
const mainRef = ref(null);

const handleUserClick = () => {
  if (!userInfo.value) {
    loginVisible.value = true;
  } else {
    logoutDialogVisible.value = true;
  }
};

const handleLogoutConfirm = () => {
  userInfo.value = null;
  localStorage.removeItem('qChromeUser');
  logoutDialogVisible.value = false;
};

const handleLoginSuccess = (user) => {
  userInfo.value = user;
  localStorage.setItem('qChromeUser', JSON.stringify(user));
  mainRef.value?.fetchList();
};

const handleSyncSuccess = () => {
  mainRef.value?.fetchList();
};
</script>
<style>
body {
  background: #e0e5ec;
  width: 100svw;
  height: 100svh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-size: 16px;
  position: relative;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.user {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
</style>
