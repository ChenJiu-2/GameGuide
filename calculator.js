document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("calculator");
  const resultBox = document.getElementById("result");

  let eventList = [];

  // 加载 event_index.json
  try {
    const res = await fetch("data/event_index.json");
    const json = await res.json();
    eventList = json.event;
  } catch (err) {
    console.error("无法读取 event_index.json", err);
    container.innerHTML = "<p style='color:red;'>❌ 无法加载活动索引</p>";
    return;
  }

  // 动态生成输入框
  eventList.forEach(ev => {
    const div = document.createElement("div");
    div.className = "stage-box";
    div.innerHTML = `
      <h3>${ev.name}</h3>
      <label>${ev.type.split("→")[0]}：
        <input type="number" id="${ev.id}" placeholder="${ev.type.split("→")[0]}">
      </label>
    `;
    container.appendChild(div);
  });

  // 添加计算按钮
  const btn = document.createElement("button");
  btn.id = "calc-btn";
  btn.textContent = "计算总龙气";
  btn.style.marginTop = "1em";
  container.appendChild(btn);

  // 点击计算
  btn.addEventListener("click", async () => {
    let totalLongQi = 0;

    for (const ev of eventList) {
      const val = parseFloat(document.getElementById(ev.id)?.value) || 0;
      if (val === 0) continue;

      try {
        const res = await fetch(ev.file);
        const data = await res.json();

        // 找出对应档位
        let matched = data.find(d => val <= parseFloat(d["祝纹残简"])) || data[data.length - 1];
        totalLongQi += parseFloat(matched["龙气"]) || 0;
      } catch (e) {
        console.error(`读取 ${ev.name} (${ev.file}) 失败：`, e);
      }
    }

    resultBox.textContent = `✨ 总龙气：${totalLongQi.toLocaleString()}`;
  });
});
