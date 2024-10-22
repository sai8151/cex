// Function to call Gemini API
const GEMINI_API_KEY = "AIzaSyCPhEB434dxG95xH9ZEGYLSZ4Uf_LNaEcA";

async function callGeminiAPI(command) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const data = {
        contents: [
            {
                parts: [
                    { text: command }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { action: "error", message: "API request failed" };
    }
}

// Function to process user commands
async function processCommand(command) {
    const prompt = `
You are an intelligent agent designed to process user commands and determine appropriate actions based on the context provided. Your task is to analyze the question given and return a structured JSON object with the following properties:

{
    "action": "string", // This should be one of the predefined actions such as "takeScreenshot", "openFirstEmail", "sendOutlookEmail", "openGmail", "scrollDown", "fillForm", "googleSearch", "openWebsite" these are the available options.
    "paramaters":"string" // If the user asks to open a website, the agent should provide the correct URL for that website in the parameters field based on its knowledge. For example, if the user asks to open Microsoft Teams, the response should set "parameters": "https://teams.microsoft.com/" and "action": "openWebsite". The agent should handle similar requests for websites like WhatsApp Web, Gmail, Outlook, etc., by returning the appropriate URLs automatically without needing the user to specify them.
}

Here is the question: ${command}

If you don't understand the command or if there is no appropriate action to take, please return the following JSON object: 
{
    "action": "no_option"
}
Please ensure your response is a valid JSON object without any additional text or formatting outside of the JSON structure.
`;

    const response = await callGeminiAPI(prompt);
    console.log("Response from Gemini API:", response);

    const actionString = response.candidates[0].content.parts[0].text.trim();
    const actionObj = JSON.parse(actionString);
    const action = actionObj.action;
    const parameters = actionObj.parameters ? actionObj.parameters : "No parameters provided";

    console.log("Action from response:", action);
    console.log("Parameters : ", parameters);

    // Create a notification for the action
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: action,
        message: action
    });

    switch (action) {
        case "openFirstEmail":
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "openFirstEmail" });
            });
            break;
        case "sendOutlookEmail":
            sendOutlookEmail("");
            break;
        case "takeScreenshot":
            chrome.runtime.sendMessage({ action: "takeScreenshot" });
            break;
        case "googleSearch": // working
            chrome.tabs.create({ url: `https://www.google.com/search` });
            break;
        case "openWebsite": // testing
            chrome.tabs.create({ url: parameters });
            break;
        case "openGmail":
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "openGmail" });
            });
            break;
        case "scrollDown": // working
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "scrollDown" });
            });
            break;
        case "no_option":
            no_option();
            break;
        default:
            console.log("Unknown command");
            console.log(action);
    }
}

// Listening for commands from the popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "executeCommand") {
        processCommand(request.command);
    }
});
