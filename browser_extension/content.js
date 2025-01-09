// Function to extract video ID from a YouTube URL
function extractVideoId(url) {
    const regex = /(?:v=|\/videos\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  
  // Check if we're on the YouTube homepage or a playlist page
  if (window.location.href.includes("youtube.com/watch")) {
    // If we're on a single video page, log the video ID
    const videoId = extractVideoId(window.location.href);
    if (videoId) {
      console.log("Single Video ID: ", videoId);
    }
  } else if (window.location.href.includes("youtube.com")) {
    // If we're on the homepage or playlist page, log all video IDs in the window
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
  