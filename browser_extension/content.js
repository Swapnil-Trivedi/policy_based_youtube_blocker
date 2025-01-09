// Function to extract video ID from a YouTube URL
function extractVideoId(url) {
    const regex = /(?:v=|\/videos\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  
  // Function to extract and log video IDs on the page
  function logVideoIds() {
    const videoIds = [];
    const videoElements = document.querySelectorAll('a[href*="watch?v="]');
  
    videoElements.forEach((el) => {
      const videoId = extractVideoId(el.href);
      if (videoId) {
        videoIds.push(videoId);
      }
    });
  
    console.log("Video IDs on this page: ", videoIds);
  }
  
  // Check if we're on a single video page
  if (window.location.href.includes("youtube.com/watch")) {
    // Log the single video ID
    const videoId = extractVideoId(window.location.href);
    if (videoId) {
      console.log("Single Video ID: ", videoId);
    }
  } else if (window.location.href.includes("youtube.com")) {
    // Log video IDs initially on the page load
    logVideoIds();
  
    // Set up a MutationObserver to track dynamically loaded content (infinite scroll)
    const observer = new MutationObserver(() => {
      logVideoIds();  // Log video IDs every time new videos are added
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
        logVideoIds();  // Log video IDs when scrolling to the bottom
      }
    });
  }
  