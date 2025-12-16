// 簡易フロントエンド: REST_2025_NEW の back の仕様に合わせたSPA

/** 型定義（JSDoc） */
/** @typedef {{ id:number; name:string; attribute:string; image:string; modelNumber:string; moveName:string; moveDescription:string }} Card */
/** @typedef {{ id:number; cardId:number; serialNumber:string; status:"Good"|"Normal"|"Bad"; salesStatus:"Out of Stock"|"Available"; price:number }} CardInstance */

const appEl = document.getElementById("app");
let currentView = "list"; // "list" | "detail" | "crud"
/** @type {Card|null} */
let selectedCard = null;

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

async function getJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function render() {
  if (currentView === "list") return renderList();
  if (currentView === "detail") return renderDetail();
  if (currentView === "crud") return renderCrud();
}

document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => {
    const v = btn.dataset.view;
    currentView = v;
    if (v !== "detail") selectedCard = null;
    render().catch(console.error);
  });
});

// ==== List ====
async function renderList() {
  /** @type {Card[]} */
  const cards = await getJson("/api/cards");

  appEl.innerHTML = `
    <div class="card">
      <strong>カード一覧</strong>
    </div>
    <div id="list" class="grid2"></div>
  `;

  const listEl = document.getElementById("list");
  listEl.innerHTML = cards.map(c => `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div>
          <div class="small">${esc(c.modelNumber)}</div>
          <strong>${esc(c.name)}</strong>
        </div>
        <button class="btn" data-id="${c.id}">見る</button>
      </div>
      ${c.image ? `<img src="${esc(c.image)}" style="width:100%;border-radius:8px;">` : ""}
    </div>
  `).join("");

  listEl.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      selectedCard = cards.find(c => c.id === id) || null;
      currentView = "detail";
      render().catch(console.error);
    });
  });
}

// ==== Detail ====
async function renderDetail() {
  if (!selectedCard) {
    appEl.innerHTML = `<div class="card">先に一覧からカードを選択してください。</div>`;
    return;
  }

  /** @type {CardInstance[]} */
  const instances = await getJson(`/api/cards/${selectedCard.id}/instances`);

  appEl.innerHTML = `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div>
          <div class="small">${esc(selectedCard.modelNumber)}</div>
          <h2 style="margin:6px 0 0 0;">${esc(selectedCard.name)}</h2>
          <div class="small">属性: ${esc(selectedCard.attribute)}</div>
        </div>
        <button class="btn" id="back">一覧へ</button>
      </div>
      ${selectedCard.image ? `<img src="${esc(selectedCard.image)}" style="width:100%;max-height:420px;object-fit:cover;border-radius:10px;">` : ""}
      <div class="card" style="margin-top:10px;">
        <div class="small">技</div>
        <strong>${esc(selectedCard.moveName)}</strong>
        <div class="small">${esc(selectedCard.moveDescription)}</div>
      </div>
    </div>

    <div class="card">
      <strong>状態一覧 </strong>
      <table class="table">
        <thead><tr><th>Serial</th><th>Status</th><th>Sales</th><th>Price</th><th></th></tr></thead>
        <tbody id="tbody"></tbody>
      </table>

      <div class="card" style="margin-top:12px;">
        <div class="small">追加 </div>
        <div class="row" style="flex-wrap:wrap; gap:8px;">
          <input id="newSerial" style="max-width:220px;" placeholder="任意のシリアル" />
          <select id="newStatus">
            <option value="Good">Good</option>
            <option value="Normal" selected>Normal</option>
            <option value="Bad">Bad</option>
          </select>
          <select id="newSales">
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <input id="newPrice" type="number" min="0" style="max-width:120px;" placeholder="1500" />
          <button class="btn" id="btnAddInstance">追加</button>
        </div>
        <div class="small" id="msgInst"></div>
      </div>
    </div>
  `;

  document.getElementById("back").addEventListener("click", () => {
    currentView = "list";
    selectedCard = null;
    render().catch(console.error);
  });

  const tbody = document.getElementById("tbody");
  tbody.innerHTML = instances.map(inst => `
    <tr data-id="${inst.id}">
      <td>${esc(inst.serialNumber)}</td>
      <td>
        <select class="st">
          <option value="Good" ${inst.status === "Good" ? "selected" : ""}>Good</option>
          <option value="Normal" ${inst.status === "Normal" ? "selected" : ""}>Normal</option>
          <option value="Bad" ${inst.status === "Bad" ? "selected" : ""}>Bad</option>
        </select>
      </td>
      <td>
        <select class="sales">
          <option value="Available" ${inst.salesStatus === "Available" ? "selected" : ""}>Available</option>
          <option value="Out of Stock" ${inst.salesStatus === "Out of Stock" ? "selected" : ""}>Out of Stock</option>
        </select>
      </td>
      <td><input class="price" type="number" min="0" value="${inst.price}"></td>
      <td>
        <button class="btn" data-save="${inst.id}">保存</button>
        <button class="btn danger" data-del="${inst.id}">削除</button>
      </td>
    </tr>
  `).join("");

  // 既存個体の保存 / 削除
  tbody.querySelectorAll("button[data-save]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.save);
      const tr = btn.closest("tr");
      const status = tr.querySelector(".st").value;
      const salesStatus = tr.querySelector(".sales").value;
      const price = Number(tr.querySelector(".price").value || 0);
      await getJson(`/api/instances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, salesStatus, price }),
      });
      render().catch(console.error);
    });
  });

  tbody.querySelectorAll("button[data-del]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.del);
      if (!confirm(`instance ${id} を削除しますか？`)) return;
      await getJson(`/api/instances/${id}`, { method: "DELETE" });
      render().catch(console.error);
    });
  });

  // 新規個体追加
  const msgInst = document.getElementById("msgInst");
  document.getElementById("btnAddInstance").addEventListener("click", async () => {
    msgInst.textContent = "";
    const serialNumber = document.getElementById("newSerial").value.trim();
    const status = document.getElementById("newStatus").value;
    const salesStatus = document.getElementById("newSales").value;
    const price = Number(document.getElementById("newPrice").value || 0);
    if (!serialNumber) {
      msgInst.textContent = "serialNumber は必須";
      return;
    }
    try {
      await getJson(`/api/cards/${selectedCard.id}/instances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serialNumber, status, salesStatus, price }),
      });
      msgInst.textContent = "追加しました";
      render().catch(console.error);
    } catch (e) {
      msgInst.textContent = e.message || e;
    }
  });
}

