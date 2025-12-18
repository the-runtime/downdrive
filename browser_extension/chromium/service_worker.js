chrome.downloads.onCreated.addListener(handleDownload);

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ state: false }, () => {
        if (chrome.runtime.lastError) {
            console.log("Error saving state", chrome.runtime.lastError);
        }
    });
});

function handleDownload(down) {
    chrome.storage.local.get("state").then((val) => {
        console.log(val.state);
        if (val.state) {
            let downloadId = down.id;
            let downloadUrl = down.url;
            console.log(downloadUrl);

            function directDownDrive() {
                console.log("download redirected");
                let downUrl =
                    "https://downdrive.theruntime.world/api/process/?url=" +
                    downloadUrl;
                console.log(downUrl);
                chrome.tabs.create({ url: downUrl });
                clearDownloads(downloadId);
            }
            function cancelDownloads(downloadId) {
                let canceling = chrome.downloads.cancel(
                    downloadId,
                    directDownDrive,
                );
            }
            function clearDownloads(downloadId) {
                chrome.downloads.erase({ id: downloadId });
            }

            cancelDownloads(downloadId);
        }
    });
}
