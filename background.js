chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ babyLeprechansReplacerEnabled: true });
});
