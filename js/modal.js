/* ============================================================
   PropTech — Modal + Page Panel system
   ============================================================ */
(function () {
  'use strict';

  /* ─────────────────────────────────────
     SMALL MODAL (centered overlay)
  ───────────────────────────────────── */
  var mOverlay = document.getElementById('modalOverlay');
  var mBox     = document.getElementById('modal');
  var mBody    = document.getElementById('modalBody');
  var mClose   = document.getElementById('modalClose');

  function openModal(html, size) {
    mBody.innerHTML = html;
    mBox.dataset.size = size || 'md';
    mOverlay.hidden = false;
    requestAnimationFrame(function () { mOverlay.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    wireBtn('modalCallbackBtn', scrollCallback);
  }

  function closeModal() {
    mOverlay.classList.remove('is-open');
    setTimeout(function () {
      mOverlay.hidden = true;
      mBody.innerHTML = '';
      document.body.style.overflow = '';
    }, 260);
  }

  mClose.addEventListener('click', closeModal);
  mOverlay.addEventListener('click', function (e) {
    if (e.target === mOverlay) closeModal();
  });

  /* ─────────────────────────────────────
     PAGE PANEL (full-screen slide-in)
  ───────────────────────────────────── */
  var ppBg    = document.getElementById('ppBg');
  var panel   = document.getElementById('pagePanel');
  var pBody   = document.getElementById('panelBody');
  var pClose  = document.getElementById('panelClose');
  var panelStack = [];  // navigation history for the Back button

  function setPanel(html) {
    pBody.innerHTML = '<div class="pp-sheet">' + html + '</div>';
    pBody.scrollTop = 0;
  }

  function openPanel(html) {
    panelStack = [];
    setPanel(html);
    panel.hidden = false;
    requestAnimationFrame(function () {
      panel.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    wirePanelButtons();
    updateBackLabel();
  }

  /* Open a panel page; if a panel is already open, remember the current
     page so the Back button returns to it instead of closing everything. */
  function showPanelPage(html) {
    if (!panel.hidden) {
      panelStack.push(pBody.innerHTML);
      setPanel(html);
      wirePanelButtons();
      updateBackLabel();
    } else {
      openPanel(html);
    }
  }

  /* Back button: step one page back, or close if at the first page. */
  function goBack() {
    if (panelStack.length) {
      pBody.innerHTML = panelStack.pop();
      pBody.scrollTop = 0;
      wirePanelButtons();
      updateBackLabel();
    } else {
      closePanel();
    }
  }

  function updateBackLabel() {
    // tiny affordance: keep label "Назад" always, but expose depth via title
    pClose.setAttribute('title', panelStack.length ? 'Вернуться назад' : 'Закрыть');
  }

  function closePanel() {
    panelStack = [];
    panel.classList.remove('is-open');
    setTimeout(function () {
      panel.hidden = true;
      pBody.innerHTML = '';
      document.body.style.overflow = '';
    }, 300);
  }

  pClose.addEventListener('click', goBack);

  /* ─────────────────────────────────────
     Shared utils
  ───────────────────────────────────── */
  function wireBtn(id, fn) {
    requestAnimationFrame(function () {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', fn);
    });
  }

  function scrollCallback() {
    closeModal();
    closePanel();
    setTimeout(function () {
      var el = document.getElementById('callback');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 320);
  }

  var IMG = 'https://images.unsplash.com/';
  function imgSrc(id, w, h) {
    return IMG + id + '?auto=format&fit=crop&q=75&w=' + w + '&h=' + h;
  }
  function fmt(n) {
    return (+n).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  /* Floor plan SVG */
  function floorSVG(r) {
    r = parseInt(r, 10) || 1;
    var s = '';
    s += '<rect x="20" y="20" width="72" height="76" rx="3" fill="#dde5ff" stroke="#a0afd6" stroke-width="1.5"/>';
    s += '<text x="56" y="63" text-anchor="middle" fill="#5a6a99" font-size="9" font-family="Inter,sans-serif">Гостиная</text>';
    s += '<rect x="102" y="20" width="78" height="44" rx="3" fill="#e8f0fe" stroke="#a0afd6" stroke-width="1.5"/>';
    s += '<text x="141" y="46" text-anchor="middle" fill="#5a6a99" font-size="9" font-family="Inter,sans-serif">Кухня</text>';
    s += '<rect x="102" y="73" width="78" height="48" rx="3" fill="#dde5ff" stroke="#a0afd6" stroke-width="1.5"/>';
    s += '<text x="141" y="101" text-anchor="middle" fill="#5a6a99" font-size="9" font-family="Inter,sans-serif">Спальня</text>';
    if (r >= 2) {
      s += '<rect x="20" y="106" width="72" height="62" rx="3" fill="#dde5ff" stroke="#a0afd6" stroke-width="1.5"/>';
      s += '<text x="56" y="141" text-anchor="middle" fill="#5a6a99" font-size="9" font-family="Inter,sans-serif">Спальня 2</text>';
    }
    if (r >= 3) {
      s += '<rect x="102" y="130" width="78" height="38" rx="3" fill="#dde5ff" stroke="#a0afd6" stroke-width="1.5"/>';
      s += '<text x="141" y="153" text-anchor="middle" fill="#5a6a99" font-size="9" font-family="Inter,sans-serif">Спальня 3</text>';
    }
    s += '<rect x="22" y="142" width="28" height="22" rx="2" fill="#f8faff" stroke="#a0afd6" stroke-width="1"/>';
    s += '<text x="36" y="156" text-anchor="middle" fill="#5a6a99" font-size="7" font-family="Inter,sans-serif">Санузел</text>';
    return '<svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="10" y="10" width="180" height="160" rx="4" fill="#f4f7ff" stroke="#c5d0e8" stroke-width="2"/>' +
      s + '</svg>';
  }

  /* ─────────────────────────────────────
     PAGE PANEL TEMPLATES
  ───────────────────────────────────── */

  /* ── Project detail page ── */
  function tplProjectPage(d) {
    var name   = d.projName   || '';
    var img    = d.projImg    || 'photo-1449824913935-59a10b8d2000';
    var cls    = d.projCls    || '';
    var addr   = d.projAddr   || '';
    var price  = d.projPrice  || '0';
    var floors = d.projFloors || '';
    var due    = d.projDue    || '';
    var rooms  = d.projRooms  || '1';

    var tags = cls.split(',').map(function (c) {
      return '<span class="badge">' + c.trim() + '</span>';
    }).join('');

    var roomsArr = rooms.split(',').map(function (r) { return r.trim(); });
    var areas    = { 1: 42.5, 2: 68.3, 3: 95.1, 4: 128.4 };
    var baseP    = parseFloat(price);

    var floorsHtml = roomsArr.map(function (r) {
      var ri   = parseInt(r, 10) || 1;
      var area = areas[ri] || 42.5;
      var p    = fmt(baseP * area / 50);
      return '<div class="m-floor-card">' +
        '<div class="m-floor-card__plan">' + floorSVG(r) + '</div>' +
        '<div class="m-floor-card__info">' +
          '<div class="m-floor-card__type">' + r + '-комнатная</div>' +
          '<div class="m-floor-card__area">' + area + ' м²</div>' +
          '<div class="m-floor-card__price">от ' + p + ' млн</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Short description based on class
    var desc = 'Жилой комплекс «' + name + '» расположен в одном из лучших районов Ташкента. ' +
      'Каждая квартира спроектирована с учётом современных стандартов комфорта: панорамные окна, высокие потолки, продуманные планировки. ' +
      'Развитая инфраструктура включает подземный паркинг, детскую площадку, озеленённые дворы и охрану 24/7.';

    return '<div class="pp-hero">' +
        '<img src="' + imgSrc(img, 1200, 500) + '" alt="' + name + '" width="1200" height="500" />' +
        '<div class="pp-hero__overlay"></div>' +
        '<div class="pp-hero__tags">' + tags + '</div>' +
      '</div>' +
      '<div class="pp-content">' +
        '<h1 class="pp-title">' + name + '</h1>' +
        '<p class="pp-addr"><span class="ic ic--location"></span>' + addr + '</p>' +
        '<div class="pp-specs">' +
          '<div class="pp-spec"><span class="pp-spec__label">Цена от</span><span class="pp-spec__val">' + fmt(price) + ' млн UZS</span></div>' +
          '<div class="pp-spec"><span class="pp-spec__label">Этажность</span><span class="pp-spec__val">' + floors + '</span></div>' +
          '<div class="pp-spec"><span class="pp-spec__label">Сдача</span><span class="pp-spec__val">' + due + '</span></div>' +
        '</div>' +
        '<div class="pp-actions">' +
          '<button class="btn btn--primary btn--lg" id="panelCallbackBtn">Заказать звонок</button>' +
          '<button class="btn btn--ghost btn--lg" data-modal="mortgage">Ипотека</button>' +
          '<button class="btn btn--ghost btn--lg" data-modal="promo-panel">Рассрочка</button>' +
        '</div>' +
      '</div>' +
      '<div class="pp-section">' +
        '<h2 class="pp-section-title">Планировки</h2>' +
        '<div class="pp-floors-grid">' + floorsHtml + '</div>' +
      '</div>' +
      '<div class="pp-section">' +
        '<h2 class="pp-section-title">О проекте</h2>' +
        '<div class="pp-desc">' + desc + '</div>' +
      '</div>' +
      '<div class="pp-cta">' +
        '<button class="btn btn--primary btn--lg btn--block" id="panelCallbackBtn2">Записаться на консультацию</button>' +
      '</div>';
  }

  /* ── Акции page ── */
  function tplPromoPage() {
    return '<div class="pp-page-hero">' +
        '<h1 class="pp-page-title">Акции и спецпредложения</h1>' +
        '<p class="pp-page-sub">Актуальные предложения PropTech</p>' +
      '</div>' +
      '<div class="pp-promos">' +
      '<div class="pp-promo-card pp-promo-card--featured">' +
        '<div class="pp-promo-badge">Горячее предложение</div>' +
        '<h2 class="pp-promo-title">Выгодная рассрочка на квартиры</h2>' +
        '<div class="pp-promo-terms">' +
          '<div class="pp-promo-term"><span class="pp-promo-term-val">20%</span><span class="pp-promo-term-label">Первоначальный взнос</span></div>' +
          '<div class="pp-promo-term"><span class="pp-promo-term-val">5%</span><span class="pp-promo-term-label">3 месяца</span></div>' +
          '<div class="pp-promo-term"><span class="pp-promo-term-val">0%</span><span class="pp-promo-term-label">24 месяца</span></div>' +
        '</div>' +
        '<p class="pp-promo-note">Акция действует до конца квартала. Остаток суммы — в ипотеку или рассрочку от банка-партнёра.</p>' +
        '<button class="btn btn--primary" id="panelCallbackBtn">Оставить заявку</button>' +
      '</div>' +

      '<div class="pp-promo-card">' +
        '<div class="pp-promo-badge">Старт продаж</div>' +
        '<h2 class="pp-promo-title">ЖК «Emerald Hills» — 1-я очередь</h2>' +
        '<div class="pp-promo-terms">' +
          '<div class="pp-promo-term"><span class="pp-promo-term-val">−15%</span><span class="pp-promo-term-label">Стартовая цена</span></div>' +
          '<div class="pp-promo-term"><span class="pp-promo-term-val">2028</span><span class="pp-promo-term-label">Год сдачи</span></div>' +
        '</div>' +
        '<p class="pp-promo-note">Квартиры с видом на парк. Ограниченное количество лотов по стартовым ценам.</p>' +
        '<button class="btn btn--ghost" id="panelCallbackBtn3">Узнать подробнее</button>' +
      '</div>' +

      '<div class="pp-promo-card">' +
        '<div class="pp-promo-badge">Офисы</div>' +
        '<h2 class="pp-promo-title">Бизнес-пространства в деловом центре</h2>' +
        '<div class="pp-promo-terms">' +
          '<div class="pp-promo-term"><span class="pp-promo-term-val">15%</span><span class="pp-promo-term-label">Первоначальный взнос</span></div>' +
          '<div class="pp-promo-term"><span class="pp-promo-term-val">48 мес</span><span class="pp-promo-term-label">Рассрочка</span></div>' +
        '</div>' +
        '<p class="pp-promo-note">Свободная планировка под бизнес. Подходит для офиса, шоурума или коммерции.</p>' +
        '<button class="btn btn--ghost" id="panelCallbackBtn4">Узнать условия</button>' +
      '</div>' +
    '</div>';
  }

  /* ── Ипотека page ── */
  function tplMortgagePage() {
    return '<div class="pp-page-hero">' +
        '<h1 class="pp-page-title">Ипотека</h1>' +
        '<p class="pp-page-sub">Оформите ипотеку через банки-партнёры PropTech</p>' +
      '</div>' +
      '<div class="pp-mortgage">' +
      '<div class="pp-banks">' +
        '<div class="pp-bank"><div class="pp-bank__info"><div class="pp-bank__name">Ипотека Банк</div><div class="pp-bank__rate">от 14% годовых</div><div class="pp-bank__term">до 20 лет · взнос от 20%</div></div><img class="pp-bank__logo" src="Bank Icon/svg (22).svg" alt="Ипотека Банк" /></div>' +
        '<div class="pp-bank"><div class="pp-bank__info"><div class="pp-bank__name">Агробанк</div><div class="pp-bank__rate">от 15% годовых</div><div class="pp-bank__term">до 15 лет · взнос от 25%</div></div><img class="pp-bank__logo" src="Bank Icon/svg (9).svg" alt="Агробанк" /></div>' +
        '<div class="pp-bank"><div class="pp-bank__info"><div class="pp-bank__name">Халк Банк</div><div class="pp-bank__rate">от 16% годовых</div><div class="pp-bank__term">до 20 лет · взнос от 20%</div></div><img class="pp-bank__logo" src="Bank Icon/svg (7).svg" alt="Халк Банк" /></div>' +
        '<div class="pp-bank"><div class="pp-bank__info"><div class="pp-bank__name">Узпромстройбанк</div><div class="pp-bank__rate">от 14.5% годовых</div><div class="pp-bank__term">до 25 лет · взнос от 15%</div></div><img class="pp-bank__logo" src="Bank Icon/svg (21).svg" alt="Узпромстройбанк" /></div>' +
      '</div>' +
      '<div class="pp-calc">' +
        '<div class="pp-calc__title">Ипотечный калькулятор</div>' +
        '<div class="pp-calc__row">' +
          '<div class="pp-calc__field"><label class="pp-calc__label">Стоимость, млн</label><input class="pp-calc__input" id="calcPrice" type="number" value="600" min="100" /></div>' +
          '<div class="pp-calc__field"><label class="pp-calc__label">Первый взнос, %</label><input class="pp-calc__input" id="calcDown" type="number" value="20" min="0" max="99" /></div>' +
          '<div class="pp-calc__field"><label class="pp-calc__label">Срок, лет</label><input class="pp-calc__input" id="calcYears" type="number" value="15" min="1" max="25" /></div>' +
        '</div>' +
        '<div class="pp-calc__result">' +
          '<span class="pp-calc__result-label">Ежемесячный платёж:</span>' +
          '<span class="pp-calc__result-val" id="calcResult">—</span>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn--primary btn--lg btn--block" id="panelCallbackBtn">Получить консультацию по ипотеке</button>' +
    '</div>';
  }

  /* ── Партнёрам page ── */
  function tplPartnersPage() {
    return '<div class="pp-page-hero">' +
        '<h1 class="pp-page-title">Партнёрская программа</h1>' +
        '<p class="pp-page-sub">Станьте партнёром PropTech и зарабатывайте на каждой сделке</p>' +
      '</div>' +
      '<div class="pp-partners">' +
      '<div class="pp-partner-perks">' +
        '<div class="pp-perk"><div class="pp-perk__icon"><span class="ic ic--wallet"></span></div><h3>Комиссия до 3%</h3><p>Выплачиваем вознаграждение с каждой успешной сделки от суммы договора.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon"><span class="ic ic--chart"></span></div><h3>Личный кабинет</h3><p>Отслеживайте статус сделок, лиды и выплаты в режиме реального времени.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon"><span class="ic ic--teacher"></span></div><h3>Обучение</h3><p>Регулярные тренинги по продукту, технике продаж и работе с клиентами.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon"><span class="ic ic--users"></span></div><h3>Менеджер-куратор</h3><p>Персональный менеджер поможет на каждом этапе сделки.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon"><span class="ic ic--clipboard"></span></div><h3>Эксклюзивные материалы</h3><p>Презентации, прайсы и медиа-кит — всё для успешных показов.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon"><span class="ic ic--flash"></span></div><h3>Быстрая регистрация</h3><p>Подключение к программе за один рабочий день.</p></div>' +
      '</div>' +
      '<div class="pp-partner-form">' +
        '<h3>Стать партнёром</h3>' +
        '<div class="pp-form-row">' +
          '<div class="pp-field"><label for="pfName">Ваше имя</label><input class="control" id="pfName" type="text" placeholder="Введите имя" /></div>' +
          '<div class="pp-field"><label for="pfPhone">Телефон</label><input class="control" id="pfPhone" type="tel" placeholder="+998 (__) ___-__-__" /></div>' +
        '</div>' +
        '<div class="pp-form-row">' +
          '<div class="pp-field" style="grid-column:1/-1"><label for="pfAgency">Название агентства</label><input class="control" id="pfAgency" type="text" placeholder="Введите название" /></div>' +
        '</div>' +
        '<button class="btn btn--primary btn--lg btn--block" id="panelCallbackBtn" style="margin-top:0.5rem">Отправить заявку</button>' +
      '</div>' +
    '</div>';
  }

  /* ── Online purchase page ── */
  function tplOnlinePage() {
    var steps = [
      { n: '01', title: 'Выберите квартиру',         text: 'Просмотрите каталог на сайте. Используйте фильтры по локации, типу жилья и цене. Сохраняйте понравившиеся варианты.' },
      { n: '02', title: 'Забронируйте онлайн',       text: 'Оставьте заявку. Менеджер свяжется с вами в течение 15 минут и зарезервирует выбранную квартиру на 3 дня.' },
      { n: '03', title: 'Подпишите договор',         text: 'Договор долевого участия оформляется онлайн через цифровую подпись. Оригинал документов — у вас в личном кабинете.' },
      { n: '04', title: 'Оформите оплату',           text: 'Выберите удобный формат: рассрочка, ипотека через банк-партнёр или единовременная оплата. Гибкие условия для каждого.' },
      { n: '05', title: 'Получите ключи',            text: 'После ввода объекта в эксплуатацию мы лично передадим ключи и проведём полный инструктаж по квартире и дому.' },
    ];
    var stepsHtml = steps.map(function (s) {
      return '<div class="pp-step">' +
        '<div class="pp-step__num">' + s.n + '</div>' +
        '<div><h3 class="pp-step__title">' + s.title + '</h3><p class="pp-step__text">' + s.text + '</p></div>' +
      '</div>';
    }).join('');
    return '<div class="pp-page-hero">' +
        '<h1 class="pp-page-title">Купите квартиру онлайн</h1>' +
        '<p class="pp-page-sub">Полный процесс от выбора до получения ключей — без очередей и лишних визитов</p>' +
      '</div>' +
      '<div class="pp-online">' +
      '<div class="pp-steps">' + stepsHtml + '</div>' +
      '<button class="btn btn--primary btn--lg btn--block" id="panelCallbackBtn">Начать — оставить заявку</button>' +
    '</div>';
  }

  /* ─────────────────────────────────────
     Wire panel action buttons
  ───────────────────────────────────── */
  function wirePanelButtons() {
    requestAnimationFrame(function () {
      /* ── Shared callback buttons ── */
      ['panelCallbackBtn','panelCallbackBtn2','panelCallbackBtn3','panelCallbackBtn4','catalogCb','aptBannerCb'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', scrollCallback);
      });

      /* ── Mortgage calculator ── */
      if (document.getElementById('calcPrice')) {
        calcMortgage();
        ['calcPrice','calcDown','calcYears'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.addEventListener('input', calcMortgage);
        });
      }

      /* ── CATALOG PAGE ── */

      /* Filter buttons: toggle on/off */
      pBody.querySelectorAll('.pp-fbtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (this.dataset.filter === 'all') {
            var allOn = pBody.querySelectorAll('.pp-fbtn.pp-fbtn--on').length === pBody.querySelectorAll('.pp-fbtn').length;
            pBody.querySelectorAll('.pp-fbtn').forEach(function(b) {
              b.classList.toggle('pp-fbtn--on', !allOn);
            });
          } else {
            this.classList.toggle('pp-fbtn--on');
          }
        });
      });

      /* Reset filters */
      var freset = pBody.querySelector('.pp-freset');
      if (freset) {
        freset.addEventListener('click', function() {
          pBody.querySelectorAll('.pp-fbtn').forEach(function(b) { b.classList.remove('pp-fbtn--on'); });
        });
      }

      /* Sort buttons: exclusive + re-render */
      pBody.querySelectorAll('.pp-sbtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          pBody.querySelectorAll('.pp-sbtn').forEach(function(b) { b.classList.remove('pp-sbtn--on'); });
          this.classList.add('pp-sbtn--on');
          var key = this.dataset.sort || '';
          var grid = pBody.querySelector('#aptGrid');
          if (!grid) return;
          var shown = grid.querySelectorAll('.pp-apt-card').length;
          var sorted = UNITS.slice().sort(function(a, b) {
            if (key === 'due') return a.due.localeCompare(b.due);
            if (key === 'price-asc') return a.price - b.price;
            if (key === 'price-desc') return b.price - a.price;
            return a.id - b.id;
          });
          grid.innerHTML = sorted.slice(0, shown).map(aptCardHtml).join('');
        });
      });

      /* View toggle: grid / chess */
      pBody.querySelectorAll('.pp-vbtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          pBody.querySelectorAll('.pp-vbtn').forEach(function(b) { b.classList.remove('pp-vbtn--on'); });
          this.classList.add('pp-vbtn--on');
          var grid = pBody.querySelector('#aptGrid');
          if (grid) grid.classList.toggle('pp-apt-grid--chess', this.dataset.view === 'chess');
        });
      });

      /* Load more */
      var moreBtn = pBody.querySelector('.pp-catalog-more');
      if (moreBtn) {
        moreBtn.addEventListener('click', function() {
          var grid = pBody.querySelector('#aptGrid');
          if (!grid) return;
          var shown = grid.querySelectorAll('.pp-apt-card').length;
          var next = UNITS.slice(shown % UNITS.length, (shown % UNITS.length) + 4);
          if (!next.length) next = UNITS.slice(0, 4);
          grid.insertAdjacentHTML('beforeend', next.map(aptCardHtml).join(''));
          var newShown = shown + next.length;
          var countEl = pBody.querySelector('.pp-catalog-count');
          if (countEl) countEl.textContent = 'Показано ' + newShown + ' из 127';
          var fill = pBody.querySelector('.pp-prog__fill');
          if (fill) fill.style.width = Math.min(newShown / 127 * 100, 100) + '%';
        });
      }

      /* Catalog banner: open project page */
      var catalogProjBtn = document.getElementById('catalogProjBtn');
      if (catalogProjBtn) {
        catalogProjBtn.addEventListener('click', function() {
          dispatch('project', {
            projName:'Sky Gardens', projImg:'photo-1486325212027-8081e485255e',
            projCls:'Бизнес', projAddr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура',
            projPrice:'920', projFloors:'от 2 до 16 этажей', projDue:'4 кв. 2027', projRooms:'1,2,3'
          });
        });
      }

      /* ── APT DETAIL PAGE ── */

      /* Buy online */
      var aptBuyBtn = document.getElementById('aptBuyBtn');
      if (aptBuyBtn) aptBuyBtn.addEventListener('click', function() { dispatch('online', {}); });

      /* Book / callback */
      var aptBookBtn = document.getElementById('aptBookBtn');
      if (aptBookBtn) aptBookBtn.addEventListener('click', scrollCallback);

      /* Infobar & banner "project detail" button */
      pBody.querySelectorAll('.pp-apt-detail__proj-btn, #aptBannerProjBtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = parseInt(this.dataset.uid, 10);
          var u = UNITS[uid];
          if (!u) return;
          dispatch('project', {
            projName: u.proj, projImg: u.img, projCls: u.cls, projAddr: u.addr,
            projPrice: '920', projFloors: 'от 2 до ' + u.totF + ' этажей',
            projDue: u.due, projRooms: '1,2,3'
          });
        });
      });

      /* Finish tabs */
      pBody.querySelectorAll('.pp-finish-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          pBody.querySelectorAll('.pp-finish-tab').forEach(function(t) { t.classList.remove('pp-finish-tab--on'); });
          this.classList.add('pp-finish-tab--on');
        });
      });

      /* Payment options: exclusive selection */
      pBody.querySelectorAll('.pp-payment-opt').forEach(function(opt) {
        opt.addEventListener('click', function() {
          pBody.querySelectorAll('.pp-payment-opt').forEach(function(o) {
            o.classList.remove('pp-payment-opt--on');
            var r = o.querySelector('.pp-payment-radio');
            if (r) r.classList.remove('pp-payment-radio--on');
          });
          this.classList.add('pp-payment-opt--on');
          var r = this.querySelector('.pp-payment-radio');
          if (r) r.classList.add('pp-payment-radio--on');
        });
      });

      /* Apt options (repair/furniture): click state */
      pBody.querySelectorAll('.pp-apt-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
          this.classList.toggle('pp-apt-option--active');
        });
      });

      /* Room price cards: open catalog filtered by rooms */
      pBody.querySelectorAll('.pp-room-price-card').forEach(function(card) {
        card.addEventListener('click', function() {
          var rooms = parseInt(this.dataset.rooms, 10);
          showPanelPage(tplCatalogPage(rooms));
        });
      });
    });
  }
