document.addEventListener('DOMContentLoaded', function () {
    const toggleCheckbox = document.getElementById('toggle-floating-bar');

    // Load saved state
    chrome.storage.local.get(['floatingBarVisible'], function (result) {
        toggleCheckbox.checked = result.floatingBarVisible || false;
    });

    // Save state on change
    toggleCheckbox.addEventListener('change', function () {
        const isVisible = toggleCheckbox.checked;
        chrome.storage.local.set({ floatingBarVisible: isVisible });

        // Send message to content script to show/hide floating bar
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "toggleFloatingBar", isVisible: isVisible });
        });
    });
});