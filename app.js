const input = document.getElementById("subredditInput");
const sort = document.getElementById("sortSelect");
const postsEl = document.getElementById("posts");
const darkToggle = document.getElementById("darkToggle");

document.getElementById("loadBtn").onclick = loadPosts;

// dark mode persistence
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

async function loadPosts() {
  const sub = input.value.trim();
  if (!sub) return;

  postsEl.innerHTML = `<div class="loading">Loading…</div>`;

  const proxyUrl = `/api/reddit?sub=${encodeURIComponent(sub)}&sort=${encodeURIComponent(
    sort.value
  )}`;

  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (!data.posts || !data.posts.length) {
      postsEl.innerHTML = `<div>No posts found or subreddit blocked.</div>`;
      return;
    }

    postsEl.innerHTML = "";
    data.posts.forEach(p => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <h2>${p.title}</h2>
        <p>👍 ${p.score} • 💬 ${p.comments} • u/${p.author}</p>
      `;
      div.onclick = () => {
        if (p.link) window.open(p.link, "_blank");
      };
      postsEl.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    postsEl.innerHTML = `
      <div>Scrape failed. Try again or another subreddit.</div>
      <button onclick="loadPosts()">Retry</button>
    `;
  }
}
