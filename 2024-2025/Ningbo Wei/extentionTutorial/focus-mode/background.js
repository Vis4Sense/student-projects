chrome.runtime.onInstalled.addListener(() => {  //use runtime.onInstalled() api
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });

const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';
const uoe = 'https://www.star.euclid.ed.ac.uk/';

chrome.action.onClicked.addListener(async (tab) => {  //监听，当用户点击脚本图标时，，，
if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)||tab.url.startsWith(uoe)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';   //在浏览器bar显示插件状态

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState, //切换在浏览器bar显示插件状态
    });

    if (nextState === 'ON') {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.insertCSS({
          files: ['focus-mode.css'],
          target: { tabId: tab.id }
        });
    } else if (nextState === 'OFF') {
        // Remove the CSS file when the user turns the extension off
        await chrome.scripting.removeCSS({
          files: ['focus-mode.css'],
          target: { tabId: tab.id }
        });
    }
}
});