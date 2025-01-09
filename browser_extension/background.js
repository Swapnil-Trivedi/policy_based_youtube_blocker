// Function to send the video IDs and statuses to content.js
function sendStatusToContentScript(videoIdsWithStatus) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applyVideoStatus",
        videoIdsWithStatus: videoIdsWithStatus
      });
    });
  }
  
  // Simulate backend response (randomly assign 'blocked' or 'allowed')
  function simulateBackendResponse(videoIds) {
    const statusResponse = {};
    videoIds.forEach((videoId) => {
      // Randomly assign 'allowed' or 'blocked'
      const status = Math.random() > 0.5 ? 'allowed' : 'blocked';
      statusResponse[videoId] = status;
    });
    return statusResponse;
  }
  
  // Function to send video IDs to the server (for later use when backend is ready)
  async function sendVideoIdsToServer(videoIds) {
    const url = "http://localhost:8080/blocker/videos";
    const body = JSON.stringify({ videoIds: videoIds });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: body
      });
  
      if (response.ok) {
        console.log("Successfully sent video IDs to server.");
        const data = await response.json();
        // Once we get the response from the backend, send it to content.js
        sendStatusToContentScript(data.videoIdsWithStatus);
      } else {
        console.error("Failed to send video IDs to server.");
      }
    } catch (error) {
      console.error("Error sending video IDs to server:", error);
    }
  }
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendToServer") {
      const videoIds = message.videoIds;  // Get video IDs from content.js
      sendVideoIdsToServer(videoIds);  // Send the video IDs to the server
  
      // Simulate backend response (for now, use random statuses)
      const simulatedStatusResponse = simulateBackendResponse(videoIds);
      sendStatusToContentScript(simulatedStatusResponse);  // Send simulated status to content.js
    }
  });
  