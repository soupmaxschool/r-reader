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

  const redditUrl = `https://www.reddit.com/r/${sub}/${sort.value}.json`;
  const proxyUrl = `/api/reddit?url=${encodeURIComponent(redditUrl)}`;

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();

    const children = data?.data?.children || [];
    if (!children.length) {
      postsEl.innerHTML = `<div>No posts found or subreddit restricted.</div>`;
      return;
    }

    postsEl.innerHTML = "";
    children.forEach(({ data: p }) => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <h2>${p.title}</h2>
        <p>👍 ${p.ups} • 💬 ${p.num_comments} • u/${p.author}</p>
      `;
      div.onclick = () => openPost(p);
      postsEl.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    postsEl.innerHTML = `
      <div>Failed to load subreddit via proxy.</div>
      <button onclick="loadPosts()">Retry</button>
    `;
  }
}

function openPost(post) {
  postsEl.innerHTML = `
    <div class="post">
      <h2>${post.title}</h2>
      ${post.selftext_html ? decode(post.selftext_html) : ""}
      ${
        post.url && post.url.match(/\.(jpg|png|gif)$/)
          ? `<img src="${post.url}" style="max-width:100%">`
          : ""
      }
      <p><a href="https://reddit.com${post.permalink}" target="_blank">
        Open on Reddit
      </a></p>
    </div>
  `;
}

function decode(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