// ==== CRUD (カード) ====
async function renderCrud() {
  /** @type {Card[]} */
  const cards = await getJson("/api/cards");

  appEl.innerHTML = `
    <div class="grid2">
      <div class="card">
        <strong>カード一覧</strong>
        <div id="cardList"></div>
      </div>
      <div class="card">
        <strong>カード追加 / 更新</strong>
        <form id="cardForm">
          <input type="hidden" id="cardId" />
          <label class="small">name</label>
          <input id="name" type="text" required />
          <label class="small">attribute</label>
          <input id="attribute" type="text" required />
          <label class="small">image (URL)</label>
          <input id="image" type="text" />
          <label class="small">modelNumber</label>
          <input id="modelNumber" type="text" required />
          <label class="small">moveName</label>
          <input id="moveName" type="text" required />
          <label class="small">moveDescription</label>
          <textarea id="moveDescription"></textarea>
          <label class="small">初期個体数 (create 時のみ, デフォルト100)</label>
          <input id="count" type="number" min="0" placeholder="100" />
          <div class="row" style="margin-top:10px;">
            <button class="btn" type="submit">保存</button>
            <button class="btn" type="button" id="clear">クリア</button>
            <div id="msg" class="small"></div>
          </div>
        </form>
      </div>
    </div>
  `;

  const list = document.getElementById("cardList");
  const form = document.getElementById("cardForm");
  const msg = document.getElementById("msg");

  const el = {
    id: document.getElementById("cardId"),
    name: document.getElementById("name"),
    attribute: document.getElementById("attribute"),
    image: document.getElementById("image"),
    modelNumber: document.getElementById("modelNumber"),
    moveName: document.getElementById("moveName"),
    moveDescription: document.getElementById("moveDescription"),
    count: document.getElementById("count"),
  };

  function renderCardList(items) {
    list.innerHTML = items.map(c => `
      <div class="card">
        <div class="row" style="justify-content:space-between;">
          <div>
            <div class="small">ID: ${c.id} / ${esc(c.modelNumber)}</div>
            <strong>${esc(c.name)}</strong>
            <div class="small">属性: ${esc(c.attribute)}</div>
          </div>
          <div class="row">
            <button class="btn" data-edit="${c.id}">編集</button>
            <button class="btn danger" data-del="${c.id}">削除</button>
            <button class="btn" data-view="${c.id}">表示</button>
          </div>
        </div>
      </div>
    `).join("");

    list.querySelectorAll("button[data-edit]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.edit);
        const c = items.find(x => x.id === id);
        if (!c) return;
        el.id.value = String(c.id);
        el.name.value = c.name;
        el.attribute.value = c.attribute;
        el.image.value = c.image;
        el.modelNumber.value = c.modelNumber;
        el.moveName.value = c.moveName;
        el.moveDescription.value = c.moveDescription;
        msg.textContent = `編集モード: ID ${c.id}`;
      });
    });

    list.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.del);
        if (!confirm(`カード ID ${id} を削除しますか？`)) return;
        await getJson(`/api/cards/${id}`, { method: "DELETE" });
        render().catch(console.error);
      });
    });

    list.querySelectorAll("button[data-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.view);
        selectedCard = items.find(c => c.id === id) || null;
        currentView = "detail";
        render().catch(console.error);
      });
    });
  }

  renderCardList(cards);

  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    msg.textContent = "";

    const id = el.id.value ? Number(el.id.value) : null;
    const body = {
      name: el.name.value.trim(),
      attribute: el.attribute.value.trim(),
      image: el.image.value.trim(),
      modelNumber: el.modelNumber.value.trim(),
      moveName: el.moveName.value.trim(),
      moveDescription: el.moveDescription.value.trim(),
    };

    if (!body.name || !body.attribute || !body.modelNumber || !body.moveName) {
      msg.textContent = "必須項目が足りません";
      return;
    }

    try {
      if (id == null) {
        const countVal = el.count.value ? Number(el.count.value) : 100;
        await getJson(`/api/cards?count=${countVal}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await getJson(`/api/cards/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      render().catch(console.error);
    } catch (e) {
      msg.textContent = e.message || e;
    }
  });

  document.getElementById("clear").addEventListener("click", () => {
    el.id.value = "";
    el.name.value = "";
    el.attribute.value = "";
    el.image.value = "";
    el.modelNumber.value = "";
    el.moveName.value = "";
    el.moveDescription.value = "";
    el.count.value = "";
    msg.textContent = "クリアしました";
  });
}

// 初期表示
render().catch(console.error);
