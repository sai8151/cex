let floatingBar;

// Inject the floating search bar
function injectFloatingSearchBar() {
    fetch(chrome.runtime.getURL('floatingBar.html'))
        .then(response => response.text())
        .then(html => {
            const div = document.createElement('div');
            div.innerHTML = html;
            floatingBar = div.firstChild;
            document.body.appendChild(floatingBar);

            // Add event listener only if the element exists
            const submitButton = document.getElementById('submit-command');
            if (submitButton) {
                submitButton.addEventListener('click', handleCommand);
            } else {
                console.error("Submit button not found!");
            }
        })
        .catch(error => console.error("Error loading floating bar:", error));
}

// Handle user commands
function handleCommand() {
    const command = document.getElementById('command-input').value;
    chrome.runtime.sendMessage({ action: "executeCommand", command: command });
}

// Initialize
injectFloatingSearchBar();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleFloatingBar") {
        if (request.isVisible) {
            floatingBar.style.display = 'block';
        } else {
            floatingBar.style.display = 'none';
        }
    } else if (request.action === "performAction") {
        switch (request.actionType) {
            case "click":
                simulateClick(request.x, request.y);
                break;
            case "type":
                simulateTyping(request.text);
                break;
            case "scroll":
                window.scrollTo(request.x, request.y);
                break;
        }
    }
});

// Simulate a click at given coordinates
function simulateClick(x, y) {
    const element = document.elementFromPoint(x, y);
    if (element) {
        element.click();
    }
}

// Simulate typing
function simulateTyping(text) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.value += text;
    }
}

// Check initial visibility state
chrome.storage.local.get(['floatingBarVisible'], function (result) {
    if (floatingBar) {
        floatingBar.style.display = result.floatingBarVisible ? 'block' : 'none';
    }
});
