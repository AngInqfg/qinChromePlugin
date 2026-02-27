<script setup>
import { onMounted, ref, computed, watch } from "vue";
import SiteSearch from "../components/SiteSearch.vue";
import SiteIcon from "../components/SiteIcon.vue";
import SiteAddDialog from "../components/SiteAddDialog.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import {
  addSite,
  getSiteList,
  updateSite,
  removeSite,
} from "../utils/chromeStorageLocal";
import {
  getList as getRemoteList,
  updateList as updateRemoteList,
  removeSite as removeRemoteSite,
} from "../api/user";

const allList = ref([]);
const currentList = ref([]);
const searchValue = ref("");
const currentCategory = ref("全部");
const loading = ref(false);

// Get user info from localStorage to determine storage strategy
const getUserInfo = () => {
  return JSON.parse(localStorage.getItem("qChromeUser") || "null");
};

const userInfo = ref(getUserInfo());

// Helper to check if user is logged in
const isLoggedIn = computed(() => !!userInfo.value);

// Fetch list based on login status
const fetchList = async () => {
  loading.value = true;
  if (isLoggedIn.value) {
    // Fetch from backend
    try {
      const res = await getRemoteList(userInfo.value._id);
      if (res.code === 0) {
        allList.value = res.data || [];
      } else {
        console.error("Failed to fetch remote list:", res.msg);
        allList.value = [];
      }
    } catch (err) {
      console.error(err);
      allList.value = [];
    }
  } else {
    // Fetch from local chrome storage
    allList.value = await getSiteList();
  }

  // Sort list
  allList.value.sort((a, b) => {
    const catA = a.category || "其他";
    const catB = b.category || "其他";
    return catA.localeCompare(catB, "zh-CN");
  });

  refreshCurrentList();
  loading.value = false;
};

// Sync list to appropriate storage
const syncList = async (newList) => {
  allList.value = newList;
  refreshCurrentList();

  if (isLoggedIn.value) {
    // Sync to backend
    try {
      await updateRemoteList(userInfo.value._id, newList);
    } catch (err) {
      console.error("Failed to sync to remote:", err);
    }
  } else {
    // Sync to local chrome storage
    // Note: addSite, updateSite, removeSite already update chrome storage and return the new list
    // so we don't need to explicitly save the whole list here for local storage case
    // BUT, we need to handle the case where we might be manually setting allList
    // However, the existing utils return the new list, so we just use that.
  }
};

const categories = computed(() => {
  const cats = new Set(allList.value.map((item) => item.category || "其他"));
  return ["全部", ...Array.from(cats)];
});

const refreshCurrentList = () => {
  let list = allList.value;

  if (currentCategory.value !== "全部") {
    list = list.filter(
      (item) => (item.category || "其他") === currentCategory.value,
    );
  }

  if (searchValue.value) {
    list = list.filter(
      (item) =>
        item.name?.toLowerCase()?.indexOf(searchValue.value.toLowerCase()) !==
          -1 ||
        item?.url?.toLowerCase()?.indexOf(searchValue.value.toLowerCase()) !==
          -1,
    );
  }

  currentList.value = list;
};

const handleSearch = () => {
  refreshCurrentList();
};

const handleCategoryChange = (cat) => {
  currentCategory.value = cat;
  refreshCurrentList();
};

const addDialogVisible = ref(false);
const addDialogData = ref({
  url: "",
  icon: "",
  name: "",
  category: "",
  type: "add",
});
const handleOpenAddDialog = (e) => {
  addDialogData.value = e ? { ...e, type: "edit" } : { type: "add" };
  addDialogVisible.value = true;
};

const handleConfirm = async (data) => {
  if (!data?.url || !data?.name) return;

  const isEdit = data?.type === "edit";
  // 如果是新增，才生成 key；编辑时沿用原有 key
  const obj = { ...data };
  if (!isEdit && !obj.key) {
    obj.key = Date.now();
  }
  delete obj.type;

  let nextList;
  if (isLoggedIn.value) {
    // Manipulate memory list and sync
    nextList = [...allList.value];
    if (isEdit) {
      const index = nextList.findIndex((item) => item.key === obj.key);
      if (index !== -1) nextList[index] = obj;
    } else {
      nextList.push(obj);
    }
    await syncList(nextList);
  } else {
    // Use local storage utils
    nextList = isEdit ? await updateSite(obj) : await addSite(obj);
    allList.value = nextList;
    refreshCurrentList();
  }
};
const confirmDialogVisible = ref(false);
const itemToDelete = ref(null);
const confirmContent = ref("");

