const article = document.querySelector("article");

// 数网站的字数，在网站标题下面显示大概的阅读时间
// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `预计大约 ⏱️ ${readingTime} min read， 来自wnb插件`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  // 通过短路运算符 ??，
  // 如果 date 存在，则在 date 元素之后插入 badge（显示阅读时间的 <p> 标签）；
  // 如果 date 不存在，则在 heading 元素之后插入 badge。
  (date ?? heading).insertAdjacentElement("afterend", badge);  
}