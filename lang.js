// 引入 OpenCC
// 如果你 index.html 已经引入了 CDN，可以删除这行
// 否则就要在每个页面的 <head> 里加：
// <script src="https://cdn.jsdelivr.net/npm/opencc-js/dist/umd/full.min.js"></script>

const converterS2T = OpenCC.Converter({ from: 'cn', to: 'tw' });
const converterT2S = OpenCC.Converter({ from: 'tw', to: 'cn' });

function convertText(converter) {
  document.querySelectorAll('.translatable').forEach(el => {
    el.innerHTML = converter(el.innerHTML);
  });
}

function toSimplified() {
  localStorage.setItem("lang", "cn"); // 记住选择
  convertText(converterT2S);
}

function toTraditional() {
  localStorage.setItem("lang", "tw");
  convertText(converterS2T);
}

// 页面加载时检查用户的选择
window.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang");
  if (lang === "tw") {
    convertText(converterS2T);
  } else if (lang === "cn") {
    convertText(converterT2S);
  }
});
