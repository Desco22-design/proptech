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
    mBody.innerHTML = html + mFooterHtml();
    mBox.dataset.size = size || 'md';
    mOverlay.hidden = false;
    requestAnimationFrame(function () { mOverlay.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    wireBtn('modalCallbackBtn', scrollCallback);
    wireFooterLinks(mBody);
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
    pBody.innerHTML = '<div class="pp-sheet">' + html + '</div>' + ppFooterHtml();
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

  /* ─────────────────────────────────────
     Shared footer (added to every panel page + small modal)
  ───────────────────────────────────── */
  function footerSocials() {
    return '<div class="footer__socials">'+
      '<a class="footer__social" href="https://t.me/proptech_uz" target="_blank" rel="noopener" aria-label="Telegram"><span class="ic ic--send"></span></a>'+
      '<a class="footer__social" href="#" aria-label="Instagram"><span class="ic ic--instagram"></span></a>'+
      '<a class="footer__social" href="#" aria-label="YouTube"><span class="ic ic--youtube"></span></a>'+
    '</div>';
  }

  function ppFooterHtml() {
    return '<footer class="pp-footer">'+
      '<div class="footer__top">'+
        '<div class="pp-footer__brand">'+
          '<a class="logo logo--invert" href="#"><span class="logo__word">Prop<span class="logo__accent">Tech</span></span></a>'+
          '<p class="footer__about">Строим качественное жильё нового поколения в Ташкенте. Ваш комфорт — наш главный приоритет.</p>'+
          footerSocials()+
        '</div>'+
        '<div class="footer__col">'+
          '<h4>Покупателям</h4>'+
          '<a href="#" data-modal="catalog">Планировки</a>'+
          '<a href="#" data-modal="mortgage">Ипотека</a>'+
          '<a href="#" data-modal="promo">Рассрочка</a>'+
          '<a href="#" data-modal="promo">Акции</a>'+
        '</div>'+
        '<div class="footer__col">'+
          '<h4>Компания</h4>'+
          '<a href="#" data-modal="partners">Агентствам</a>'+
          '<a href="#" class="pp-footer-cb">Консультация</a>'+
          '<a href="#" class="pp-footer-cb">Оставить заявку</a>'+
        '</div>'+
        '<div class="footer__col">'+
          '<h4>Контакты</h4>'+
          '<a href="tel:7777">Колл-центр: 7777</a>'+
          '<a href="https://t.me/proptech_uz" target="_blank" rel="noopener">Telegram</a>'+
          '<a href="#" class="pp-footer-cb">просп. Амира Темура, 105</a>'+
        '</div>'+
      '</div>'+
      '<div class="footer__bottom">'+
        '<span>© 2026 PropTech. Все права защищены.</span>'+
        '<span>Дизайн-демо. Изображения проектов схематичны.</span>'+
      '</div>'+
    '</footer>';
  }

  function mFooterHtml() {
    return '<div class="m-footer">'+
      '<span class="m-footer__brand">Prop<span class="logo__accent">Tech</span></span>'+
      '<div class="footer__socials m-footer__socials">'+
        '<a class="footer__social" href="https://t.me/proptech_uz" target="_blank" rel="noopener" aria-label="Telegram"><span class="ic ic--send"></span></a>'+
        '<a class="footer__social" href="#" aria-label="Instagram"><span class="ic ic--instagram"></span></a>'+
        '<a class="footer__social" href="#" aria-label="YouTube"><span class="ic ic--youtube"></span></a>'+
      '</div>'+
      '<span class="m-footer__copy">© 2026 PropTech</span>'+
    '</div>';
  }

  /* Wire footer callback links inside a given root (panel or modal). */
  function wireFooterLinks(root) {
    (root || pBody).querySelectorAll('.pp-footer-cb').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); scrollCallback(); });
    });
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

      /* ── Footer callback links ── */
      wireFooterLinks(pBody);

      /* ── Mortgage calculator ── */
      if (document.getElementById('calcPrice')) {
        calcMortgage();
        ['calcPrice','calcDown','calcYears'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.addEventListener('input', calcMortgage);
        });
      }

      /* ── CATALOG PAGE — functional filters ── */

      /* Filter modal: open / close */
      var fBtn = pBody.querySelector('.pp-filter-btn');
      if (fBtn) fBtn.addEventListener('click', openFilterModal);
      pBody.querySelectorAll('[data-fclose]').forEach(function(b) {
        b.addEventListener('click', closeFilterModal);
      });
      var fApply = pBody.querySelector('.pp-fmodal__apply');
      if (fApply) fApply.addEventListener('click', closeFilterModal);

      /* City / Type radios */
      pBody.querySelectorAll('input[name="ddCity"]').forEach(function(r) {
        r.addEventListener('change', function() { CF.city = this.value; CF.shown = CATALOG_PAGE; renderCatalog(); });
      });
      pBody.querySelectorAll('input[name="ddType"]').forEach(function(r) {
        r.addEventListener('change', function() { CF.type = this.value; CF.shown = CATALOG_PAGE; renderCatalog(); });
      });

      /* Price range + presets */
      var pMin = pBody.querySelector('#ddPriceMin'), pMax = pBody.querySelector('#ddPriceMax');
      function readPrice() {
        CF.priceMin = (pMin && pMin.value !== '') ? parseFloat(pMin.value) * 1e6 : null;
        CF.priceMax = (pMax && pMax.value !== '') ? parseFloat(pMax.value) * 1e6 : null;
        CF.shown = CATALOG_PAGE; renderCatalog();
      }
      if (pMin) pMin.addEventListener('input', readPrice);
      if (pMax) pMax.addEventListener('input', readPrice);
      pBody.querySelectorAll('.pp-price-presets .pp-dd-chip').forEach(function(c) {
        c.addEventListener('click', function() {
          var on = this.classList.contains('pp-dd-chip--on');
          this.parentNode.querySelectorAll('.pp-dd-chip').forEach(function(s) { s.classList.remove('pp-dd-chip--on'); });
          if (on) { if (pMin) pMin.value = ''; if (pMax) pMax.value = ''; }
          else {
            this.classList.add('pp-dd-chip--on');
            if (pMin) pMin.value = this.dataset.pmin || '';
            if (pMax) pMax.value = this.dataset.pmax || '';
          }
          readPrice();
        });
      });

      /* Due checkboxes */
      pBody.querySelectorAll('.pp-dd-due').forEach(function(c) {
        c.addEventListener('change', function() {
          CF.dueSel = Array.prototype.slice.call(pBody.querySelectorAll('.pp-dd-due:checked'))
                        .map(function(x) { return x.value; });
          CF.shown = CATALOG_PAGE; renderCatalog();
        });
      });

      /* Rooms chips */
      pBody.querySelectorAll('.pp-dd-room').forEach(function(b) {
        b.addEventListener('click', function() {
          var r = parseInt(this.dataset.room, 10), i = CF.rooms.indexOf(r);
          if (i < 0) { CF.rooms.push(r); this.classList.add('pp-dd-room--on'); }
          else { CF.rooms.splice(i, 1); this.classList.remove('pp-dd-room--on'); }
          CF.shown = CATALOG_PAGE; renderCatalog();
        });
      });

      /* Area range */
      var aMin = pBody.querySelector('#ddAreaMin'), aMax = pBody.querySelector('#ddAreaMax');
      function readArea() {
        CF.areaMin = (aMin && aMin.value !== '') ? parseFloat(aMin.value) : null;
        CF.areaMax = (aMax && aMax.value !== '') ? parseFloat(aMax.value) : null;
        CF.shown = CATALOG_PAGE; renderCatalog();
      }
      if (aMin) aMin.addEventListener('input', readArea);
      if (aMax) aMax.addEventListener('input', readArea);

      /* Reset everything (modal footer + empty-state button) */
      var freset = pBody.querySelector('.pp-freset');
      if (freset) freset.addEventListener('click', resetCatalog);
      var emptyReset = pBody.querySelector('.pp-empty-reset');
      if (emptyReset) emptyReset.addEventListener('click', resetCatalog);

      /* Sort segmented control */
      pBody.querySelectorAll('.pp-sbtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          pBody.querySelectorAll('.pp-sbtn').forEach(function(b) { b.classList.remove('pp-sbtn--on'); });
          this.classList.add('pp-sbtn--on');
          CF.sort = this.dataset.sort || '';
          renderCatalog();
        });
      });

      /* Load more */
      var moreBtn = pBody.querySelector('.pp-catalog-more');
      if (moreBtn) moreBtn.addEventListener('click', function() { CF.shown += CATALOG_PAGE; renderCatalog(); });

      /* Push any preset (e.g. rooms from a room-price card) onto the controls */
      syncFilterUI();

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

      /* Finish tabs — swap the active state, aria-selected, and the note text */
      pBody.querySelectorAll('.pp-finish-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          pBody.querySelectorAll('.pp-finish-tab').forEach(function(t) {
            t.classList.remove('pp-finish-tab--on');
            t.setAttribute('aria-selected', 'false');
          });
          this.classList.add('pp-finish-tab--on');
          this.setAttribute('aria-selected', 'true');
          var note = document.getElementById('finishNote');
          if (note && this.dataset.note) note.textContent = this.dataset.note;
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

  /* Spread completion dates across a few quarters so the «Срок сдачи»
     filter and sort have real variety to act on (multi-building complex). */
  (function () {
    var quarters = ['2 кв. 2026', '4 кв. 2026', '2 кв. 2027', '4 кв. 2027'];
    UNITS.forEach(function (u) { u.due = quarters[u.id % quarters.length]; });
  })();

  function fmtU(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }


  /* Inline SVG micro-icons */
  var I = {
    chvD: '<svg class="pp-ic" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chvR: '<svg class="pp-ic" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flt:  '<svg class="pp-ic" width="16" height="14" viewBox="0 0 14 12" fill="none"><line x1="1" y1="2" x2="13" y2="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="5.5" y1="10" x2="8.5" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    close:'<svg class="pp-ic" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    grid: '<svg class="pp-ic" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.9"/><rect x="9" y="1" width="6" height="6" rx="1.9"/><rect x="1" y="9" width="6" height="6" rx="1.9"/><rect x="9" y="9" width="6" height="6" rx="1.9"/></svg>',
    chess:'<svg class="pp-ic" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="4.4" rx="1.6" stroke="currentColor" stroke-width="1.6"/><rect x="1.5" y="9.1" width="13" height="4.4" rx="1.6" stroke="currentColor" stroke-width="1.6"/></svg>',
    dots: '<svg class="pp-ic" width="16" height="4" viewBox="0 0 16 4" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/></svg>',
    bld:  '<svg class="pp-ic" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M6 15V10h4v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 7h1.5M9.5 7H11M5 5h1.5M9.5 5H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    call: '<svg class="pp-ic" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h2.5l1 3.5-1.5 1c.7 1.4 1.6 2.8 2.5 3.5l1.5-1 3.5 1V12.5C13 13.3 12.3 14 11.5 14 5.7 14 2 8.3 2 4.5A2.5 2.5 0 014 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tag:  '<svg class="pp-ic" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 1.5h4.8L12.8 8l-4.3 4.3L2.2 5.7V1.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="4.5" r="1" fill="currentColor"/></svg>'
  };
  /* ── Room layout config (shared by the SVG plan and the экспликация list) ── */
  function roomConfig(rooms) {
    rooms = parseInt(rooms, 10) || 1;
    var cfgs = {
      1: [
        { x:20,  y:20,  w:180, h:295, name:'Гостиная',  sq:17.43, t:'living'  },
        { x:200, y:20,  w:130, h:115, name:'Кухня',     sq:11.95, t:'kitchen' },
        { x:200, y:135, w:75,  h:90,  name:'Санузел',   sq:4.95,  t:'wet'     },
        { x:200, y:225, w:130, h:90,  name:'Прихожая',  sq:5.52,  t:'hall'    }
      ],
      2: [
        { x:20,  y:20,  w:160, h:148, name:'Гостиная',  sq:17.43, t:'living'  },
        { x:20,  y:168, w:160, h:147, name:'Спальня',   sq:14.80, t:'bed'     },
        { x:180, y:20,  w:150, h:115, name:'Кухня',     sq:12.50, t:'kitchen' },
        { x:180, y:135, w:75,  h:85,  name:'Санузел',   sq:5.20,  t:'wet'     },
        { x:180, y:220, w:150, h:95,  name:'Прихожая',  sq:5.80,  t:'hall'    }
      ],
      3: [
        { x:15,  y:20,  w:155, h:148, name:'Гостиная',  sq:20.50, t:'living'  },
        { x:15,  y:168, w:155, h:147, name:'Спальня 1', sq:16.20, t:'bed'     },
        { x:170, y:20,  w:160, h:115, name:'Кухня',     sq:13.50, t:'kitchen' },
        { x:170, y:135, w:80,  h:90,  name:'Ванная',    sq:5.50,  t:'wet'     },
        { x:250, y:135, w:80,  h:90,  name:'С/у',       sq:3.50,  t:'wet'     },
        { x:170, y:225, w:160, h:90,  name:'Спальня 2', sq:14.00, t:'bed'     }
      ],
      4: [
        { x:10,  y:20,  w:150, h:148, name:'Гостиная',  sq:22.00, t:'living'  },
        { x:10,  y:168, w:150, h:147, name:'Спальня 1', sq:18.50, t:'bed'     },
        { x:160, y:20,  w:170, h:115, name:'Кухня',     sq:14.50, t:'kitchen' },
        { x:160, y:135, w:85,  h:90,  name:'Ванная',    sq:6.00,  t:'wet'     },
        { x:245, y:135, w:85,  h:90,  name:'С/у',       sq:3.80,  t:'wet'     },
        { x:160, y:225, w:85,  h:90,  name:'Спальня 2', sq:16.00, t:'bed'     },
        { x:245, y:225, w:85,  h:90,  name:'Спальня 3', sq:14.50, t:'bed'     }
      ]
    };
    return cfgs[rooms] || cfgs[1];
  }

  /* Soft, semantic room palette — cool tones for living, warm for kitchen,
     teal for wet zones, neutral for circulation. Keeps the plan readable. */
  var ROOM_FILL = {
    living:  { fill:'#e8f1ff', stroke:'#b6ccf0' },
    bed:     { fill:'#eef4ff', stroke:'#c4d4f3' },
    kitchen: { fill:'#fdf2e3', stroke:'#eccfa0' },
    wet:     { fill:'#e2f3f4', stroke:'#abd4d8' },
    hall:    { fill:'#f3f6fb', stroke:'#d7e0ee' }
  };

  /* ── Clean floor-plan SVG (no embedded legend — that lives in HTML now) ── */
  function detailFloorSVG(rooms, area) {
    rooms = parseInt(rooms, 10) || 1;
    var rms = roomConfig(rooms);
    var maxX = Math.max.apply(null, rms.map(function(r){ return r.x + r.w; }));
    var maxY = Math.max.apply(null, rms.map(function(r){ return r.y + r.h; }));
    var minX = Math.min.apply(null, rms.map(function(r){ return r.x; }));
    var minY = Math.min.apply(null, rms.map(function(r){ return r.y; }));
    var pad = 30;
    var vbW = maxX + pad, vbH = maxY + pad;

    var rects = rms.map(function (r) {
      var c  = ROOM_FILL[r.t] || ROOM_FILL.living;
      var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      return '<rect x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" rx="2" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.5"/>'+
        '<text x="'+cx+'" y="'+(cy-4)+'" text-anchor="middle" font-size="11" font-weight="600" font-family="Inter,sans-serif" fill="#24375c">'+r.name+'</text>'+
        '<text x="'+cx+'" y="'+(cy+12)+'" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#6a7c9c">'+r.sq.toFixed(2)+' м²</text>';
    }).join('');

    // Building outline
    var bx = minX - 4, by = minY - 4, bw = (maxX - minX) + 8, bh = (maxY - minY) + 8;
    var frame = '<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="4" fill="none" stroke="#3b66ff" stroke-width="2.5"/>';

    // Entrance marker on the hall room's bottom edge
    var hall = rms.filter(function(r){ return r.t === 'hall'; })[0] || rms[rms.length-1];
    var ex = hall.x + hall.w / 2, ey = hall.y + hall.h;
    var entrance =
      '<line x1="'+(ex-13)+'" y1="'+ey+'" x2="'+(ex+13)+'" y2="'+ey+'" stroke="#3b66ff" stroke-width="3" stroke-linecap="round"/>'+
      '<path d="M'+ex+' '+(ey+18)+' L'+(ex-5)+' '+(ey+9)+' L'+(ex+5)+' '+(ey+9)+' Z" fill="#3b66ff"/>'+
      '<text x="'+ex+'" y="'+(ey+30)+'" text-anchor="middle" font-size="8.5" font-weight="600" font-family="Inter,sans-serif" fill="#3b66ff">вход</text>';

    // North indicator (top-right)
    var nx = vbW - 16, ny = 18;
    var north =
      '<circle cx="'+nx+'" cy="'+ny+'" r="11" fill="#fff" stroke="#d7e0ee" stroke-width="1"/>'+
      '<path d="M'+nx+' '+(ny-7)+' L'+(nx-4)+' '+(ny+2)+' L'+(nx+4)+' '+(ny+2)+' Z" fill="#e35d4f"/>'+
      '<text x="'+nx+'" y="'+(ny+9)+'" text-anchor="middle" font-size="7" font-weight="700" font-family="Inter,sans-serif" fill="#8a95a8">С</text>';

    return '<svg viewBox="0 0 '+vbW+' '+(vbH+22)+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Планировка '+rooms+'-комнатной квартиры" style="width:100%;height:auto;display:block">'+
      rects + frame + entrance + north +
    '</svg>';
  }

  /* ── Экспликация: room-by-room area breakdown as clean HTML ── */
  function aptExplication(rooms, area) {
    var rms = roomConfig(rooms);
    var rowsHtml = rms.map(function (r) {
      return '<li class="pp-expl__row">'+
        '<span class="pp-expl__dot pp-expl__dot--'+r.t+'"></span>'+
        '<span class="pp-expl__name">'+r.name+'</span>'+
        '<span class="pp-expl__area">'+r.sq.toFixed(2)+' м²</span>'+
      '</li>';
    }).join('');
    return '<ul class="pp-expl">'+ rowsHtml +
      '<li class="pp-expl__row pp-expl__row--total">'+
        '<span class="pp-expl__name">Общая площадь</span>'+
        '<span class="pp-expl__area">'+parseFloat(area).toFixed(2)+' м²</span>'+
      '</li>'+
    '</ul>';
  }

  /* ── Apt card HTML (used in catalog + similar) ── */
  function aptCardHtml(u) {
    var disc = Math.round((u.oldP - u.price) / u.oldP * 100);
    return '<button type="button" class="pp-apt-card" data-modal="apt" data-apt-idx="'+u.id+'" '+
        'aria-label="'+u.rooms+'-комнатная, '+u.area.toFixed(2)+' м², '+fmtU(u.price)+' UZS, подробнее">'+
      '<div class="pp-apt-card__top">'+
        '<span class="pp-apt-card__rooms">'+u.rooms+'-комн.</span>'+
        '<span class="pp-apt-card__sq">'+u.area.toFixed(2)+' м²</span>'+
        (disc > 0 ? '<span class="pp-apt-card__disc">−'+disc+'%</span>' : '')+
      '</div>'+
      '<div class="pp-apt-card__plan">'+floorSVG(u.rooms)+'</div>'+
      '<div class="pp-apt-card__price">'+fmtU(u.price)+'<span class="pp-apt-card__cur"> UZS</span></div>'+
      '<div class="pp-apt-card__old">'+fmtU(u.oldP)+' UZS</div>'+
      '<div class="pp-apt-card__meta">№'+u.no+' · '+u.floor+'/'+u.totF+' эт · '+u.ent+' подъезд</div>'+
      '<div class="pp-apt-card__foot">'+
        '<span class="pp-apt-card__proj">'+u.proj+' · '+u.cls+'</span>'+
        '<span class="pp-apt-card__go">Подробнее '+I.chvR+'</span>'+
      '</div>'+
    '</button>';
  }

  /* ─────────────────────────────────────
     CATALOG FILTERS — state + live logic
  ───────────────────────────────────── */
  var CF = null;                       // current filter state (per catalog open)
  var CATALOG_PAGE = 8;                // initial + "show more" page size

  function defaultFilter() {
    return { city:'Ташкент', type:'Квартира', rooms:[], priceMin:null, priceMax:null,
             dueSel:[], areaMin:null, areaMax:null, sort:'', view:'grid', shown:CATALOG_PAGE };
  }
  function mln(uzs) { return Math.round(uzs / 1e6); }

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  /* Apply the active filter state to UNITS, then sort. */
  function catalogList() {
    var list = UNITS.filter(function (u) {
      if (CF.city && CF.city !== 'Ташкент') return false;          // only Tashkent in data
      if (CF.type && CF.type !== 'Квартира') return false;         // only apartments in data
      if (CF.rooms.length && CF.rooms.indexOf(u.rooms) < 0) return false;
      if (CF.priceMin != null && u.price < CF.priceMin) return false;
      if (CF.priceMax != null && u.price > CF.priceMax) return false;
      if (CF.areaMin  != null && u.area  < CF.areaMin)  return false;
      if (CF.areaMax  != null && u.area  > CF.areaMax)  return false;
      if (CF.dueSel.length && CF.dueSel.indexOf(u.due) < 0) return false;
      return true;
    });
    var k = CF.sort;
    return list.sort(function (a, b) {
      if (k === 'due') return a.due.localeCompare(b.due);
      if (k === 'price-asc') return a.price - b.price;
      if (k === 'price-desc') return b.price - a.price;
      return a.id - b.id;
    });
  }

  /* Re-render grid, counter, progress, "show more" + empty state from CF. */
  function renderCatalog() {
    var grid = pBody.querySelector('#aptGrid');
    if (!grid) return;
    var list  = catalogList();
    var total = list.length;
    var shown = Math.min(CF.shown, total);

    grid.innerHTML = list.slice(0, shown).map(aptCardHtml).join('');
    grid.classList.toggle('pp-apt-grid--chess', CF.view === 'chess');
    grid.hidden = total === 0;

    var empty = pBody.querySelector('.pp-catalog-empty');
    if (empty) empty.hidden = total > 0;

    var countEl = pBody.querySelector('.pp-catalog-count');
    if (countEl) countEl.textContent = total ? ('Показано ' + shown + ' из ' + total) : 'Ничего не найдено';
    var fill = pBody.querySelector('.pp-prog__fill');
    if (fill) fill.style.width = (total ? Math.round(shown / total * 100) : 0) + '%';
    var more = pBody.querySelector('.pp-catalog-more');
    if (more) more.style.display = shown < total ? '' : 'none';
    var badge = pBody.querySelector('.pp-catalog-badge');
    if (badge) badge.textContent = total + ' ' + plural(total, 'планировка', 'планировки', 'планировок');

    updateFilterUI(total);
  }

  /* Count how many filter groups are active (city is fixed, so excluded). */
  function activeFilterCount() {
    var n = 0;
    if (CF.type !== 'Квартира') n++;
    if (CF.rooms.length) n++;
    if (CF.priceMin != null || CF.priceMax != null) n++;
    if (CF.areaMin != null || CF.areaMax != null) n++;
    if (CF.dueSel.length) n++;
    return n;
  }

  /* Update the toolbar filter button badge + the modal's apply-button count. */
  function updateFilterUI(total) {
    if (total == null) total = catalogList().length;
    var n = activeFilterCount();
    var fbtn = pBody.querySelector('.pp-filter-btn');
    if (fbtn) fbtn.classList.toggle('pp-filter-btn--on', n > 0);
    var cnt = pBody.querySelector('.pp-filter-count');
    if (cnt) { cnt.textContent = n; cnt.hidden = n === 0; }
    var apply = pBody.querySelector('.pp-fmodal__apply');
    if (apply) apply.textContent = total
      ? ('Показать ' + total + ' ' + plural(total, 'вариант', 'варианта', 'вариантов'))
      : 'Ничего не найдено';
  }

  function openFilterModal() {
    var m = pBody.querySelector('.pp-fmodal');
    if (!m) return;
    m.hidden = false;
    requestAnimationFrame(function () { m.classList.add('is-open'); });
  }
  function closeFilterModal() {
    var m = pBody.querySelector('.pp-fmodal');
    if (!m) return;
    m.classList.remove('is-open');
    setTimeout(function () { m.hidden = true; }, 220);
  }

  function resetCatalog() {
    var sort = CF.sort, view = CF.view;
    CF = defaultFilter(); CF.sort = sort; CF.view = view;
    pBody.querySelectorAll('.pp-dd-input').forEach(function (i) { i.value = ''; });
    pBody.querySelectorAll('.pp-dd-chip').forEach(function (c) { c.classList.remove('pp-dd-chip--on'); });
    pBody.querySelectorAll('.pp-dd-due').forEach(function (c) { c.checked = false; });
    pBody.querySelectorAll('.pp-dd-room').forEach(function (b) { b.classList.remove('pp-dd-room--on'); });
    var qt = pBody.querySelector('input[name="ddType"][value="Квартира"]'); if (qt) qt.checked = true;
    var qc = pBody.querySelector('input[name="ddCity"][value="Ташкент"]'); if (qc) qc.checked = true;
    renderCatalog();
  }

  /* On catalog open, push any preset (e.g. rooms) onto the modal controls. */
  function syncFilterUI() {
    if (!CF || !pBody.querySelector('.pp-fmodal')) return;
    CF.rooms.forEach(function (r) {
      var b = pBody.querySelector('.pp-dd-room[data-room="' + r + '"]');
      if (b) b.classList.add('pp-dd-room--on');
    });
    var aMin = pBody.querySelector('#ddAreaMin'), aMax = pBody.querySelector('#ddAreaMax');
    if (aMin && CF.areaMin != null) aMin.value = CF.areaMin;
    if (aMax && CF.areaMax != null) aMax.value = CF.areaMax;
    var pMin = pBody.querySelector('#ddPriceMin'), pMax = pBody.querySelector('#ddPriceMax');
    if (pMin && CF.priceMin != null) pMin.value = mln(CF.priceMin);
    if (pMax && CF.priceMax != null) pMax.value = mln(CF.priceMax);
    updateFilterUI();
  }

  /* Build the filter modal (all filters inside one dialog). */
  function catalogFilterModalHtml() {
    var dues = UNITS.map(function (u) { return u.due; })
                    .filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
    var dueRows = dues.map(function (d) {
      return '<label class="pp-dd-check"><input type="checkbox" class="pp-dd-due" value="' + d + '"><span>Сдача ' + d + '</span></label>';
    }).join('');
    var roomChips = [1,2,3,4].map(function (r) {
      return '<button type="button" class="pp-dd-room" data-room="'+r+'">'+r+'-комн.</button>';
    }).join('');

    function grp(title, body) {
      return '<div class="pp-fgroup"><div class="pp-fgroup__t">'+title+'</div>'+body+'</div>';
    }

    return '<div class="pp-fmodal" hidden>'+
      '<div class="pp-fmodal__backdrop" data-fclose></div>'+
      '<div class="pp-fmodal__sheet" role="dialog" aria-modal="true" aria-label="Фильтры">'+
        '<div class="pp-fmodal__head">'+
          '<h3 class="pp-fmodal__title">Фильтры</h3>'+
          '<button type="button" class="pp-fmodal__close" data-fclose aria-label="Закрыть">'+I.close+'</button>'+
        '</div>'+
        '<div class="pp-fmodal__body">'+
          grp('Город',
            '<div class="pp-fradios">'+
              '<label class="pp-dd-radio"><input type="radio" name="ddCity" value="Ташкент" checked><span>Ташкент</span></label>'+
            '</div>'+
            '<div class="pp-dd-hint">Другие города — скоро</div>')+
          grp('Тип недвижимости',
            '<div class="pp-fradios">'+
              '<label class="pp-dd-radio"><input type="radio" name="ddType" value="Квартира" checked><span>Квартира</span></label>'+
              '<label class="pp-dd-radio"><input type="radio" name="ddType" value="Офис"><span>Офис</span></label>'+
              '<label class="pp-dd-radio"><input type="radio" name="ddType" value="Коммерция"><span>Коммерческое</span></label>'+
            '</div>')+
          grp('Комнатность', '<div class="pp-dd-rooms">'+roomChips+'</div>')+
          grp('Цена, млн UZS',
            '<div class="pp-dd-range">'+
              '<input class="pp-dd-input" id="ddPriceMin" type="number" inputmode="numeric" placeholder="от" min="0">'+
              '<span class="pp-dd-dash">—</span>'+
              '<input class="pp-dd-input" id="ddPriceMax" type="number" inputmode="numeric" placeholder="до" min="0">'+
            '</div>'+
            '<div class="pp-dd-presets pp-price-presets">'+
              '<button type="button" class="pp-dd-chip" data-pmin="" data-pmax="900">до 900</button>'+
              '<button type="button" class="pp-dd-chip" data-pmin="900" data-pmax="1500">900–1500</button>'+
              '<button type="button" class="pp-dd-chip" data-pmin="1500" data-pmax="">от 1500</button>'+
            '</div>')+
          grp('Площадь, м²',
            '<div class="pp-dd-range">'+
              '<input class="pp-dd-input" id="ddAreaMin" type="number" inputmode="numeric" placeholder="от" min="0">'+
              '<span class="pp-dd-dash">—</span>'+
              '<input class="pp-dd-input" id="ddAreaMax" type="number" inputmode="numeric" placeholder="до" min="0">'+
            '</div>')+
          grp('Срок сдачи', '<div class="pp-fchecks">'+dueRows+'</div>')+
        '</div>'+
        '<div class="pp-fmodal__foot">'+
          '<button type="button" class="pp-freset">Сбросить всё</button>'+
          '<button type="button" class="pp-fmodal__apply">Показать варианты</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }

  /* Catalog page */
  function tplCatalogPage(filterRooms) {
    CF = defaultFilter();
    if (filterRooms) CF.rooms = [filterRooms];
    var list  = catalogList();
    var total = list.length;
    var shown = Math.min(CF.shown, total);
    var cards = list.slice(0, shown).map(aptCardHtml).join('');

    return '<div class="pp-catalog-wrap">'+
      '<div class="pp-catalog-head">'+
        '<h1 class="pp-catalog-title">Выбрать квартиру</h1>'+
        '<span class="pp-catalog-badge">'+total+' '+plural(total, 'планировка', 'планировки', 'планировок')+'</span>'+
      '</div>'+
      '<div class="pp-catalog-toolbar">'+
        '<div class="pp-sort">'+
          '<span class="pp-sort__label">Сортировка</span>'+
          '<div class="pp-seg pp-sorts" role="group" aria-label="Сортировка">'+
            '<button class="pp-sbtn pp-sbtn--on" data-sort="">По умолчанию</button>'+
            '<button class="pp-sbtn" data-sort="due">Срок сдачи</button>'+
            '<button class="pp-sbtn" data-sort="price-asc">Цена ↑</button>'+
            '<button class="pp-sbtn" data-sort="price-desc">Цена ↓</button>'+
          '</div>'+
        '</div>'+
        '<div class="pp-toolbar-right">'+
          '<button type="button" class="pp-filter-btn" aria-haspopup="dialog">'+I.flt+'<span>Фильтры</span><span class="pp-filter-count" hidden>0</span></button>'+
        '</div>'+
      '</div>'+
      '<div class="pp-proj-banner" style="background-image:linear-gradient(to right,rgba(0,0,0,.65) 0%,rgba(0,0,0,.2) 60%,rgba(0,0,0,.4) 100%),url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80)">'+
        '<div class="pp-proj-banner__l">'+
          '<h3 class="pp-proj-banner__name">Sky Gardens</h3>'+
          '<p class="pp-proj-banner__addr"><span class="ic ic--location" style="width:.9em;height:.9em;margin-right:.3em;vertical-align:middle"></span>г. Ташкент, Мирзо-Улугбекский район, просп. Амира Темура</p>'+
          '<span class="badge">Бизнес</span>'+
        '</div>'+
        '<div class="pp-proj-banner__r">'+
          '<button class="btn btn--ghost btn--sm" id="catalogCb">'+'<span class="ic ic--call"></span>'+' Оставить заявку</button>'+
          '<button class="btn btn--ghost btn--sm" id="catalogProjBtn">'+'<span class="ic ic--buildings"></span>'+' Подробнее о ЖК</button>'+
        '</div>'+
      '</div>'+
      '<div class="pp-apt-grid" id="aptGrid">'+cards+'</div>'+
      '<div class="pp-catalog-empty" hidden>'+
        '<div class="pp-catalog-empty__icon">'+I.flt+'</div>'+
        '<div class="pp-catalog-empty__t">Ничего не найдено</div>'+
        '<p class="pp-catalog-empty__p">Попробуйте смягчить условия фильтра или сбросьте их.</p>'+
        '<button type="button" class="btn btn--outline pp-empty-reset">Сбросить фильтры</button>'+
      '</div>'+
      '<div class="pp-catalog-paging">'+
        '<span class="pp-catalog-count">Показано '+shown+' из '+total+'</span>'+
        '<div class="pp-prog"><div class="pp-prog__fill" style="width:'+(total?Math.round(shown/total*100):0)+'%"></div></div>'+
      '</div>'+
      '<button class="btn btn--outline btn--block pp-catalog-more"'+(shown<total?'':' style="display:none"')+'>Показать ещё</button>'+
      catalogFilterModalHtml()+
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
          '<div class="pp-plan-bar">'+
            '<div class="pp-plan-bar__id">'+
              '<span class="pp-plan-bar__rooms">'+u.rooms+'-комнатная</span>'+
              '<span class="pp-plan-bar__sq">'+u.area.toFixed(2)+' м²</span>'+
            '</div>'+
            '<div class="pp-finish-tabs" role="tablist" aria-label="Тип отделки">'+
              '<button class="pp-finish-tab pp-finish-tab--on" role="tab" aria-selected="true" data-note="Бетонная стяжка, разводка электрики и сантехники, оштукатуренные стены. Готово под ваш ремонт.">Черновая</button>'+
              '<button class="pp-finish-tab" role="tab" aria-selected="false" data-note="Под ключ: чистовые полы, обои или покраска, межкомнатные двери, установленная сантехника и розетки.">Чистовая</button>'+
            '</div>'+
          '</div>'+
          '<p class="pp-finish-note" id="finishNote">Бетонная стяжка, разводка электрики и сантехники, оштукатуренные стены. Готово под ваш ремонт.</p>'+
          '<div class="pp-apt-detail__plan">'+detailFloorSVG(u.rooms, u.area)+'</div>'+
          '<div class="pp-plan-facts">'+
            '<div class="pp-fact"><span class="pp-fact__label">Этаж</span><span class="pp-fact__val">'+u.floor+'/'+u.totF+'</span></div>'+
            '<div class="pp-fact"><span class="pp-fact__label">Потолки</span><span class="pp-fact__val">3,0 м</span></div>'+
            '<div class="pp-fact"><span class="pp-fact__label">Подъезд</span><span class="pp-fact__val">'+u.ent+'</span></div>'+
            '<div class="pp-fact"><span class="pp-fact__label">Сдача</span><span class="pp-fact__val">'+u.due+'</span></div>'+
          '</div>'+
          '<div class="pp-expl-wrap">'+
            '<div class="pp-expl-title">Экспликация помещений</div>'+
            aptExplication(u.rooms, u.area)+
          '</div>'+
        '</div>'+
        '<div class="pp-apt-detail__right">'+
          '<div class="pp-apt-detail__price">'+fmtU(u.price)+'<span class="pp-apt-detail__cur"> UZS</span></div>'+
          '<div class="pp-price-row">'+
            '<span class="pp-apt-detail__oldprice">'+fmtU(u.oldP)+' UZS</span>'+
            '<span class="pp-disc-badge">−'+Math.round((u.oldP-u.price)/u.oldP*100)+'%</span>'+
          '</div>'+
          '<div class="pp-save"><span class="ic ic--flash"></span>Выгода '+fmtU(u.oldP-u.price)+' UZS</div>'+
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
          '<button class="btn btn--primary btn--lg btn--block" id="aptBuyBtn">'+'<span class="ic ic--call"></span>'+' Купить онлайн</button>'+
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
          '<button class="btn btn--ghost btn--sm" id="aptBannerCb">'+'<span class="ic ic--call"></span>'+' Оставить заявку</button>'+
          '<button class="btn btn--ghost btn--sm" data-uid="'+u.id+'" id="aptBannerProjBtn">'+'<span class="ic ic--buildings"></span>'+' Подробнее о ЖК</button>'+
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
    else if (!panel.hidden && pBody.querySelector('.pp-fmodal:not([hidden])')) closeFilterModal();
    else if (!panel.hidden) goBack();
  });

})();





