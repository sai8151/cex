// Inject a floating search bar when the user is on Gmail or Outlook
const floatingBarHtml = `
    <div id="floating-bar" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background-color: #fff; padding: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        <input id="command-input" type="text" placeholder="Type a command" style="padding: 5px; width: 300px;" />
        <button id="submit-command" style="padding: 5px;">Submit</button>
    </div>
`;

document.body.insertAdjacentHTML('beforeend', floatingBarHtml);

// Add event listener to submit command
document.getElementById('submit-command').addEventListener('click', () => {
    const command = document.getElementById('command-input').value;
    chrome.runtime.sendMessage({ action: "executeCommand", command: command });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrollDown") {
        scrollDown();
    }
    if (request.action === "openGmail") {
        openGmail();
    }
});

// Function to scroll down on the page
async function scrollDown() {
    window.scrollBy(0, 1000);
}

// Open the first email in Gmail
async function openFirstEmail() {
    const emails = document.querySelectorAll(".zA");  // Gmail email class
    if (emails.length > 0) {
        emails[0].click();
    }
}

// Function to open Gmail
async function openGmail() {
    window.location.href = "https://mail.google.com";
}

// Function to handle no option
async function no_option() {
    alert("No option");
}

