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

  function openPanel(html) {
    pBody.innerHTML = html;
    panel.hidden = false;
    requestAnimationFrame(function () {
      panel.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    wirePanelButtons();
  }

  function closePanel() {
    panel.classList.remove('is-open');
    setTimeout(function () {
      panel.hidden = true;
      pBody.innerHTML = '';
      document.body.style.overflow = '';
    }, 300);
  }

  pClose.addEventListener('click', closePanel);

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
        '<p class="pp-addr">📍 ' + addr + '</p>' +
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
        '<div class="pp-bank"><div class="pp-bank__name">Ипотека Банк</div><div class="pp-bank__rate">от 14% годовых</div><div class="pp-bank__term">до 20 лет · взнос от 20%</div></div>' +
        '<div class="pp-bank"><div class="pp-bank__name">Агробанк</div><div class="pp-bank__rate">от 15% годовых</div><div class="pp-bank__term">до 15 лет · взнос от 25%</div></div>' +
        '<div class="pp-bank"><div class="pp-bank__name">Халк Банк</div><div class="pp-bank__rate">от 16% годовых</div><div class="pp-bank__term">до 20 лет · взнос от 20%</div></div>' +
        '<div class="pp-bank"><div class="pp-bank__name">Узпромстройбанк</div><div class="pp-bank__rate">от 14.5% годовых</div><div class="pp-bank__term">до 25 лет · взнос от 15%</div></div>' +
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
        '<div class="pp-perk"><div class="pp-perk__icon">💼</div><h3>Комиссия до 3%</h3><p>Выплачиваем вознаграждение с каждой успешной сделки от суммы договора.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon">📊</div><h3>Личный кабинет</h3><p>Отслеживайте статус сделок, лиды и выплаты в режиме реального времени.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon">🎓</div><h3>Обучение</h3><p>Регулярные тренинги по продукту, технике продаж и работе с клиентами.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon">🤝</div><h3>Менеджер-куратор</h3><p>Персональный менеджер поможет на каждом этапе сделки.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon">📋</div><h3>Эксклюзивные материалы</h3><p>Презентации, прайсы и медиа-кит — всё для успешных показов.</p></div>' +
        '<div class="pp-perk"><div class="pp-perk__icon">⚡</div><h3>Быстрая регистрация</h3><p>Подключение к программе за один рабочий день.</p></div>' +
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
      ['panelCallbackBtn','panelCallbackBtn2','panelCallbackBtn3','panelCallbackBtn4'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', scrollCallback);
      });
      // Mortgage calculator
      if (document.getElementById('calcPrice')) {
        calcMortgage();
        ['calcPrice','calcDown','calcYears'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.addEventListener('input', calcMortgage);
        });
      }
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
      { e: '🏫', l: 'Школы и детсады' }, { e: '🏥', l: 'Поликлиники' },
      { e: '🛒', l: 'Супермаркеты' },    { e: '🚌', l: 'Транспорт' },
      { e: '🌳', l: 'Парки' },           { e: '🏋️', l: 'Фитнес-клубы' },
      { e: '☕', l: 'Кафе и рестораны' },{ e: '🏦', l: 'Банки' },
    ];
    return '<div class="m-infra">' +
      '<h2 class="m-infra__title">Готовая инфраструктура</h2>' +
      '<p class="m-infra__sub">Всё необходимое — рядом с каждым нашим ЖК</p>' +
      '<div class="m-infra__grid">' +
      items.map(function (i) {
        return '<div class="m-infra__item"><span class="m-infra__emoji">' + i.e + '</span><span>' + i.l + '</span></div>';
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
     Dispatch
  ───────────────────────────────────── */
  function dispatch(type, ds) {
    // Panel types
    if (type === 'project') { openPanel(tplProjectPage(ds)); return; }
    if (type === 'floors') {
      openPanel(tplProjectPage(ds));
      // Scroll to floor plans section after render
      setTimeout(function () {
        var sec = pBody.querySelector('.pp-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      }, 420);
      return;
    }
    if (type === 'promo')     { openPanel(tplPromoPage());     return; }
    if (type === 'mortgage')  { openPanel(tplMortgagePage());  return; }
    if (type === 'partners')  { openPanel(tplPartnersPage());  return; }
    if (type === 'online')    { openPanel(tplOnlinePage());    return; }

    // Small modal from within a panel (mortgage/promo)
    if (type === 'promo-panel') {
      // reuse promo page content but inside the current panel
      pBody.innerHTML = tplPromoPage();
      wirePanelButtons();
      pBody.scrollTop = 0;
      return;
    }

    // Small modal types
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
    else if (!panel.hidden) closePanel();
  });

})();
