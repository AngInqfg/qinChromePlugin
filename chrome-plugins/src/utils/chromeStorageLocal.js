const SITE_LIST_KEY = "siteList";

function hasChromeStorageLocal() {
  return Boolean(globalThis?.chrome?.storage?.local);
}

function localGet(key, fallbackValue) {
  try {
    const raw = globalThis.localStorage.getItem(key);
    if (raw == null) return fallbackValue;
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function localSet(key, value) {
  try {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function localRemove(key) {
  try {
    globalThis.localStorage.removeItem(key);
  } catch {}
}

async function getFromStorage(key, fallbackValue) {
  if (!hasChromeStorageLocal()) return localGet(key, fallbackValue);

  return await new Promise((resolve) => {
    globalThis.chrome.storage.local.get([key], (result) => {
      const value = result?.[key];
      resolve(value ?? fallbackValue);
    });
  });
}

async function setToStorage(key, value) {
  if (!hasChromeStorageLocal()) {
    localSet(key, value);
    return;
  }

  await new Promise((resolve) => {
    globalThis.chrome.storage.local.set({ [key]: value }, () => resolve());
  });
}

async function removeFromStorage(key) {
  if (!hasChromeStorageLocal()) {
    localRemove(key);
    return;
  }

  await new Promise((resolve) => {
    globalThis.chrome.storage.local.remove([key], () => resolve());
  });
}

function normalizeUrl(url) {
  const normalized = `${url ?? ""}`.trim();
  if (!normalized) return "";

  try {
    return new URL(normalized).href;
  } catch {
    try {
      return new URL(`https://${normalized}`).href;
    } catch {
      return normalized;
    }
  }
}

function upsertByKey(list, item) {
  const next = Array.isArray(list) ? [...list] : [];
  if (!item?.key) return next;

  // 确保 url 还是标准化一下，虽然不作为 id 了
  const nextItem = { ...item, url: normalizeUrl(item?.url) };
  
  const idx = next.findIndex((x) => x?.key === item.key);
  if (idx >= 0) next[idx] = { ...next[idx], ...nextItem };
  else next.unshift(nextItem);

  return next;
}

export async function getSiteList() {
  const list = await getFromStorage(SITE_LIST_KEY, []);
  return Array.isArray(list) ? list : [];
}

export async function setSiteList(list) {
  await setToStorage(SITE_LIST_KEY, Array.isArray(list) ? list : []);
}

export async function addSite(site) {
  const list = await getSiteList();
  const next = upsertByKey(list, site);
  await setSiteList(next);
  return next;
}

export async function updateSite(site) {
  const list = await getSiteList();
  const next = upsertByKey(list, site);
  await setSiteList(next);
  return next;
}

export async function removeSite(key) {
  const list = await getSiteList();
  if (!key) return list;

  const next = list.filter((x) => x?.key !== key);
  await setSiteList(next);
  return next;
}

export async function clearSiteList() {
  await removeFromStorage(SITE_LIST_KEY);
}

export const chromeStorageLocal = {
  get: getFromStorage,
  set: setToStorage,
  remove: removeFromStorage,
};

