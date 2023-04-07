const isEnabledKey = 'babyLeprechansReplacerEnabled';

function findAndReplace(searchText, replacementText, node) {
  const searchTerm = searchText instanceof RegExp ? searchText : new RegExp(searchText, 'gi');
  const allTextNodes = document.createNodeIterator(node, NodeFilter.SHOW_TEXT, null, false);

  while (textNode = allTextNodes.nextNode()) {
      textNode.textContent = textNode.textContent.replace(searchTerm, replacementText);
  }
}

function replaceTerms() {
  const replacements = [
      { search: /\bArtificial Intelligence\b|\bA\.I\.\b|\bAI\b/gi, replace: 'Baby Leprechauns' },
      { search: /\bOpenAI\b/gi, replace: 'OpenElves' },
      { search: /\bChatGPT\b/gi, replace: 'ChatWithBabyLeprechauns' },
  ];

  replacements.forEach(({ search, replace }) => findAndReplace(search, replace, document.body));
}

// Observe DOM changes and process new nodes
function observeDOMChanges() {
  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          mutation.addedNodes.forEach(addedNode => {
              if (addedNode.nodeType === Node.ELEMENT_NODE) {
                  replaceTerms();
              }
          });
      });
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true,
  });
}

// Call replaceTerms and start observing DOM changes
chrome.storage.local.get(isEnabledKey, (data) => {
  if (data[isEnabledKey] !== false) {
      replaceTerms();
      observeDOMChanges();
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggle !== undefined) {
      chrome.storage.local.get(isEnabledKey, (data) => {
          const isEnabled = data[isEnabledKey] !== false;
          chrome.storage.local.set({ [isEnabledKey]: request.toggle });

          if (request.toggle) {
              replaceTerms();
              observeDOMChanges();
          } else {
              location.reload();
          }
      });
  }
});
