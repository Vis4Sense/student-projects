console.log("Content script running.");

var pageTitle = document.title;
var pageURL = window.location.href;
var faviconURL = null;

// Find the favicon URL from the page's <link> tags
var faviconLink = document.querySelector("link[rel~='icon']") || document.querySelector("link[rel~='shortcut icon']");

if (faviconLink) {
    faviconURL = faviconLink.href;
} else {
    // Fallback to default favicon URL
    faviconURL = "default-favicon.png";
}

console.log("Page Title:", pageTitle);
console.log("Page URL:", pageURL);
console.log("Favicon URL:", faviconURL);

// Send data to extension script
chrome.runtime.sendMessage({
    type: "page_info",
    data: {
        pageTitle: pageTitle,
        pageURL: pageURL,
        faviconURL: faviconURL
    }
});
