function onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.title && /^\d{3,4}\.pdf$/.test(changeInfo.title)) {
        chrome.tabs.sendMessage(tabId, {msg: "title_changed", newTitle: changeInfo.title });
        console.log("[Crypto Paper Tab Titles] Detected title change: ", changeInfo.title);
    }
}

chrome.tabs.onUpdated.addListener(onTabUpdated);
