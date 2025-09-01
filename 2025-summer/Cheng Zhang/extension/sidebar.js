const API_BASE = "http://localhost:8000";
const SERPAPI_NUM = 200;

const resultsEl     = document.getElementById("results");
const searchBtn     = document.getElementById("search-btn");
const queryInput    = document.getElementById("query-input");
const compareBtn    = document.getElementById("compare-btn");
const compareCont   = document.getElementById("compare-container");
const recommendationDiv = document.getElementById("recommendation");
const selectedList  = document.getElementById("selected-list");

// Q&A history
const qaList = document.getElementById("qa-list");

let currentItems = [];
let lastUsedKeywords = [];
let SERPAPI_KEY = "";
let selectedItems = [];
let questionQueue = [];

// --- NEW: attribute cache & in-flight map ---
const attrsCache = new Map();      // id -> {brand, price, rating, features}
const inflightAttr = new Map();    // id -> Promise

// Multi-round search context
let searchContext = {
  query: "",
  keywords: [],
  brand: null,
  priceMin: null,
  priceMax: null,
  color: null
};

// Load SerpAPI key
fetch(`${API_BASE}/config`)
  .then(res => res.json())
  .then(data => { SERPAPI_KEY = data.serpapi_key; })
  .catch(err => { console.error("❌ Failed to load SERPAPI key:", err); });

// Add Q&A record
function addQA(question, answer) {
  const div = document.createElement("div");
  div.style.marginBottom = "6px";
  div.innerHTML = `<b>Q:</b> ${question}<br/><b>A:</b> ${answer || "(skipped)"}`;
  qaList.appendChild(div);
}

// Selected history render
function renderSelectedHistory() {
  selectedList.innerHTML = "";
  if (selectedItems.length === 0) {
    selectedList.innerHTML = "<i>No products selected.</i>";
    compareBtn.disabled = true;
    return;
  }

  selectedItems.forEach(pid => {
    const item = currentItems.find(i => i.id === pid);
    if (!item) return;
    const div = document.createElement("div");
    div.style.marginBottom = "6px";
    div.innerHTML = `
      <a href="${item.url}" target="_blank">${item.title}</a>
      <button class="remove-btn" data-id="${pid}">Remove</button>
    `;
    selectedList.appendChild(div);
  });

  compareBtn.disabled = selectedItems.length < 2;

  // bind remove
  selectedList.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-id");
      toggleCompare(pid);
    });
  });
}

// Keyword helpers
function filterKeywords(keywords) {
  let unique = [...new Set(keywords.map(k => k.toLowerCase().trim()))];
  unique = unique.filter((kw, idx, arr) => {
    return !arr.some(other => other !== kw && other.includes(kw));
  });
  return unique;
}

// Ask follow-up flow
function askNextQuestion() {
  if (questionQueue.length === 0) {
    runSearchWithContext();
    return;
  }
  const q = questionQueue.shift();
  resultsEl.innerHTML = `
    <div class="follow-up">
      <p>${q.text}</p>
      <input id="follow-up-input" type="text" placeholder="Please input..." />
      <button id="follow-up-btn">Ok</button>
      <button id="skip-btn">Finish</button>
    </div>
  `;
  document.getElementById("follow-up-btn").onclick = () => {
    const val = document.getElementById("follow-up-input").value.trim();
    addQA(q.text, val);
    if (val) {
      searchContext.keywords.push(val);
      searchContext.keywords = filterKeywords(searchContext.keywords);
    }
    askNextQuestion();
  };
  document.getElementById("skip-btn").onclick = () => {
    addQA(q.text, null);
    runSearchWithContext();
  };
}

function runSearchWithContext() {
  let finalQuery = searchContext.keywords.join(" ");
  if (searchContext.brand) finalQuery += ` ${searchContext.brand}`;
  if (searchContext.priceMin && searchContext.priceMax) {
    finalQuery += ` price ${searchContext.priceMin}-${searchContext.priceMax}`;
  }
  if (searchContext.color) finalQuery += ` ${searchContext.color}`;
  runSearch(finalQuery);
}

// Literal keyword check (kept as-is)
function checkKeywordUse(text, keywords) {
  const lower = (text || "").toLowerCase();
  const filtered = filterKeywords(keywords);
  return filtered.map(k => ({
    keyword: k,
    used: lower.includes(k) ? "Yes" : "No"
  }));
}

