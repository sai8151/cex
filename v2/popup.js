document.getElementById('submit-command').addEventListener('click', () => {
    const command = document.getElementById('command-input').value;
    chrome.runtime.sendMessage({ action: "executeCommand", command: command });
});
