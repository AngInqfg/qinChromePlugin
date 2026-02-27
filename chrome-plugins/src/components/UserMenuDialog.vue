<template>
  <dialog class="neu-dialog" ref="dialogRef" @close="closeDialog">
    <div class="neu-card">
      <div class="title">账号管理</div>

      <div class="content">
        <div class="user-info" v-if="userInfo">
          当前登录: {{ userInfo.nickname || userInfo.username }}
        </div>
      </div>

      <div class="actions">
        <button class="neu-btn" @click="handleSync" :disabled="syncing">
          {{ syncing ? '同步中...' : '同步本地链接' }}
        </button>
        <button class="neu-btn danger" @click="handleLogout">退出登录</button>
        <button class="neu-btn" @click="closeDialog">取消</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { getSiteList } from "../utils/chromeStorageLocal";
import { getList, updateList } from "../api/user";

const props = defineProps({
  userInfo: {
    type: Object,
    default: null,
  },
});

const emits = defineEmits(["update:visible", "logout", "sync-success"]);
const visible = defineModel("visible");
const dialogRef = ref();
const syncing = ref(false);

const closeDialog = () => {
  visible.value = false;
};

const handleLogout = () => {
  emits("logout");
  closeDialog();
};

const handleSync = async () => {
  if (!props.userInfo?._id) return;
  
  syncing.value = true;
  try {
    // 1. Get local list
    const localList = await getSiteList();
    if (!localList || localList.length === 0) {
      alert("本地没有可同步的数据");
      syncing.value = false;
      return;
    }

    // 2. Get remote list
    const res = await getList(props.userInfo._id);
    let remoteList = [];
    if (res.code === 0 && Array.isArray(res.data)) {
      remoteList = res.data;
    }

    // 3. Merge (avoid duplicates by key)
    const remoteKeys = new Set(remoteList.map(item => item.key));
    let addedCount = 0;
    
    localList.forEach(localItem => {
      if (!remoteKeys.has(localItem.key)) {
        remoteList.push(localItem);
        remoteKeys.add(localItem.key);
        addedCount++;
      }
    });

    // 4. Update remote
    const updateRes = await updateList(props.userInfo._id, remoteList);
    if (updateRes.code === 0) {
      emits("sync-success");
      // Notify parent/other components if needed, or just let them fetch next time
    } else {
      alert("同步失败: " + (updateRes.msg || "未知错误"));
    }
  } catch (err) {
    console.error(err);
    alert("同步出错");
  } finally {
    syncing.value = false;
  }
};

watch(
  () => visible.value,
  (_new) => {
    if (_new) {
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
  display: none;
  justify-content: center;
  align-items: center;
}

.neu-dialog[open] {
  display: flex;
}

.neu-dialog::backdrop {
  background: rgba(224, 229, 236, 0.5);
  backdrop-filter: blur(4px);
}

.neu-card {
  min-width: 300px;
  width: 30%;
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
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #2d3748;
}

.content {
  text-align: center;
  font-size: 16px;
  color: #4a5568;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: center;
}

.neu-btn {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  background: #e0e5ec;
  box-shadow:
    5px 5px 10px #bebebe,
    -5px -5px 10px #ffffff;
  color: #4a5568;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  width: 80%;
  user-select: none;
}

.neu-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    6px 6px 12px #bebebe,
    -6px -6px 12px #ffffff;
  color: #2d3748;
}

.neu-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow:
    inset 3px 3px 6px #bebebe,
    inset -3px -3px 6px #ffffff;
}

.neu-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.neu-btn.primary {
  color: #4CAF50;
}

.neu-btn.danger {
  color: #ff4444;
}
</style>
