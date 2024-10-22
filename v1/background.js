// Simulated Gemini API response (replace with actual API call later)
function simulateGeminiAPI(command) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (command.includes("open new tab")) {
                resolve({ action: "openNewTab" });
            } else if (command.includes("search for")) {
                const searchQuery = command.split("search for")[1].trim();
                resolve({ action: "search", query: searchQuery });
            } else {
                resolve({ action: "unknown" });
            }
        }, 500);
    });
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "executeCommand") {
        processCommand(request.command);
    }
});

// Process the command
async function processCommand(command) {
    console.log("Processing command:", command);

    try {
        const response = await simulateGeminiAPI(command);

        switch (response.action) {
            case "openNewTab":
                chrome.tabs.create({});
                break;
            case "search":
                chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(response.query)}` });
                break;
            default:
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "icon.png",
                    title: "AI Browser Agent",
                    message: "I'm not sure how to handle that command."
                });
        }
    } catch (error) {
        console.error("Error processing command:", error);
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "AI Browser Agent",
            message: "An error occurred while processing your command."
        });
    }
}

// Helper function to switch tabs
function switchTab(tabId) {
    chrome.tabs.update(tabId, { active: true });
}

// Helper function to navigate to a URL
function navigateToUrl(url) {
    chrome.tabs.create({ url: url });
}