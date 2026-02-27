<script setup>
import { ref } from "vue";
defineProps({
  url: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  itemKey: {
    type: [String, Number],
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["edit", "del"]);
const handleGoUrl = (url) => {
  window.open(url);
};
const isError = ref(false);
</script>

<template>
  <div class="icon_item" @click="handleGoUrl(url)">
    <div
      class="icon_item_del"
      @click.stop="emits('del', { url, icon, name, key: itemKey })"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </svg>
    </div>
    <div
      class="icon_item_edit"
      @click.stop="emits('edit', { url, icon, name, key: itemKey, category })"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        ></path>
        <path
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        ></path>
      </svg>
    </div>
    <img
      v-if="!isError"
      class="icon_item_logo"
      :src="icon"
      alt="icon"
      @error="isError = true"
    />
    <svg
      v-else
      class="icon_item_logo"
      style="width: 40px; height: 40px"
      viewBox="0 0 1024 1024"
      version="1"
    >
      <path
        d="M427.5 179h-238c-12.43 0-22.5 10.07-22.5 22.5s10.07 22.5 22.5 22.5h238c12.43 0 22.5-10.07 22.5-22.5S439.93 179 427.5 179zM338.5 312h-149c-12.43 0-22.5 10.07-22.5 22.5s10.07 22.5 22.5 22.5h149c12.43 0 22.5-10.07 22.5-22.5S350.93 312 338.5 312z"
        fill="#303133"
        p-id="6555"
      ></path>
      <path
        d="M844.15 584.55c-11.68-4.25-24.59 1.77-28.84 13.45l-72.74 199.85c-4.25 11.68 1.77 24.59 13.45 28.84s24.59-1.77 28.84-13.45l72.74-199.85c4.25-11.68-1.77-24.59-13.45-28.84zM689.1 618.47c-10.18-7.13-24.21-4.65-31.34 5.53l-47.52 67.87a22.33 22.33 0 0 0-3.99 11.32c-0.01 0.07-0.01 0.14-0.01 0.21-0.03 0.5-0.05 1-0.05 1.5s0.02 1 0.05 1.5c0.01 0.07 0.01 0.14 0.01 0.21 0.27 3.94 1.56 7.85 3.99 11.32l47.52 67.87c7.13 10.18 21.16 12.65 31.34 5.53 10.18-7.13 12.65-21.16 5.53-31.34l-38.58-55.09 38.58-55.09c7.12-10.18 4.65-24.21-5.53-31.34zM993.98 704.9c0-0.5-0.02-1-0.05-1.5-0.01-0.07-0.01-0.14-0.01-0.21-0.27-3.94-1.56-7.85-3.99-11.32L942.41 624c-7.13-10.18-21.16-12.65-31.34-5.53s-12.65 21.16-5.53 31.34l38.58 55.09-38.58 55.09c-7.13 10.18-4.65 24.21 5.53 31.34s24.21 4.65 31.34-5.53l47.52-67.87a22.33 22.33 0 0 0 3.99-11.32c0.01-0.07 0.01-0.14 0.01-0.21 0.03-0.5 0.05-1 0.05-1.5z"
        fill="#303133"
        p-id="6556"
      ></path>
      <path
        d="M1024 555V102.62C1024 46.18 977.82 0 921.38 0H102.62C46.18 0 0 46.18 0 102.62v607.76C0 766.82 46.18 813 102.62 813H483v153H210c-16.02 0-29 12.98-29 29s12.98 29 29 29h604c16.02 0 29-12.98 29-29s-12.98-29-29-29H541V813h43.97v0.03c11.9-1.01 21.25-10.98 21.25-23.13 0-12.14-9.33-22.1-21.22-23.12v-0.01H102.62c-14.95 0-29.08-5.9-39.79-16.61-10.71-10.71-16.61-24.84-16.61-39.79V102.62c0-14.95 5.9-29.08 16.61-39.79 10.71-10.71 24.84-16.61 39.79-16.61h818.76c14.95 0 29.08 5.9 39.79 16.61 10.71 10.71 16.61 24.84 16.61 39.79V555c1.01 11.9 10.98 21.25 23.13 21.25 12.15 0 22.11-9.35 23.13-21.25h-0.04z"
        fill="#303133"
        p-id="6557"
      ></path>
    </svg>
    <div class="icon_item_text">{{ name }}</div>
  </div>
</template>
<style scoped>
.icon_item {
  --iconItemW: 120px;
  --iconItemP: 20px;
  width: var(--iconItemW);
  height: calc(var(--iconItemW) - var(--iconItemP) * 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding: calc(var(--iconItemP) + 10px) 0 calc(var(--iconItemP) - 10px);
  border-radius: 16px;
  background: #e0e5ec;
  box-shadow:
    6px 6px 12px rgba(163, 177, 198, 0.6),
    -6px -6px 12px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  cursor: pointer;
  box-sizing: content-box;
  position: relative;
}
.icon_item_edit {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  padding: 4px;
  border-radius: 50%;
  color: #718096;
  transition: all 0.2s ease;
}
.icon_item_edit:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #4a5568;
}
.icon_item_del {
  position: absolute;
  top: 8px;
  left: 8px;
  display: none;
  padding: 4px;
  border-radius: 50%;
  color: #718096;
  transition: all 0.2s ease;
}
.icon_item_del:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #4a5568;
}
.icon_item:hover {
  box-shadow:
    inset 3px 3px 6px rgba(163, 177, 198, 0.6),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}
.icon_item:hover .icon_item_edit {
  display: block;
}
.icon_item:hover .icon_item_del {
  display: block;
}
.icon_item_logo {
  width: 45px;
  height: 45px;
  margin-bottom: 5px;
}
.icon_item_text {
  width: calc(100% - 30px);
  color: #4a5568;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>
