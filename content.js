const supabaseScript = document.createElement("script");

supabaseScript.src =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = loadCurrentAffairs;

document.head.appendChild(supabaseScript);


async function loadCurrentAffairs() {

  const client = supabase.createClient(
    "https://xjobzypcjrahstesdljv.supabase.co",
    "sb_publishable_-YNBva4Uns4Di2nTRdW6_A_0nHZu-op"
  );

  const { data, error } = await client
    .from("current_affairs")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Current Affairs Error:", error);
    return;
  }

  const list = document.querySelector("#dynamicArticles");

  if (!list) return;

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No current affairs available.</p>";
    return;
  }

  list.innerHTML = data.map(article => {

    const image = article.image ||
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop";

    const date = new Date(article.date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

    return `
      <div class="article-row">

        <div class="thumb">
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(article.title)}"
          >
        </div>

        <div>

          <h3>
            <a href="article.html?id=${article.id}">
              ${escapeHtml(article.title)}
            </a>
          </h3>

          <p>
            ${escapeHtml(article.summary || "")}
          </p>

          <div class="meta-row">

            <span class="tag">
              ${escapeHtml(article.category)}
            </span>

            <span>${date}</span>

          </div>

        </div>

      </div>
    `;

  }).join("");
}


function escapeHtml(value) {

  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

}
