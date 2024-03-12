// Save session data
function saveSessionData(data) {
    chrome.storage.sync.set({ 'sessionData': data }, function() {
        console.log('Session data saved:', data);
    });
}

// Retrieve session data
function getSessionData(callback) {
    chrome.storage.sync.get('sessionData', function(result) {
        var sessionData = result.sessionData || {};
        console.log('Retrieved session data:', sessionData);
        callback(sessionData);
    });
}

// Example usage
// Save session data
var sessionData = {
    'username': 'user123',
    'theme': 'dark'
};
saveSessionData(sessionData);

// Retrieve session data
getSessionData(function(data) {
    console.log('Username:', data.username);
    console.log('Theme:', data.theme);
});