const handleDel = (e) => {
  itemToDelete.value = e;
  confirmContent.value = `确定要删除 "${e.name}" 吗？`;
  confirmDialogVisible.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    let nextList;
    if (isLoggedIn.value) {
      // Use dedicated remove API
      try {
        const res = await removeRemoteSite(
          userInfo.value._id,
          itemToDelete.value.key,
        );
        if (res.code === 0) {
          nextList = res.data;
          allList.value = nextList;
          refreshCurrentList();
        } else {
          console.error("Failed to delete remote site:", res.msg);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      nextList = await removeSite(itemToDelete.value?.key);
      allList.value = nextList;
      refreshCurrentList();
    }
  }
  confirmDialogVisible.value = false;
};

// Listen for login/logout changes
window.addEventListener("storage", (e) => {
  if (e.key === "qChromeUser") {
    userInfo.value = getUserInfo();
    fetchList();
  }
});

// Watch for user change via timer as a fallback for same-tab updates not triggering 'storage' event
const checkUserInterval = setInterval(() => {
  const newUser = getUserInfo();
  if (JSON.stringify(newUser) !== JSON.stringify(userInfo.value)) {
    userInfo.value = newUser;
    fetchList();
  }
}, 1000);

onMounted(async () => {
  await fetchList();
});

defineExpose({
  fetchList,
});
</script>

<template>
  <div class="main">
    <div class="main_content">
      <SiteSearch
        class="main_content_search"
        v-model:value="searchValue"
        @search="handleSearch()"
      />
      <div class="bar">
        <div
          class="py-1 px-3 rounded-md cursor-pointer text-gray-600 hover:text-[#C1CAD8]"
          @click="handleOpenAddDialog()"
        >
          添加标签
        </div>
      </div>
      <div class="category-tabs">
        <div
          v-for="cat in categories"
          :key="cat"
          class="category-tab"
          :class="{ active: currentCategory === cat }"
          @click="handleCategoryChange(cat)"
        >
          {{ cat }}
        </div>
      </div>

      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else class="main_content_list">
        <SiteIcon
          v-for="(item, idx) in currentList"
          :key="item.key || idx"
          :item-key="item.key"
          :url="item.url"
          :icon="item.icon"
          :name="item.name"
          :category="item.category"
          @edit="(e) => handleOpenAddDialog(e)"
          @del="(e) => handleDel(e)"
        />
      </div>
    </div>

    <SiteAddDialog
      v-model:visible="addDialogVisible"
      :data="addDialogData"
      :existing-categories="categories.filter((c) => c !== '全部')"
      @confirm="handleConfirm"
    />
    <ConfirmDialog
      v-model:visible="confirmDialogVisible"
      title="删除确认"
      :content="confirmContent"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<style scoped>
.main {
  margin: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
}
.main_content {
  max-width: 1660px;
  height: 100%;
  padding: 10vh 0 5vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main_content_search {
  margin-bottom: 10px;
}
.bar {
  margin-bottom: 10px;
}
.category-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.category-tab {
  padding: 6px 20px;
  border-radius: 20px;
  background: #e0e5ec;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow:
    5px 5px 10px rgba(163, 177, 198, 0.6),
    -5px -5px 10px rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  user-select: none;
}
.category-tab:hover {
  transform: translateY(-2px);
  color: #4a5568;
}
.category-tab.active {
  color: #2d3748;
  font-weight: bold;
  box-shadow:
    inset 3px 3px 6px rgba(163, 177, 198, 0.6),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}
.category-tab.active:hover {
  transform: translateY(0);
  color: #4a5568;
}
.main_content_list {
  width: calc(100% - 150px);
  flex: 1;
  padding: 20px;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  overflow: auto;
  gap: 30px;
}
.main_content_list::-webkit-scrollbar {
  display: none;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}
</style>
