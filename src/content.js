(async function() {
    const browser = "___BROWSER___"; // Set via build script.

    if (document.location.hostname !== "eprint.iacr.org") {
        return;
    }

    const [, year = null, number = null] = location.pathname.match(/\/(\d{4})\/(\d{3,4})\.pdf/) || [];
    if (!year || !number) {
        return;
    }
    
    // Chrome's PDF viewer sets the title of the tab dynamically using JavaScript
    // *after* the page has been loaded. Before that, i.e. when this code runs, 
    // document.title is the empty string. Since we retrieve the new title asynchronously,
    // we have to wait until Chrome's PDF viewer has set "its" title and then overwrite it.
    // Unfortunately, there are two problems:
    // 1. Using MutationObserver to observe changes to the <title> element does not work. As a workaround,
    //    we use a service worker which subscribes to chrome.tabs.onUpdated and informs this content script
    //    about (external) changes to the title of the browser tab.
    // 2. It seems like we can set document.title only once, i.e. all further calls to document.title= are ignored.
    //    Hence, we have to wait for the browser to set "its" title before we use our one and only call to the setter of document.title.
    // In Safari, no such workaround is necessary, i.e., we can set the tab title directly in this browser.
    let newTabTitle = null;
    let browserSetItsTitle = false;
    if (browser === "Chrome") {
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.msg === "title_changed") {
                if (newTabTitle) {
                    console.log("[Crypto Paper Tab Titles] New title notification:", request.newTitle);
                    console.log("[Crypto Paper Tab Titles] We were faster to fetch the new title than the PDF viewer to set its own title, so overwriting it now...");
                    document.title = newTabTitle;
                }
                browserSetItsTitle = true;
            }
        });
    }

    const paperMetadata = await retrievePaperMetadata(year, number);
    if (paperMetadata) {
        newTabTitle = `${paperMetadata.title} - ${paperMetadata.authors} - ${year}/${number}.pdf`;
        if (browserSetItsTitle) {
            console.log("[Crypto Paper Tab Titles] The PDF viewer was faster to set its own title than we were to fetch the new title, so we can now safely set it...");
            document.title = newTabTitle;
        }
        else if (browser !== "Chrome") {
            console.log("[Crypto Paper Tab Titles] Not running in Chrome/Edge. Setting title directly...");
            document.title = newTabTitle;
        }
    }
})();

async function retrievePaperMetadata(year, number) {
    //
    // Check the cache first.
    //
    const cacheBucketKey = "papers_" + year;
    const bucket = (await chrome.storage.local.get(cacheBucketKey))[cacheBucketKey];
    if (bucket && bucket.version === 1) {
        const paperMetadata = bucket.papers[number];
        if (paperMetadata) {
            console.log("[Crypto Paper Tab Titles] Found the paper in the cache.");
            return paperMetadata;
        }
    }

    //
    // Cache miss -> update the cache
    //
    console.log("[Crypto Paper Tab Titles] Could not find the paper metadata in the cache. Updating the cache...");

    // This variable stores the requested paper metadata.
    // We update the cache and if we find the requested metadata along the way, we store it here and return it once the cache is fully updated.
    let requestedPaper = null;

    // Throttle requests to ensure we send at most one request every 10 minutes.
    const paperListLastUpdatedAt = (await chrome.storage.local.get("paperListLastUpdatedAt")).paperListLastUpdatedAt;
    const now = Date.now();
    if (!paperListLastUpdatedAt || (now - paperListLastUpdatedAt >= 1000 * 60 * 10)) {
        // This is the first update or at least 10 minutes have passed since the last update.
        await chrome.storage.local.set({paperListLastUpdatedAt: now});
        const doc = await fetchPaperList();
        const nodes = doc.getElementById("eprintContent").lastElementChild.children;
        if (nodes.length % 2 === 0) {
            let currentBucket = null;
            for (let i = 0; i < nodes.length; i += 2) {
                const paperId = nodes[i].innerText;
                if (!isValidPaperId(paperId)) {
                    continue;
                }

                const yr = paperId.substring(0, 4);
                const num = paperId.substring(5);

                const divNode = nodes[i+1];
                if (!divNode) {
                    continue;
                }

                const paperTitleNode = divNode.firstElementChild;
                const authorsNode = divNode.lastElementChild;
                if (!paperTitleNode || !authorsNode || paperTitleNode.tagName !== "STRONG" || authorsNode.tagName !== "EM") {
                    continue;
                }

                if (currentBucket && currentBucket.year !== yr) {
                    // Save previous bucket
                    await chrome.storage.local.set({["papers_" + currentBucket.year]: currentBucket});
                    currentBucket = null;
                }

                if (!currentBucket) {
                    currentBucket = {version: 1, year: yr, papers: {}};
                }

                const paper = { title: paperTitleNode.innerText, authors: authorsNode.innerText };
                currentBucket.papers[num] = paper;
                
                // Check whether we found the paper we are looking for.
                if (yr === year && num === number) {
                    requestedPaper = paper;
                }
            }

            // Save the last bucket
            if (currentBucket) {
                await chrome.storage.local.set({["papers_" + currentBucket.year]: currentBucket});
            }
        }
    } else {
        console.log("[Crypto Paper Tab Titles] Unable to update the cache due to (self-imposed) request rate limit...");
    }

    if (!requestedPaper) {
        console.log("[Crypto Paper Tab Titles] Could not determine the title for this paper.");
    }

    return requestedPaper;
}

function fetchPaperList() {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.responseXML);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.open("GET", "https://eprint.iacr.org/complete/compact");
        xhr.responseType = "document";
        xhr.send();
    });
}

function isValidPaperId(paperId) {
    if (paperId.length !== 9 && paperId.length !== 8 || paperId[4] !== "/") {
        return false;
    }

    for (let i = 0; i < paperId.length; i++) {
        if (i == 4) {
            continue;
        }
        
        const c = paperId[i];
        if (c < '0' || c > '9') {
            return false;
        }
    }

    return true;
}