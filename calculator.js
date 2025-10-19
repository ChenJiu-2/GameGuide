// calculator.js
async function loadEventIndex() {
  const res = await fetch("../data/event_index.json");
  const data = await res.json();
  return data.event;
}

async function calculateTotal() {
  const events = await loadEventIndex();
  let totalLongQi = 0;
  let results = [];

  for (const ev of events) {
    const inputEl = document.getElementById(ev.id);
    if (!inputEl) continue; // 你的 HTML 没这个活动就跳过

    const value = Number(inputEl.value);
    if (isNaN(value) || value <= 0) continue;

    try {
      const res = await fetch(ev.file);
      const data = await res.json();

      // 从 "荐函→龙气" 中取出前半段作为字段名
      const inputKey = ev.type.split("→")[0].trim();

      // 找到 ≤ 输入值 的最大档位
      let matched = data[0];
      for (const d of data) {
        const threshold = Number(d[inputKey]);
        if (!isNaN(threshold) && threshold <= value) {
          matched = d;
        } else {
          break;
        }
      }

      const longqi = Number(matched["总龙气"]) || 0;
      totalLongQi += longqi;
      results.push(`${ev.name}: ${longqi}`);

    } catch (err) {
      console.warn(`无法读取 ${ev.name} (${ev.file})`, err);
    }
  }

  // 显示结果
  document.getElementById("result").innerHTML = `
    ${results.join("<br>")}
    <hr>
    <strong>总龙气：${totalLongQi}</strong>
  `;
}

// 按钮绑定事件
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("calc-btn");
  if (btn) btn.addEventListener("click", calculateTotal);
});
