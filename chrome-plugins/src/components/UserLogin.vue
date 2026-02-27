<template>
  <dialog class="neu-dialog" ref="dialogRef" @close="closeDialog">
    <div class="neu-card">
      <div class="title">
        {{ isRegister ? "用户注册" : "用户登录" }}
      </div>

      <div class="form-item">
        <label>用户名</label>
        <input
          class="neu-input"
          type="text"
          placeholder="请输入用户名"
          v-model="formData.username"
        />
      </div>

      <div class="form-item">
        <label>密码</label>
        <input
          class="neu-input"
          type="password"
          placeholder="请输入密码"
          v-model="formData.password"
        />
      </div>

      <div v-if="isRegister" class="form-item">
        <label>昵称</label>
        <input
          class="neu-input"
          type="text"
          placeholder="请输入昵称"
          v-model="formData.nickname"
        />
      </div>

      <div class="switch-mode" @click="toggleMode">
        {{ isRegister ? "已有账号？去登录" : "没有账号？去注册" }}
      </div>

      <div class="actions">
        <button class="neu-btn" @click="closeDialog">取消</button>
        <button class="neu-btn primary" @click="confirm" :disabled="loading">
          {{ loading ? '处理中...' : (isRegister ? "注册" : "登录") }}
        </button>
      </div>
    </div>
    <ConfirmDialog
      v-model:visible="alertVisible"
      :title="alertTitle"
      :content="alertContent"
      :show-cancel="false"
      @confirm="handleAlertConfirm"
    />
  </dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { login, register } from "../api/user";
import ConfirmDialog from "./ConfirmDialog.vue";

const props = defineProps({
  visible: Boolean,
});

const emits = defineEmits(["update:visible", "login-success"]);
const dialogRef = ref();
const isRegister = ref(false);
const loading = ref(false);
const formData = ref({
  username: "",
  password: "",
  nickname: "",
});

const alertVisible = ref(false);
const alertTitle = ref("");
const alertContent = ref("");

const showAlert = (title, content) => {
  alertTitle.value = title;
  alertContent.value = content;
  alertVisible.value = true;
};

const handleAlertConfirm = () => {
  alertVisible.value = false;
};

const closeDialog = () => {
  emits("update:visible", false);
};

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  formData.value = { username: "", password: "", nickname: "" };
};

const confirm = async () => {
  if (loading.value) return;

  if (!formData.value.username || !formData.value.password) {
    showAlert("提示", "请输入用户名和密码");
    return;
  }
  if (isRegister.value && !formData.value.nickname) {
    showAlert("提示", "请输入昵称");
    return;
  }

  loading.value = true;
  try {
    if (isRegister.value) {
      const res = await register(
        formData.value.username,
        formData.value.password,
        formData.value.nickname,
      );
      if (res.code === 0) {
        showAlert("成功", "注册成功，请登录");
        isRegister.value = false;
        // Optionally keep username/password but clear nickname
        // formData.value.nickname = ""; 
      } else {
        showAlert("失败", res.msg || "注册失败");
      }
    } else {
      const res = await login(formData.value.username, formData.value.password);
      if (res.code === 0) {
        // Success
        emits("login-success", res.data);
        closeDialog();
      } else {
        showAlert("失败", res.msg || "登录失败");
      }
    }
  } catch (error) {
    console.error(error);
    showAlert("错误", error.message || "操作失败");
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  },
);
</script>

<style scoped>
.neu-dialog {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  border: none;
  border-radius: 24px;
  background: transparent;
  outline: none;
  position: relative;
}

.neu-dialog::backdrop {
  background: rgba(224, 229, 236, 0.5);
  backdrop-filter: blur(4px);
}

.neu-card {
  min-width: 300px;
  width: 30%; /* Adjusted width */
  padding: 30px;
  border-radius: 24px;
  background: #e0e5ec;
  box-shadow:
    9px 9px 16px rgba(163, 177, 198, 0.6),
    -9px -9px 16px rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  color: #4a5568;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #4a5568;
  margin-bottom: 4px;
}

.form-item {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-item label {
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  color: #718096;
  user-select: none;
}

.neu-input {
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-radius: 12px;
  background: #e0e5ec;
  box-shadow:
    inset 4px 4px 8px rgba(163, 177, 198, 0.6),
    inset -4px -4px 8px rgba(255, 255, 255, 0.8);
  outline: none;
  color: #4a5568;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.neu-input:focus {
  box-shadow:
    inset 6px 6px 12px rgba(163, 177, 198, 0.6),
    inset -6px -6px 12px rgba(255, 255, 255, 0.8);
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-top: 10px;
}

.neu-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #e0e5ec;
  color: #718096;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow:
    6px 6px 10px rgba(163, 177, 198, 0.6),
    -6px -6px 10px rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  user-select: none;
}

.neu-btn:hover {
  transform: translateY(-2px);
  color: #4a5568;
  box-shadow:
    8px 8px 12px rgba(163, 177, 198, 0.6),
    -8px -8px 12px rgba(255, 255, 255, 0.8);
}

.neu-btn:active {
  transform: translateY(0);
  box-shadow:
    inset 3px 3px 6px rgba(163, 177, 198, 0.6),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

.neu-btn.primary {
  color: #4a5568;
  font-weight: bold;
}

.switch-mode {
  font-size: 14px;
  color: #718096;
  cursor: pointer;
  text-decoration: underline;
  margin-top: -10px;
}
.switch-mode:hover {
  color: #4a5568;
}
</style>
