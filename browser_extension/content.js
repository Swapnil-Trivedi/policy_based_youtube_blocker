// Function to extract video ID from a YouTube URL
function extractVideoId(url) {
    const regex = /(?:v=|\/videos\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  
  // Maintain an array of video IDs to avoid duplicates
  let videoIds = [];
  let firstLogDone = false;  // Track if the first log has been done
  
  // Function to log the video IDs array
  function logVideoIds() {
    console.log("All Video IDs on this page:", videoIds);
  }
  
  // Function to add new video IDs to the array
  function addVideoIds(newVideoIds) {
    let stateChanged = false;
  
    newVideoIds.forEach((videoId) => {
      if (!videoIds.includes(videoId)) {
        videoIds.push(videoId);  // Add new video ID if not already in the array
        stateChanged = true;  // Mark that the state has changed
      }
    });
  
    // Log the array if it's the first addition or if the state changed
    if (stateChanged) {
      if (!firstLogDone) {
        logVideoIds();  // Log the first time after page load
        firstLogDone = true;  // Set the flag so that future logs happen only on state change
      } else {
        logVideoIds();  // Log again only if new video IDs were added
      }
  
      // Send the updated video IDs to the background script for server processing
      chrome.runtime.sendMessage({ action: "sendToServer", videoIds: videoIds });
    }
  }
  
  // Function to extract and process video IDs on the page
  function processVideoElements() {
    const videoElements = document.querySelectorAll('a[href*="watch?v="]');
    const newVideoIds = [];
  
    videoElements.forEach((el) => {
      const videoId = extractVideoId(el.href);
      if (videoId && !newVideoIds.includes(videoId)) {
        newVideoIds.push(videoId);  // Add video ID if it's not already in the list
      }
    });
  
    if (newVideoIds.length > 0) {
      addVideoIds(newVideoIds);  // Add new video IDs to the internal array
    }
  }
  
  // Check if we're on a single video page
  if (window.location.href.includes("youtube.com/watch")) {
    // Log the single video ID
    const videoId = extractVideoId(window.location.href);
    if (videoId) {
      console.log("Single Video ID: ", videoId);
      // Send the single video ID to the background script for server processing
      chrome.runtime.sendMessage({ action: "sendToServer", videoIds: [videoId] });
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
      // You can limit the number of checks to avoid performance issues
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        processVideoElements();  // Process and log new video IDs when scrolling to the bottom
      }
    });
  }
  