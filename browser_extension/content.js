// Function to extract video ID from a YouTube URL
function extractVideoId(url) {
    const regex = /(?:v=|\/videos\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  
  // Function to mask blocked video thumbnails
  function applyVideoStatus(statusResponse) {
    const videoElements = document.querySelectorAll('a[href*="watch?v="]');
  
    videoElements.forEach((el) => {
      const videoId = extractVideoId(el.href);
  
      if (videoId && statusResponse[videoId] === "blocked") {
        // Mask thumbnail with solid grey
        const thumbnail = el.querySelector("img");
        if (thumbnail) {
          thumbnail.style.backgroundColor = "gray";
          thumbnail.style.filter = "blur(4px)";  // Optional: Adding blur effect to mask it visually
        }
  
        // Disable video play on hover (simulate hover block)
        el.addEventListener("mouseenter", (e) => {
          e.preventDefault();
          alert(`Video with ID: ${videoId} is blocked.`);
        });
  
        // Redirect blocked video when clicked
        el.addEventListener("click", (e) => {
          e.preventDefault();  // Prevent default action (opening the video)
          window.location.href = "https://www.youtube.com";  // Redirect to YouTube homepage
        });
      }
    });
  }
  
  // Function to track and process video IDs in a state array
  let currentVideoIds = [];  // Internal array to track video IDs
  
  function processVideoElements() {
    const videoElements = document.querySelectorAll('a[href*="watch?v="]');
    const newVideoIds = [];
  
    videoElements.forEach((el) => {
      const videoId = extractVideoId(el.href);
      if (videoId && !newVideoIds.includes(videoId)) {
        newVideoIds.push(videoId);  // Add video ID if it's not already in the list
      }
    });
  
    // If there are new video IDs, update the state and send to background.js
    if (newVideoIds.length > 0) {
      const addedVideoIds = newVideoIds.filter(id => !currentVideoIds.includes(id));
      const allVideoIds = [...currentVideoIds, ...addedVideoIds];  // Merge new IDs with the current state
  
      if (addedVideoIds.length > 0) {
        currentVideoIds = allVideoIds;  // Update the state only if there is a change
        console.log("Updated video IDs:", currentVideoIds);  // Log the updated video IDs to the console
        // Send the updated video IDs to background.js
        chrome.runtime.sendMessage({
          action: "sendToServer",
          videoIds: addedVideoIds  // Send only new video IDs to the server
        });
      }
    }
  }
  
  // Listen for status messages from background.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "applyVideoStatus") {
      const videoIdsWithStatus = message.videoIdsWithStatus;
      applyVideoStatus(videoIdsWithStatus);  // Apply the blocking logic based on video statuses
    }
  });
  
  // Check if we're on a single video page
  if (window.location.href.includes("youtube.com/watch")) {
    const videoId = extractVideoId(window.location.href);
    if (videoId) {
      console.log("Single Video ID: ", videoId);
      // Simulate backend response (random status assignment for now)
      const simulatedStatusResponse = simulateBackendResponse([videoId]);
      applyVideoStatus(simulatedStatusResponse);
    }
  } else if (window.location.href.includes("youtube.com")) {
    // Log video IDs initially on the page load
    processVideoElements();
  
    // Set up a MutationObserver to track dynamically loaded content (infinite scroll)
    const observer = new MutationObserver(() => {
      processVideoElements();  // Process and log new video IDs whenever DOM changes
    });
  
    // Observe the body of the document for changes in child elements (new videos added)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  
    // Optional: Set up scroll event listener if needed (less efficient than MutationObserver)
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        processVideoElements();  // Process and log new video IDs when scrolling to the bottom
      }
    });
  }
  
  // Function to simulate backend response (for now, returns random 'allowed' or 'blocked' status)
  function simulateBackendResponse(videoIds) {
    const statusResponse = {};
    videoIds.forEach((videoId) => {
      // Randomly assign 'allowed' or 'blocked'
      const status = Math.random() > 0.5 ? 'allowed' : 'blocked';
      statusResponse[videoId] = status;
    });
    return statusResponse;
  }
  