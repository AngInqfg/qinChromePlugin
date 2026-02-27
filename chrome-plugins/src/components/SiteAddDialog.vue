<template>
  <dialog class="neu-dialog" ref="dialogRef" @close="closeDialog">
    <div class="neu-card">
      <div class="title">
        {{ formData.url ? "修改站点" : "添加站点" }}
      </div>

      <div class="form-item">
        <label>网站图标 <span>（默认请求网站图标）</span></label>
        <div class="icon-upload-container">
          <div class="icon-preview-wrapper">
            <img
              v-if="formData.icon"
              :src="formData.icon"
              class="icon-preview"
              alt="Icon Preview"
            />
            <div v-else class="icon-placeholder">无图标</div>
          </div>
          <div class="icon-actions">
            <button
              class="neu-btn small outline-none"
              @click="triggerFileUpload"
            >
              上传图片
            </button>
          </div>
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            accept="image/*"
            class="outline-none"
            @change="handleFileChange"
          />
        </div>
      </div>

      <div class="form-item">
        <label>网站名称</label>
        <input
          class="neu-input"
          type="text"
          placeholder="请输入站点名称"
          v-model="formData.name"
        />
      </div>

      <div class="form-item">
        <label>网站地址</label>
        <input
          class="neu-input"
          :class="{
            'cursor-no-drop !bg-[#C2CBD9]': formData.type === 'edit',
          }"
          :disabled="formData.type === 'edit'"
          type="text"
          placeholder="请输入站点地址"
          v-model="formData.url"
        />
      </div>

      <div class="form-item">
        <label>分类</label>
        <input
          class="neu-input"
          type="text"
          placeholder="请输入分类"
          v-model="formData.category"
          list="category-options"
        />
        <datalist id="category-options">
          <option
            v-for="item in existingCategories"
            :key="item"
            :value="item"
          ></option>
        </datalist>
      </div>

      <div class="actions">
        <button class="neu-btn" @click="closeDialog">取消</button>
        <button class="neu-btn primary" @click="confirm">
          {{ formData.type === 'edit' ? "修改" : "添加" }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      url: "",
      icon: "",
      name: "",
      category: "",
      type: "add",
    }),
  },
  existingCategories: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["confirm"]);
const formData = ref({});
const dialogRef = ref();
const visible = defineModel("visible");
const fileInput = ref(null);

const closeDialog = () => {
  visible.value = false;
};
/**确认 */
const confirm = async () => {
  if (!formData.value?.url || !formData.value?.name) return;
  if (!formData.value?.icon) {
    const res = await getFaviconUrl(formData.value?.url);
    if (res) {
      formData.value.icon = res;
    }
  }
  emits("confirm", { ...formData.value });
  closeDialog();
};
/**上传 */
const triggerFileUpload = () => {
  fileInput.value.click();
};
/**修改图标 */
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      formData.value.icon = await fileToDataURL(file);
    } catch (error) {
      console.error("Failed to convert file to base64:", error);
    }
  }
};

watch(
  () => visible.value,
  (_new) => {
    if (_new) {
      formData.value = { ...props.data };
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  },
);
function getFaviconUrl(url) {
  const normalized = `${url ?? ""}`.trim();
  return `${normalized}/favicon.ico`;
}
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
</script>

<style scoped>
.icon-upload-container {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.icon-preview-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #e0e5ec;
  box-shadow:
    inset 3px 3px 6px rgba(163, 177, 198, 0.6),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.icon-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-placeholder {
  font-size: 10px;
  color: #a0aec0;
  text-align: center;
}

.icon-actions {
  display: flex;
  gap: 10px;
  flex: 1;
}

.neu-btn.small {
  padding: 8px 12px;
  height: 48px;
  font-size: 13px;
}

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
  width: 40%;
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
</style>
