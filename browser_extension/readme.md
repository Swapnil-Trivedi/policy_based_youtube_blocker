# Key components
### Manifest File (manifest.json):

This is the central configuration file for the extension. It contains metadata about the extension, such as its name, version, description, permissions, and any other essential settings.
In addition, the manifest file defines the extension's components, such as background scripts, popup pages, and content scripts.

### Background Scripts:

Background scripts run in the background and perform tasks that don't require user interaction. These scripts manage events like browser tab updates, button clicks, or handling asynchronous operations like making network requests.
In Manifest V3, background scripts are replaced by service workers.

### Popup (popup.html and popup.js):

A popup is a small UI that appears when the user clicks on the extension icon in the browser toolbar. It is defined in popup.html and its behavior is controlled by JavaScript (popup.js).
This part is used to create a user-friendly interface to interact with the extension.

### Content Scripts:

Content scripts are JavaScript files that run in the context of web pages. They are used to modify the content of a page (e.g., inserting HTML, changing CSS, interacting with page elements).
Content scripts are injected by the extension and can access the DOM of web pages.

### Permissions:

Browser extensions often request specific permissions to access certain resources, such as tabs, browsing history, or other websites.
Permissions are declared in the manifest.json file.

#### How to run

1. open chrome://extensions/
2. enable developer mode
3. load extension pack
4. run youtbe and verify on console