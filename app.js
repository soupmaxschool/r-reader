const proxyUrl = `/api/reddit?sub=${sub}`;

const res = await fetch(proxyUrl);
const data = await res.json();

data.posts.forEach(p => {
  const div = document.createElement("div");
  div.className = "post";
  div.innerHTML = `
    <h2>${p.title}</h2>
    <p>u/${p.author} • ${new Date(p.date).toLocaleString()}</p>
    <p>${p.content}</p>
  `;
  div.onclick = () => window.open(p.link, "_blank");
  postsEl.appendChild(div);
});
