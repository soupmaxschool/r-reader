const input = document.getElementById("subredditInput");
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

  const proxyUrl = `/api/reddit?sub=${encodeURIComponent(sub)}`;

  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();

    const posts = data.posts || [];
    if (!posts.length) {
      postsEl.innerHTML = `<div>No posts found for this subreddit.</div>`;
      return;
    }

    postsEl.innerHTML = "";
    posts.forEach(p => {
      const div = document.createElement("div");
      div.className = "post";

      const title = p.title || "(no title)";
      const author = p.author || "unknown";
      const score = p.score || p.ups || 0;
      const comments = p.num_comments || 0;
      const link = p.full_link || p.url || null;

      div.innerHTML = `
        <h2>${title}</h2>
        <p>👍 ${score} • 💬 ${comments} • u/${author}</p>
      `;
      div.onclick = () => {
        if (link) window.open(link, "_blank");
      };
      postsEl.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    postsEl.innerHTML = `
      <div>Failed to load from mirror. Try again or another subreddit.</div>
      <button onclick="loadPosts()">Retry</button>
    `;
  }
}
