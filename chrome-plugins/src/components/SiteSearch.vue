<script setup>
const emits = defineEmits(["search"]);
const searchValue = defineModel("value");
const handleSearch = () => {
  emits("search", searchValue.value);
};
</script>

<template>
  <div class="search_box">
    <input
      class="search_box_input"
      type="text"
      placeholder="输入名称或地址，按Enter或点击进行搜索"
      v-model="searchValue"
      @keyup.enter="handleSearch"
      @input="handleSearch"
    />
    <div class="search_box_btn" @click="handleSearch">
      <svg viewBox="0 0 24 24">
        <path
          d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42zM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7z"
        ></path>
      </svg>
    </div>
  </div>
</template>
<style scoped>
.search_box {
  height: 50px;
  display: flex;
  align-items: center;
  background: #e0e5ec;
  border-radius: 50px;
  padding: 8px 20px;
  box-sizing: content-box;
  box-shadow:
    8px 8px 16px rgba(163, 177, 198, 0.6),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  width: calc(100% - 40px);
  transition: all 0.3s ease;
}
.search_box:has(.search_box_input:focus) {
  box-shadow:
    inset 4px 4px 8px rgba(163, 177, 198, 0.6),
    inset -4px -4px 8px rgba(255, 255, 255, 0.8);
}
.search_box_input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 18px;
  color: #4a4a4a;
  padding: 12px;
  flex: 1;
}
.search_box_btn {
  background: #e0e5ec;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    4px 4px 8px rgba(163, 177, 198, 0.6),
    -4px -4px 8px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  svg {
    width: 24px;
    height: 24px;
    fill: #4a4a4a;
  }
}
.search_box_btn:hover {
  box-shadow:
    2px 2px 4px rgba(163, 177, 198, 0.6),
    -2px -2px 4px rgba(255, 255, 255, 0.8);
  transform: scale(0.98);
}
</style>
