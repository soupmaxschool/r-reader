const input = document.getElementById("subredditInput");
const sort = document.getElementById("sortSelect");
const postsEl = document.getElementById("posts");
const darkToggle = document.getElementById("darkToggle");

document.getElementById("loadBtn").onclick = loadPosts;
darkToggle.onclick = () => document.body.classList.toggle("dark");

async function loadPosts() {
  const sub = input.value.trim();
  if (!sub) return;

  postsEl.innerHTML = "Loading…";

  const url = `https://www.reddit.com/r/${sub}/${sort.value}.json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    postsEl.innerHTML = "";

    data.data.children.forEach(({ data: p }) => {
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
    postsEl.innerHTML = "Failed to load subreddit.";
  }
}

function openPost(post) {
  postsEl.innerHTML = `
    <div class="post">
      <h2>${post.title}</h2>
      ${post.selftext_html ? decode(post.selftext_html) : ""}
      ${post.url && post.url.match(/\.(jpg|png|gif)$/)
        ? `<img src="${post.url}" style="max-width:100%">`
        : ""}
      <p><a href="https://reddit.com${post.permalink}" target="_blank">Open on Reddit</a></p>
    </div>
  `;
}

function decode(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