/** --- NEW: fetch attributes with caching & dedup ---
 *  - Uses attrsCache to avoid repeat LLM calls
 *  - Uses inflightAttr to coalesce concurrent requests for same id
 */
async function getAttributes(item) {
  const id = item.id;
  if (attrsCache.has(id)) return attrsCache.get(id);

  if (inflightAttr.has(id)) {
    // return the same promise if already fetching
    return inflightAttr.get(id);
  }

  const req = (async () => {
    try {
      const r = await fetch(`${API_BASE}/extract_attributes_llm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          url: item.url
        })
      });
      if (!r.ok) throw new Error("attr API failed");
      const data = await r.json();

      // normalize to avoid undefined
      const normalized = {
        brand: (data.brand ?? "Unknown"),
        price: (data.price ?? "Unknown"),
        rating: (data.rating ?? "Unknown"),
        features: (data.features ?? "Unknown"),
      };
      attrsCache.set(id, normalized);
      return normalized;
    } catch (e) {
      const fallback = { brand: "Unknown", price: "Unknown", rating: "Unknown", features: "Unknown" };
      attrsCache.set(id, fallback);
      return fallback;
    } finally {
      inflightAttr.delete(id);
    }
  })();

  inflightAttr.set(id, req);
  return req;
}

// Render products (Top5 + 6–10)
async function renderTopProducts(items) {
  resultsEl.innerHTML = "";

  const top5 = items.slice(0, 5);
  const rest = items.slice(5, 10);

  let tableHtml = `
    <h3>Top 5 Products</h3>
    <table border="1" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>Title</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Keywords Used</th>
          <th>Features</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  // --- Only fetch attributes for items not cached ---
  const attrsList = await Promise.all(
    top5.map(async (item) => await getAttributes(item))
  );

  top5.forEach((item, idx) => {
    const kwCheck = checkKeywordUse(item.title + " " + (item.description || ""), searchContext.keywords);
    const kwHtml = kwCheck.map(k => `${k.keyword}: ${k.used}`).join("<br/>");
    const attrs = attrsList[idx] || { brand: "Unknown", price: "Unknown", rating: "Unknown", features: "Unknown" };

    tableHtml += `
      <tr>
        <td><a href="${item.url}" target="_blank">${item.title}</a></td>
        <td>${attrs.brand}</td>
        <td>${attrs.price}</td>
        <td>${attrs.rating}</td>
        <td>${kwHtml}</td>
        <td>${attrs.features}</td>
        <td>
          <button class="toggle-btn" data-id="${item.id}">
            ${selectedItems.includes(item.id) ? "Remove" : "Add"}
          </button>
        </td>
      </tr>
    `;
  });

  tableHtml += `</tbody></table>`;
  resultsEl.innerHTML += tableHtml;

  if (rest.length > 0) {
    let listHtml = `<h3>Products Ranked 6–10</h3><ul>`;
    rest.forEach(item => {
      listHtml += `
        <li>
          <a href="${item.url}" target="_blank">${item.title}</a>
          <button class="toggle-btn" data-id="${item.id}">
            ${selectedItems.includes(item.id) ? "Remove" : "Add"}
          </button>
        </li>
      `;
    });
    listHtml += `</ul>`;
    resultsEl.innerHTML += listHtml;
  }

  // bind Add/Remove after render
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-id");
      toggleCompare(pid);
    });
  });
}

// Add / Remove product
function toggleCompare(productId) {
  if (selectedItems.includes(productId)) {
    selectedItems = selectedItems.filter(id => id !== productId);
  } else {
    selectedItems.push(productId);
  }
  // re-render UI, but attributes are cached => no extra LLM calls
  renderTopProducts(currentItems);
  renderSelectedHistory();
}

