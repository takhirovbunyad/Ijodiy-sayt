document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");

  if (window.openDashId) {
    const dashId = window.openDashId;

    fetch(`/dash/${dashId}/json/`, {
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(res => res.json())
      .then(data => {
        // Video embed
        let videoHTML = "";
        if (data.url) {
          let videoId = null;
          if (data.url.includes("youtube.com/watch?v=")) {
            videoId = new URL(data.url).searchParams.get("v");
          } else if (data.url.includes("youtu.be/")) {
            videoId = data.url.split("youtu.be/")[1].split("?")[0];
          }
          if (videoId) {
            videoHTML = `
              <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}"
                        frameborder="0" allowfullscreen>
                </iframe>
              </div>`;
          }
        }

        document.getElementById("modal-title").innerText = data.title;
        document.getElementById("modal-desc").innerText = data.description;
        document.getElementById("modal-source").innerText = data.source;
        document.getElementById("modal-video").innerHTML = videoHTML;
        document.getElementById("modal-link").href = data.url || "#";

        modal.style.display = "block";
      });
  }
});
