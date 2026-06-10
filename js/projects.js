/* ============================================================
   PropTech — project catalogue: data, render, filters
   ============================================================ */
(function () {
  "use strict";

  const IMG = "https://images.unsplash.com/";
  // Build a responsive Unsplash URL for a given crop size
  function src(id, w, h) {
    return `${IMG}${id}?auto=format&fit=crop&q=75&w=${w}&h=${h}`;
  }

  /* --- Catalogue --- */
  const PROJECTS = [
    { name: "Sky Gardens", img: "photo-1486325212027-8081e485255e", cls: ["Бизнес"], district: "Мирзо-Улугбекский", addr: "г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура", price: 920.0, floors: "от 2 до 16 этажей", due: "4 кв. 2027", rooms: [1, 2, 3] },
    { name: "Riviera Plaza", img: "photo-1494526585095-c41746248156", cls: ["Комфорт"], district: "Новый Ташкент", addr: "г. Ташкент, Новый Ташкент, ул. Янги Шахар", price: 475.0, floors: "от 2 до 8 этажей", due: "1 кв. 2028", rooms: [1, 2, 3] },
    { name: "Golden Gate", img: "photo-1565402170291-8491f14678db", cls: ["Бизнес"], district: "Мирзо-Улугбекский", addr: "г. Ташкент, Мирзо-Улугбекский район, ул. Заркайнар", price: 730.0, floors: "от 1 до 15 этажей", due: "4 кв. 2026", rooms: [2, 3, 4] },
    { name: "Silk Road Tower", img: "photo-1512453979798-5ea266f8880c", cls: ["Бизнес+"], district: "Мирзо-Улугбекский", addr: "г. Ташкент, Мирзо-Улугбекский район, ул. Истиклол", price: 2150.0, floors: "от 2 до 13 этажей", due: "2 кв. 2026", rooms: [3, 4] },
    { name: "Oasis Park", img: "photo-1545324418-cc1a3fa10c00", cls: ["Бизнес"], district: "Мирзо-Улугбекский", addr: "г. Ташкент, Мирзо-Улугбекский район, ул. Беруний", price: 850.0, floors: "от 4 до 12 этажей", due: "3 кв. 2027", rooms: [1, 2, 3] },
    { name: "Emerald Hills", img: "photo-1577495508048-b635879837f1", cls: ["Бизнес", "Комфорт+"], district: "Яшнабадский", addr: "г. Ташкент, Яшнабадский район, просп. Буюк Турон", price: 615.0, floors: "от 2 до 10 этажей", due: "2 кв. 2028", rooms: [1, 2, 3, 4] },
    { name: "Blue Bay", img: "photo-1448630360428-65456885c650", cls: ["Бизнес", "Комфорт+"], district: "Яшнабадский", addr: "г. Ташкент, Яшнабадский район, ул. Олмазор", price: 710.0, floors: "от 3 до 14 этажей", due: "1 кв. 2028", rooms: [2, 3] },
    { name: "Metro Life", img: "photo-1600585154340-be6161a56a0c", cls: ["Комфорт"], district: "Новый Ташкент", addr: "г. Ташкент, Новый Ташкент, ул. Сергели", price: 490.0, floors: "от 1 до 9 этажей", due: "4 кв. 2027", rooms: [1, 2, 3] },
    { name: "Tashkent Prime", img: "photo-1512917774080-9991f1c4c750", cls: ["Комфорт"], district: "Яшнабадский", addr: "г. Ташкент, Яшнабадский район, ул. Катартол", price: 485.0, floors: "от 1 до 9 этажей", due: "1 кв. 2028", rooms: [1, 2, 3] },
    { name: "Grand Palace", img: "photo-1580587771525-78b9dba3b914", cls: ["Бизнес+"], district: "Мирзо-Улугбекский", addr: "г. Ташкент, Мирзо-Улугбекский район, ул. Навбахор", price: 1550.0, floors: "от 1 до 5 этажей", due: "3 кв. 2027", rooms: [3, 4], dark: true },
    { name: "Horizon City", img: "photo-1449824913935-59a10b8d2000", cls: ["Бизнес"], district: "Яшнабадский", addr: "г. Ташкент, Яшнабадский район, ул. Чилонзор", price: 455.0, floors: "от 1 до 16 этажей", due: "3 кв. 2027", rooms: [1, 2, 3] },
    { name: "Sunset Quarter", img: "photo-1600596542815-ffad4c1539a9", cls: ["Комфорт"], district: "Яшнабадский", addr: "г. Ташкент, Яшнабадский район, ул. Куйлюк", price: 445.0, floors: "от 1 до 12 этажей", due: "4 кв. 2027", rooms: [1, 2, 3] },
  ];

  const fmt = (n) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function cardHTML(p) {
    const tags = p.cls.map((c) => `<span class="badge">${c}</span>`).join("");
    return `<article class="p-card${p.dark ? " p-card--dark" : ""}" data-name="${p.name.toLowerCase()}">
      <div class="p-card__media">
        <img src="${src(p.img, 600, 375)}" srcset="${src(p.img, 600, 375)} 1x, ${src(p.img, 1000, 625)} 2x"
             alt="ЖК ${p.name}" width="600" height="375" loading="lazy" decoding="async" />
        <div class="p-card__tags">${tags}</div>
      </div>
      <div class="p-card__body">
        <h3 class="p-card__name">${p.name}</h3>
        <p class="p-card__addr">${p.addr}</p>
        <div class="p-card__meta">
          <span class="p-card__price">от ${fmt(p.price)} млн UZS</span>
          <span class="p-card__specs"><span>${p.floors}</span><span>${p.due}</span></span>
        </div>
        <div class="p-card__actions">
          <button class="btn btn--card"
            data-modal="project"
            data-proj-name="${p.name}"
            data-proj-img="${p.img}"
            data-proj-cls="${p.cls.join(',')}"
            data-proj-addr="${p.addr}"
            data-proj-price="${p.price}"
            data-proj-floors="${p.floors}"
            data-proj-due="${p.due}"
            data-proj-rooms="${p.rooms.join(',')}">Подробнее</button>
          <button class="btn btn--card"
            data-modal="floors"
            data-proj-name="${p.name}"
            data-proj-rooms="${p.rooms.join(',')}"
            data-proj-price="${p.price}"
            data-proj-img="${p.img}">Планировки</button>
        </div>
      </div>
    </article>`;
  }

  const grid = document.getElementById("projectGrid");
  const countEl = document.getElementById("projectCount");

  function getFilters() {
    return {
      district: document.getElementById("fLocation").value,
      rooms: document.getElementById("fRooms").value,
      min: parseFloat(document.getElementById("fPriceMin").value) || 0,
      max: parseFloat(document.getElementById("fPriceMax").value) || Infinity,
      q: (document.getElementById("searchInput").value || "").trim().toLowerCase(),
    };
  }

  function render() {
    const f = getFilters();
    const matched = PROJECTS.filter((p) => {
      if (f.district && p.district !== f.district) return false;
      if (f.rooms && !p.rooms.includes(parseInt(f.rooms, 10))) return false;
      if (p.price < f.min || p.price > f.max) return false;
      if (f.q && !(`${p.name} ${p.addr}`.toLowerCase().includes(f.q))) return false;
      return true;
    });

    if (matched.length === 0) {
      grid.innerHTML = `<div class="projects__empty">По выбранным фильтрам проекты не найдены.<br>Попробуйте изменить параметры поиска.</div>`;
    } else {
      grid.innerHTML = matched.map(cardHTML).join("");
    }
    countEl.textContent = `Показано ${matched.length} из ${PROJECTS.length}`;
  }

  ["fLocation", "fType", "fRooms", "fPriceMin", "fPriceMax"].forEach((id) => {
    document.getElementById(id).addEventListener("input", render);
  });
  document.getElementById("searchInput").addEventListener("input", render);
  document.getElementById("clearFilters").addEventListener("click", () => {
    setTimeout(() => {
      document.getElementById("fPriceMin").value = "441";
      document.getElementById("fPriceMax").value = "7460";
      document.getElementById("searchInput").value = "";
      render();
    }, 0);
  });
  document.getElementById("filterBar").addEventListener("submit", (e) => e.preventDefault());

  render();
})();
