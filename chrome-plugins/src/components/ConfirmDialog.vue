<template>
  <dialog class="neu-dialog" ref="dialogRef" @close="closeDialog">
    <div class="neu-card">
      <div class="title">
        {{ title }}
      </div>

      <div class="content">
        {{ content }}
      </div>

      <div class="actions">
        <button v-if="showCancel" class="neu-btn" @click="closeDialog">取消</button>
        <button class="neu-btn primary" @click="confirm">{{ confirmText }}</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "提示",
  },
  content: {
    type: String,
    default: "",
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  confirmText: {
    type: String,
    default: "确定",
  },
});

const emits = defineEmits(["confirm"]);
const dialogRef = ref();
const visible = defineModel("visible");

const closeDialog = () => {
  visible.value = false;
};

const confirm = () => {
  emits("confirm");
  closeDialog();
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

.content {
  font-size: 16px;
  color: #718096;
  text-align: center;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
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
  outline: none;
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
</style>