// Run search
async function runSearch(query) {
  if (!query || !SERPAPI_KEY) {
    resultsEl.innerHTML = "❌ Please enter search text and ensure SerpAPI key is loaded.";
    return;
  }
  searchBtn.disabled = true;
  resultsEl.innerHTML = "🔍 Searching...";
  compareCont.style.display = "none";
  compareBtn.disabled = true;
  recommendationDiv.innerText = "";

  // clear caches on a new search
  attrsCache.clear();
  inflightAttr.clear();
  selectedItems = [];
  renderSelectedHistory();

  try {
    const siteFilter = "site:amazon.com OR site:bestbuy.com OR site:walmart.com";
    const serpQuery = `${query} ${siteFilter}`;
    const serpURL = `https://serpapi.com/search.json?q=${encodeURIComponent(serpQuery)}&engine=google&num=${SERPAPI_NUM}&api_key=${SERPAPI_KEY}`;

    const serpRes = await fetch(serpURL);
    if (!serpRes.ok) throw new Error("SerpAPI request failed");
    const serpData = await serpRes.json();
    const rawItems = serpData.organic_results || [];

    if (rawItems.length === 0) {
      resultsEl.innerHTML = "❌ No results found.";
      return;
    }

    const formatted = rawItems.map((p, i) => ({
      id: `serp_${i}`,
      title: p.title || "",
      url: p.link || "#",
      source: (p.link?.match(/https?:\/\/(?:www\.)?([^\/]+)/i)?.[1] || "unknown"),
      description: p.snippet || "",
      reviews: "",
      position: p.position || (i + 1)
    }));

    // de-dup by URL
    const seenUrls = new Set();
    const deduped = [];
    for (const prod of formatted) {
      if (seenUrls.has(prod.url)) continue;
      seenUrls.add(prod.url);
      deduped.push(prod);
    }

    const scoreRes = await fetch(`${API_BASE}/score_products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: lastUsedKeywords,
        products: deduped,
        exclude_bulk: true
      })
    });

    if (!scoreRes.ok) throw new Error("Scoring failed");
    const { scored_products } = await scoreRes.json();
    if (!scored_products || scored_products.length === 0) {
      resultsEl.innerHTML = "❌ No valid products after scoring.";
      return;
    }

    currentItems = scored_products;
    renderTopProducts(currentItems);

  } catch (err) {
    resultsEl.innerHTML = "❌ " + err.message;
  } finally {
    searchBtn.disabled = false;
  }
}

// Search button
searchBtn.addEventListener("click", async () => {
  const query = queryInput.value.trim();
  if (!query || !SERPAPI_KEY) {
    resultsEl.innerHTML = "❌ Please enter search text and ensure SerpAPI key is loaded.";
    return;
  }
  resultsEl.innerHTML = "🧠 Extracting keywords...";
  searchContext = { query, keywords: [], brand: null, priceMin: null, priceMax: null, color: null };
  questionQueue = [];
  qaList.innerHTML = "";

  try {
    const kwRes = await fetch(`${API_BASE}/extract_keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    if (!kwRes.ok) throw new Error("Keyword extraction failed");
    const { keywords } = await kwRes.json();
    searchContext.keywords = filterKeywords(keywords);
    lastUsedKeywords = searchContext.keywords;

    if (!keywords || keywords.length === 0) {
      resultsEl.innerHTML = "❌ No keywords extracted.";
      return;
    }

    const qRes = await fetch(`${API_BASE}/generate_questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    if (!qRes.ok) throw new Error("Question generation failed");
    const { questions } = await qRes.json();
    questionQueue = (questions || []).map(q => ({ type: "ai", text: q }));

    if (questionQueue.length > 0) askNextQuestion();
    else runSearchWithContext();

  } catch (err) {
    resultsEl.innerHTML = "❌ " + err.message;
  }
});

// Compare (LLM)
compareBtn.addEventListener("click", async () => {
  if (selectedItems.length < 2) {
    alert("Please select at least 2 products for comparison.");
    return;
  }
  const indices = currentItems
    .map((item, idx) => (selectedItems.includes(item.id) ? idx : -1))
    .filter(i => i >= 0);

  recommendationDiv.innerText = "🧠 Generating comparison...";
  try {
    const res = await fetch(`${API_BASE}/compare_with_llm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: lastUsedKeywords, products: indices.map(i => currentItems[i]) })
    });
    if (!res.ok) throw new Error("Compare API failed");
    const data = await res.json();

    compareCont.style.display = "block";
    let tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Features</th>
          </tr>
        </thead>
        <tbody>
    `;
    (data.comparison_table || []).forEach(row => {
      tableHtml += `
        <tr>
          <td>${row.title || "-"}</td>
          <td>${row.brand || "-"}</td>
          <td>${row.price || "-"}</td>
          <td>${row.rating || "-"}</td>
          <td>${row.features || "-"}</td>
        </tr>
      `;
    });
    tableHtml += `</tbody></table>`;
    compareCont.innerHTML = `<h3>Comparison Results</h3>${tableHtml}`;

    recommendationDiv.innerText = `💡 Recommended: ${data.recommendation || "No recommendation"}`;
  } catch (err) {
    recommendationDiv.innerText = "❌ " + err.message;
  }
});