function calcMortgage() {
    var price  = parseFloat(document.getElementById('calcPrice').value)  || 600;
    var down   = parseFloat(document.getElementById('calcDown').value)   || 20;
    var years  = parseFloat(document.getElementById('calcYears').value)  || 15;
    var rate   = 0.15 / 12; // 15% annual / 12 months
    var loan   = price * (1 - down / 100);
    var months = years * 12;
    var monthly = loan * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    var el = document.getElementById('calcResult');
    if (el) el.textContent = fmt(monthly) + ' млн/мес';
  }

  /* ─────────────────────────────────────
     SMALL MODAL TEMPLATES
  ───────────────────────────────────── */

  function tplInvest() {
    return '<div class="m-invest">' +
      '<h2 class="m-invest__title">Выгодные инвестиции</h2>' +
      '<p class="m-invest__sub">Недвижимость PropTech — надёжный актив с растущей стоимостью</p>' +
      '<div class="m-invest__stats">' +
        '<div class="m-invest__stat"><span class="m-invest__stat-val">+18%</span><span class="m-invest__stat-label">Средний рост стоимости в год</span></div>' +
        '<div class="m-invest__stat"><span class="m-invest__stat-val">−15%</span><span class="m-invest__stat-label">Скидка на старте продаж</span></div>' +
        '<div class="m-invest__stat"><span class="m-invest__stat-val">12</span><span class="m-invest__stat-label">Объектов в реализации</span></div>' +
      '</div>' +
      '<p class="m-invest__text">Покупайте квартиру на этапе строительства — экономия до 30% по сравнению с готовым жильём. Сдавайте в аренду и получайте стабильный доход.</p>' +
      '<button class="btn btn--primary btn--lg btn--block" id="modalCallbackBtn">Смотреть проекты</button>' +
    '</div>';
  }

  function tplInfra() {
    var items = [
      { ic: 'teacher', l: 'Школы и детсады' }, { ic: 'hospital', l: 'Поликлиники' },
      { ic: 'cart',    l: 'Супермаркеты' },    { ic: 'bus',      l: 'Транспорт' },
      { ic: 'tree',    l: 'Парки' },           { ic: 'weight',   l: 'Фитнес-клубы' },
      { ic: 'coffee',  l: 'Кафе и рестораны' },{ ic: 'bank',     l: 'Банки' },
    ];
    return '<div class="m-infra">' +
      '<h2 class="m-infra__title">Готовая инфраструктура</h2>' +
      '<p class="m-infra__sub">Всё необходимое — рядом с каждым нашим ЖК</p>' +
      '<div class="m-infra__grid">' +
      items.map(function (i) {
        return '<div class="m-infra__item"><span class="ic ic--' + i.ic + ' m-infra__ic"></span><span>' + i.l + '</span></div>';
      }).join('') +
      '</div>' +
      '<button class="btn btn--primary btn--lg btn--block" id="modalCallbackBtn">Смотреть проекты</button>' +
    '</div>';
  }

  function tplPrivacy() {
    return '<div class="m-privacy">' +
      '<h2 class="m-privacy__title">Политика конфиденциальности</h2>' +
      '<div class="m-privacy__text">' +
        '<p>Настоящая политика определяет порядок обработки персональных данных пользователей сайта PropTech.</p>' +
        '<h3>1. Какие данные мы собираем</h3>' +
        '<p>Имя, номер телефона и адрес электронной почты, которые вы вводите при отправке формы обратного звонка.</p>' +
        '<h3>2. Как мы используем данные</h3>' +
        '<p>Данные используются исключительно для связи с вами по интересующим объектам недвижимости.</p>' +
        '<h3>3. Хранение данных</h3>' +
        '<p>Данные хранятся в защищённой CRM-системе и не передаются третьим лицам без вашего согласия.</p>' +
        '<h3>4. Ваши права</h3>' +
        '<p>Вы вправе запросить удаление своих данных, отправив запрос на e-mail: privacy@proptech.uz</p>' +
      '</div>' +
    '</div>';
  }

  /* ─────────────────────────────────────
     APARTMENT CATALOG DATA
  ───────────────────────────────────── */
  var UNITS = [
    { id:0,  rooms:1, area:39.85, price:875858368,  oldP:995293600,   no:'10',  floor:3,  totF:16, ent:1, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:1,  rooms:2, area:41.38, price:996880614,  oldP:1132818000,  no:'100', floor:4,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:2,  rooms:1, area:39.44, price:867437049,  oldP:985723900,   no:'101', floor:4,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:3,  rooms:2, area:41.33, price:995748811,  oldP:1131532740,  no:'102', floor:4,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:4,  rooms:4, area:98.24, price:1999443353, oldP:2272094720,  no:'103', floor:4,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:5,  rooms:1, area:39.37, price:856162067,  oldP:972911440,   no:'106', floor:5,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:6,  rooms:3, area:72.85, price:1488651868, oldP:1691649850,  no:'11',  floor:3,  totF:16, ent:1, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:7,  rooms:1, area:39.32, price:864901593,  oldP:982842720,   no:'111', floor:6,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:8,  rooms:2, area:55.10, price:1145000000, oldP:1301000000,  no:'112', floor:7,  totF:16, ent:1, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:9,  rooms:3, area:88.50, price:1750000000, oldP:1990000000,  no:'113', floor:7,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:10, rooms:1, area:42.00, price:920000000,  oldP:1045800000,  no:'114', floor:8,  totF:16, ent:1, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
    { id:11, rooms:2, area:63.75, price:1290000000, oldP:1467000000,  no:'115', floor:8,  totF:16, ent:2, due:'4 кв. 2027', proj:'Sky Gardens', addr:'г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура', img:'photo-1486325212027-8081e485255e', cls:'Бизнес' },
  ];

  function fmtU(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }


  /* Inline SVG micro-icons */
  var I = {
    chvD: '<svg class="pp-ic" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chvR: '<svg class="pp-ic" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flt:  '<svg class="pp-ic" width="14" height="12" viewBox="0 0 14 12" fill="none"><line x1="1" y1="2" x2="13" y2="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="5.5" y1="10" x2="8.5" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    grid: '<svg class="pp-ic" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>',
    chess:'<svg class="pp-ic" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="3" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="5.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="5.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="10" width="12" height="3" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>',
    dots: '<svg class="pp-ic" width="16" height="4" viewBox="0 0 16 4" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/></svg>',
    bld:  '<svg class="pp-ic" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M6 15V10h4v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 7h1.5M9.5 7H11M5 5h1.5M9.5 5H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    call: '<svg class="pp-ic" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h2.5l1 3.5-1.5 1c.7 1.4 1.6 2.8 2.5 3.5l1.5-1 3.5 1V12.5C13 13.3 12.3 14 11.5 14 5.7 14 2 8.3 2 4.5A2.5 2.5 0 014 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tag:  '<svg class="pp-ic" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 1.5h4.8L12.8 8l-4.3 4.3L2.2 5.7V1.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="4.5" r="1" fill="currentColor"/></svg>'
  };
  /* ── Detailed floor plan SVG for apt detail page ── */
  function detailFloorSVG(rooms, area) {
    rooms = parseInt(rooms, 10) || 1;
    var a = parseFloat(area) || 39.85;
    var cfgs = {
      1: [
        { x:185, y:20, w:180, h:295, name:'Гостиная',  sq:17.43 },
        { x:365, y:20, w:130, h:115, name:'Кухня',     sq:11.95 },
        { x:365, y:135,w:75,  h:90,  name:'Ванная',    sq:4.95  },
        { x:365, y:225,w:130, h:90,  name:'Прихожая',  sq:4.20  }
      ],
      2: [
        { x:185, y:20, w:160, h:148, name:'Гостиная',  sq:17.43 },
        { x:185, y:168,w:160, h:147, name:'Спальня',   sq:14.80 },
        { x:345, y:20, w:150, h:115, name:'Кухня',     sq:12.50 },
        { x:345, y:135,w:75,  h:85,  name:'Ванная',    sq:5.20  },
        { x:345, y:220,w:150, h:95,  name:'Прихожая',  sq:5.80  }
      ],
      3: [
        { x:180, y:20, w:155, h:148, name:'Гостиная',  sq:20.50 },
        { x:180, y:168,w:155, h:147, name:'Спальня 1', sq:16.20 },
        { x:335, y:20, w:160, h:115, name:'Кухня',     sq:13.50 },
        { x:335, y:135,w:80,  h:90,  name:'Ванная',    sq:5.50  },
        { x:415, y:135,w:80,  h:90,  name:'Санузел',   sq:3.50  },
        { x:335, y:225,w:160, h:90,  name:'Спальня 2', sq:14.00 }
      ],
      4: [
        { x:175, y:20, w:150, h:148, name:'Гостиная',  sq:22.00 },
        { x:175, y:168,w:150, h:147, name:'Спальня 1', sq:18.50 },
        { x:325, y:20, w:170, h:115, name:'Кухня',     sq:14.50 },
        { x:325, y:135,w:85,  h:90,  name:'Ванная',    sq:6.00  },
        { x:410, y:135,w:85,  h:90,  name:'Санузел',   sq:3.80  },
        { x:325, y:225,w:85,  h:90,  name:'Спальня 2', sq:16.00 },
        { x:410, y:225,w:85,  h:90,  name:'Спальня 3', sq:14.50 }
      ]
    };
    var rms = cfgs[rooms] || cfgs[1];
    var allX2 = rms.map(function(r){return r.x+r.w;}), allY2 = rms.map(function(r){return r.y+r.h;});
    var bx = rms[0].x - 3, by = 17, bw = Math.max.apply(null,allX2) - rms[0].x + 6, bh = Math.max.apply(null,allY2) - 17 + 6;
    var rects = rms.map(function(r){
      var cx = r.x+r.w/2, cy = r.y+r.h/2;
      return '<rect x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" fill="#b3e5fc" stroke="#5591c9" stroke-width="1.5"/>'+
        '<text x="'+cx+'" y="'+(cy-7)+'" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#1a3a5c">'+r.name+'</text>'+
        '<text x="'+cx+'" y="'+(cy+8)+'" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#4a6a8c">'+r.sq+'</text>';
    }).join('');
    var mc = rms[0], cx = mc.x+mc.w/2, cy = mc.y+mc.h/2;
    var legend =
      '<text x="14" y="22" font-size="10" font-weight="700" font-family="Inter,sans-serif" fill="#222">Условные обозначения</text>'+
      '<rect x="14" y="32" width="28" height="5" fill="#e53935"/>'+
      '<text x="48" y="40" font-size="8" font-family="Inter,sans-serif" fill="#555">каркас монолит</text>'+
      '<line x1="14" y1="55" x2="42" y2="55" stroke="#888" stroke-width="1.5" stroke-dasharray="4,3"/>'+
      '<text x="48" y="59" font-size="8" font-family="Inter,sans-serif" fill="#555">внутренние перегородки 100 мм</text>'+
      '<line x1="14" y1="73" x2="42" y2="73" stroke="#333" stroke-width="2.5"/>'+
      '<text x="48" y="77" font-size="8" font-family="Inter,sans-serif" fill="#555">основные стены газоблок 200 мм</text>'+
      '<rect x="14" y="86" width="28" height="8" fill="#b3e5fc" stroke="#5591c9" stroke-width="1"/>'+
      '<text x="48" y="97" font-size="8" font-family="Inter,sans-serif" fill="#555">межквартирные стены кирпич 250 мм</text>'+
      '<text x="14" y="120" font-size="10" font-weight="700" font-family="Inter,sans-serif" fill="#222">Высота оконных проёмов</text>'+
      '<text x="20" y="136" font-size="8" font-family="Inter,sans-serif" fill="#666">тип-1</text>'+
      '<rect x="14" y="140" width="28" height="38" fill="none" stroke="#555" stroke-width="1"/>'+
      '<rect x="14" y="140" width="28" height="20" fill="#d4eeff" stroke="#555" stroke-width="1"/>'+
      '<text x="52" y="136" font-size="8" font-family="Inter,sans-serif" fill="#666">тип-2</text>'+
      '<rect x="47" y="140" width="28" height="38" fill="none" stroke="#555" stroke-width="1"/>'+
      '<rect x="47" y="150" width="28" height="28" fill="#d4eeff" stroke="#555" stroke-width="1"/>'+
      '<text x="14" y="192" font-size="7" font-family="Inter,sans-serif" fill="#888">окно комнат</text>'+
      '<text x="47" y="192" font-size="7" font-family="Inter,sans-serif" fill="#888">выход на лоджию</text>';
    return '<svg viewBox="0 0 510 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff;border-radius:8px">'+
      legend + rects +
      '<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" fill="none" stroke="#e53935" stroke-width="3"/>'+
      '<circle cx="'+cx+'" cy="'+cy+'" r="32" fill="#1565c0"/>'+
      '<text x="'+cx+'" y="'+(cy-5)+'" text-anchor="middle" font-size="19" font-weight="800" font-family="Inter,sans-serif" fill="#fff">'+rooms+'</text>'+
      '<text x="'+cx+'" y="'+(cy+13)+'" text-anchor="middle" font-size="8.5" font-family="Inter,sans-serif" fill="rgba(255,255,255,.9)">'+a.toFixed(2)+'м²</text>'+
    '</svg>';
  }

  /* ── Apt card HTML (used in catalog + similar) ── */
  function aptCardHtml(u) {
    return '<div class="pp-apt-card" data-modal="apt" data-apt-idx="'+u.id+'">'+
      '<div class="pp-apt-card__hd">'+
        '<span class="pp-apt-label">'+u.rooms+'-комн. '+u.area.toFixed(2)+' м²</span>'+
      '</div>'+
      '<div class="pp-apt-card__tags">'+
        '<span class="pp-apt-tag pp-apt-tag--cls">'+u.cls+'</span>'+
        '<span class="pp-apt-tag pp-apt-tag--promo">Акции</span>'+
      '</div>'+
      '<div class="pp-apt-card__plan">'+floorSVG(u.rooms)+'</div>'+
      '<div class="pp-apt-card__pr">'+
        '<span class="pp-apt-price">'+fmtU(u.price)+' UZS</span>'+
        '<span class="pp-apt-old">'+fmtU(u.oldP)+' UZS</span>'+
        '<button class="pp-apt-dots" aria-label="Ещё">'+I.dots+'</button>'+
      '</div>'+
      '<div class="pp-apt-card__proj">'+u.proj+' 1 – 2</div>'+
      '<div class="pp-apt-card__info">№ '+u.no+' | '+u.floor+'/'+u.totF+' этаж | '+u.ent+' подъезд | '+u.due+'</div>'+
      '<div class="pp-apt-card__cta"><span class="ic ic--flash" style="width:.85em;height:.85em;vertical-align:middle;margin-right:.3em"></span>спецпредложение до 31 декабря</div>'+
    '</div>';
  }

  /* Catalog page */
  function tplCatalogPage(filterRooms) {
    var units = filterRooms ? UNITS.filter(function(u){ return u.rooms === filterRooms; }) : UNITS;
    var shown = Math.min(8, units.length);
    var cards = units.slice(0, shown).map(aptCardHtml).join('');
    return '<div class="pp-catalog-wrap">'+
      '<h1 class="pp-catalog-title">Выбрать квартиру</h1>'+
      '<div class="pp-catalog-filters">'+
        '<button class="pp-fbtn pp-fbtn--on" data-filter="city">Ташкент '+I.chvD+'</button>'+
        '<button class="pp-fbtn pp-fbtn--on" data-filter="type">Квартира '+I.chvD+'</button>'+
        '<button class="pp-fbtn" data-filter="price">Цена '+I.chvD+'</button>'+
        '<button class="pp-fbtn" data-filter="due">Время сдачи '+I.chvD+'</button>'+
        '<button class="pp-fbtn pp-fbtn--all" data-filter="all">'+I.flt+' Все фильтры</button>'+
        '<button class="pp-freset">Сбросить</button>'+
      '</div>'+
      '<div class="pp-catalog-toolbar">'+
        '<div class="pp-sorts">'+
          '<button class="pp-sbtn pp-sbtn--on" data-sort="">Без сортировки '+I.chvD+'</button>'+
          '<button class="pp-sbtn" data-sort="due">Очередь '+I.chvD+'</button>'+
          '<button class="pp-sbtn" data-sort="price-asc">По цене '+I.chvD+'</button>'+
        '</div>'+
        '<div class="pp-views">'+
          '<button class="pp-vbtn pp-vbtn--on" data-view="grid" title="Плитка">'+I.grid+'</button>'+
          '<button class="pp-vbtn" data-view="chess" title="Шахматка">'+I.chess+'</button>'+
        '</div>'+
      '</div>'+
      '<div class="pp-proj-banner" style="background-image:linear-gradient(to right,rgba(0,0,0,.65) 0%,rgba(0,0,0,.2) 60%,rgba(0,0,0,.4) 100%),url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80)">'+
        '<div class="pp-proj-banner__l">'+
          '<h3 class="pp-proj-banner__name">Sky Gardens</h3>'+
          '<p class="pp-proj-banner__addr"><span class="ic ic--location" style="width:.9em;height:.9em;margin-right:.3em;vertical-align:middle"></span>г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура</p>'+
          '<span class="badge">Бизнес</span>'+
        '</div>'+
        '<div class="pp-proj-banner__r">'+
          '<button class="btn btn--ghost btn--sm" id="catalogCb">'+I.call+' Оставить заявку</button>'+
          '<button class="btn btn--ghost btn--sm" id="catalogProjBtn">'+I.bld+' Подробнее о ЖК</button>'+
        '</div>'+
      '</div>'+
      '<div class="pp-apt-grid" id="aptGrid">'+cards+'</div>'+
      '<div class="pp-catalog-paging">'+
        '<span class="pp-catalog-count">Показано '+shown+' из '+units.length+'</span>'+
        '<div class="pp-prog"><div class="pp-prog__fill" style="width:'+Math.round(shown/Math.max(units.length,1)*100)+'%"></div></div>'+
      '</div>'+
      (shown < units.length ? '<button class="btn btn--outline btn--block pp-catalog-more">Показать ещё</button>' : '')+
    '</div>';
  }
/* Apartment detail page */
  function tplAptDetailPage(u) {
    if (!u) return '<div class="pp-catalog-wrap"><p style="padding:2rem">Квартира не найдена</p></div>';
    var roomPrices = [938.3, 1064.3, 1322.9, 2129.9];
    var similarCards = UNITS.filter(function(x){ return x.id !== u.id && x.rooms === u.rooms; }).slice(0,3);
    if (similarCards.length < 2) similarCards = UNITS.filter(function(x){ return x.id !== u.id; }).slice(0,3);

    return '<div class="pp-apt-detail">'+
      '<h1 class="pp-apt-detail__title">'+u.rooms+'-комнатная квартира №'+u.no+', '+u.area.toFixed(2)+' м² — '+u.proj+'</h1>'+
      '<div class="pp-apt-detail__cols">'+
        '<div class="pp-apt-detail__left">'+
          '<div class="pp-apt-detail__infobar">'+
            '<span class="pp-infobar-tag">'+u.proj+'</span>'+
            '<span class="pp-infobar-tag">'+u.floor+' из '+u.totF+' эт.</span>'+
            '<span class="pp-infobar-tag">'+u.ent+' подъезд</span>'+
            '<span class="pp-infobar-tag">Сдача '+u.due+'</span>'+
            '<button class="pp-apt-detail__proj-btn" data-uid="'+u.id+'">Подробнее о ЖК '+I.chvR+'</button>'+
          '</div>'+
          '<div class="pp-finish-tabs">'+
            '<button class="pp-finish-tab pp-finish-tab--on">Черновая отделка</button>'+
            '<button class="pp-finish-tab">Чистовая отделка</button>'+
          '</div>'+
          '<div class="pp-apt-detail__plan">'+detailFloorSVG(u.rooms, u.area)+'</div>'+
        '</div>'+
        '<div class="pp-apt-detail__right">'+
          '<div class="pp-apt-detail__price">'+fmtU(u.price)+' UZS</div>'+
          '<div class="pp-apt-detail__oldprice">'+fmtU(u.oldP)+' UZS</div>'+
          '<p class="pp-apt-detail__price-note">Стоимость дополнительных опций включается в итоговую стоимость квартиры</p>'+
          '<button class="pp-apt-option" data-option="repair">'+
            '<span class="pp-apt-option__ic"><span class="ic ic--clipboard" style="width:1.1em;height:1.1em;color:var(--brand-600)"></span></span>'+
            '<span class="pp-apt-option__body"><span class="pp-apt-option__main">Ремонт</span><span class="pp-apt-option__sub">Подумайте о ремонте заранее</span></span>'+
            '<span class="pp-apt-option__arr">'+I.chvR+'</span>'+
          '</button>'+
          '<button class="pp-apt-option" data-option="furniture">'+
            '<span class="pp-apt-option__ic"><span class="ic ic--house" style="width:1.1em;height:1.1em;color:var(--brand-600)"></span></span>'+
            '<span class="pp-apt-option__body"><span class="pp-apt-option__main">Мебель</span><span class="pp-apt-option__sub">Подумайте об интерьере заранее</span></span>'+
            '<span class="pp-apt-option__arr">'+I.chvR+'</span>'+
          '</button>'+
          '<div class="pp-payment-title">Способы оплаты</div>'+
          '<div class="pp-payment-opt pp-payment-opt--on" data-pay="full">'+
            '<div class="pp-payment-row"><span class="pp-payment-radio pp-payment-radio--on"></span><span>100% Оплата</span><span class="pp-payment-discount">−12%</span></div>'+
            '<div class="pp-payment-label">Стандартные условия 2026 · 100% / рассрочка</div>'+
            '<div class="pp-payment-sub">Бронирование от 1 000 000 UZS · действует 3 дня</div>'+
          '</div>'+
          '<div class="pp-payment-opt" data-pay="installment">'+
            '<div class="pp-payment-row"><span class="pp-payment-radio"></span><span>Рассрочка</span><span class="pp-payment-discount">0%</span></div>'+
            '<div class="pp-payment-label">Рассрочка до 36 месяцев · первый взнос 20%</div>'+
            '<div class="pp-payment-sub">Гибкий график платежей без переплаты</div>'+
          '</div>'+
          '<div class="pp-payment-opt" data-pay="mortgage">'+
            '<div class="pp-payment-row"><span class="pp-payment-radio"></span><span>Ипотека</span><span class="pp-payment-discount">от 13%</span></div>'+
            '<div class="pp-payment-label">Банки-партнёры · одобрение за 3 дня</div>'+
            '<div class="pp-payment-sub">Первый взнос от 20% · срок до 25 лет</div>'+
          '</div>'+
          '<button class="btn btn--primary btn--lg btn--block" id="aptBuyBtn">'+I.call+' Купить онлайн</button>'+
          '<button class="btn btn--outline btn--lg btn--block pp-apt-book" id="aptBookBtn">Забронировать</button>'+
        '</div>'+
      '</div>'+
      '<div class="pp-apt-specs">'+
        '<div class="pp-apt-spec-row"><span>Расположение</span><span>'+u.addr+'</span></div>'+
        '<div class="pp-apt-spec-row"><span>Тип недвижимости</span><span>Квартира</span></div>'+
        '<div class="pp-apt-spec-row"><span>Общая площадь</span><span>'+u.area.toFixed(2)+' м²</span></div>'+
        '<div class="pp-apt-spec-row"><span>Этаж</span><span>'+u.floor+' из '+u.totF+'</span></div>'+
        '<div class="pp-apt-spec-row"><span>Подъезд</span><span>'+u.ent+'</span></div>'+
        '<div class="pp-apt-spec-row"><span>Высота потолков</span><span>Не менее 3,0 м</span></div>'+
        '<div class="pp-apt-spec-row"><span>Срок сдачи</span><span>'+u.due+'</span></div>'+
      '</div>'+
      '<div class="pp-proj-banner" style="background-image:linear-gradient(to right,rgba(0,0,0,.65) 0%,rgba(0,0,0,.2) 60%,rgba(0,0,0,.4) 100%),url(https://images.unsplash.com/'+u.img+'?w=1200&q=80)">'+
        '<div class="pp-proj-banner__l">'+
          '<h3 class="pp-proj-banner__name">'+u.proj+'</h3>'+
          '<p class="pp-proj-banner__addr"><span class="ic ic--location" style="width:.9em;height:.9em;margin-right:.3em;vertical-align:middle"></span>'+u.addr+'</p>'+
          '<span class="badge">'+u.cls+'</span>'+
        '</div>'+
        '<div class="pp-proj-banner__r">'+
          '<button class="btn btn--ghost btn--sm" id="aptBannerCb">'+I.call+' Оставить заявку</button>'+
          '<button class="btn btn--ghost btn--sm" data-uid="'+u.id+'" id="aptBannerProjBtn">'+I.bld+' Подробнее о ЖК</button>'+
        '</div>'+
      '</div>'+
      '<div class="pp-room-prices">'+
        [1,2,3,4].map(function(r,i){
          return '<div class="pp-room-price-card'+(u.rooms===r?' pp-room-price-card--on':'')+'" data-rooms="'+r+'">'+
            '<div class="pp-room-price__rooms">'+r+'-к</div>'+
            '<div class="pp-room-price__val">от '+roomPrices[i]+' млн UZS</div>'+
            '<span class="pp-room-price__arr">'+I.chvR+'</span>'+
          '</div>';
        }).join('')+
      '</div>'+
      '<h2 class="pp-apt-similar__title">Похожие квартиры</h2>'+
      '<div class="pp-apt-similar">'+similarCards.map(aptCardHtml).join('')+'</div>'+
    '</div>';
  }

  /* Dispatch */
  function dispatch(type, ds) {
    // Panel types — showPanelPage keeps a Back history when navigating
    // from one panel page to another (e.g. project → Ипотека → Назад).
    if (type === 'project') { showPanelPage(tplProjectPage(ds)); return; }
    if (type === 'floors') {
      showPanelPage(tplCatalogPage());
      return;
    }
    if (type === 'promo')     { showPanelPage(tplPromoPage());     return; }
    if (type === 'mortgage')  { showPanelPage(tplMortgagePage());  return; }
    if (type === 'partners')  { showPanelPage(tplPartnersPage());  return; }
    if (type === 'online')    { showPanelPage(tplOnlinePage());    return; }
    if (type === 'promo-panel') { showPanelPage(tplPromoPage());   return; }

    // Small modal types
    if (type === 'catalog')   { showPanelPage(tplCatalogPage()); return; }
    if (type === 'apt')       { showPanelPage(tplAptDetailPage(UNITS[parseInt(ds.aptIdx, 10)])); return; }
    if (type === 'invest')    { openModal(tplInvest(), 'sm'); wireBtn('modalCallbackBtn', function () { closeModal(); }); return; }
    if (type === 'infra')     { openModal(tplInfra(), 'sm');  wireBtn('modalCallbackBtn', function () { closeModal(); }); return; }
    if (type === 'privacy')   { openModal(tplPrivacy(), 'sm'); return; }
  }

  /* ─────────────────────────────────────
     Global event delegation
  ───────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal]');
    if (!trigger) return;
    e.preventDefault();
    dispatch(trigger.dataset.modal, trigger.dataset);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!mOverlay.hidden) closeModal();
    else if (!panel.hidden) goBack();
  });

})();





