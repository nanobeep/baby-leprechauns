const isEnabledKey = 'babyLeprechansReplacerEnabled';
const statusElement = document.getElementById('status');

// Function to update the status element text
function updateStatus(isEnabled) {
    statusElement.textContent = `Status: ${isEnabled ? 'Enabled' : 'Disabled'}`;
}

// Retrieve the current state and update the status text
chrome.storage.local.get(isEnabledKey, (data) => {
    const isEnabled = data[isEnabledKey] !== false;
    updateStatus(isEnabled);
});

// Toggle functionality and update the status on button click
document.getElementById('toggleBtn').onclick = () => {
  chrome.storage.local.get(isEnabledKey, (data) => {
      const isEnabled = data[isEnabledKey] !== false;
      chrome.storage.local.set({ [isEnabledKey]: !isEnabled }, () => {
          updateStatus(!isEnabled);
      });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          // Send toggle message to content.js
          chrome.tabs.sendMessage(tabs[0].id, { toggle: !isEnabled });
      });
  });
};
