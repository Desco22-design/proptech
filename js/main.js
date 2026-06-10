/* ============================================================
   PropTech — UI behaviour: carousel, nav, lang, form, reveal
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Hero carousel ---------- */
  const track = document.getElementById("promoTrack");
  if (track) {
    const slides = track.children.length;
    const dotsWrap = document.getElementById("promoDots");
    let index = 0;
    let timer;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("button");
      dot.className = "promo__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Слайд ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      dotsWrap.appendChild(dot);
    }
    const dots = Array.from(dotsWrap.children);

    function go(i) {
      index = (i + slides) % slides;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
      restart();
    }
    function next() { go(index + 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    document.getElementById("promoNext").addEventListener("click", () => go(index + 1));
    document.getElementById("promoPrev").addEventListener("click", () => go(index - 1));

    const promo = document.getElementById("promo");
    promo.addEventListener("mouseenter", () => clearInterval(timer));
    promo.addEventListener("mouseleave", restart);
    restart();
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest(".nav__link")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Language dropdown ---------- */
  const lang = document.getElementById("lang");
  const langToggle = lang.querySelector(".lang__toggle");
  langToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = lang.classList.toggle("is-open");
    langToggle.setAttribute("aria-expanded", String(open));
  });
  lang.querySelectorAll(".lang__option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const img = langToggle.querySelector(".lang__flag img");
      img.src = opt.dataset.flagSrc;
      img.alt = opt.dataset.flagAlt;
      lang.classList.remove("is-open");
      langToggle.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", () => lang.classList.remove("is-open"));

  /* ---------- Office selection ---------- */
  document.querySelectorAll(".office").forEach((o) => {
    o.addEventListener("click", () => {
      document.querySelectorAll(".office").forEach((x) => x.classList.remove("is-active"));
      o.classList.add("is-active");
    });
  });

  /* ---------- Callback form: phone mask + submit ---------- */
  const phone = document.getElementById("cbPhone");
  if (phone) {
    phone.addEventListener("input", () => {
      let d = phone.value.replace(/\D/g, "");
      if (d.startsWith("998")) d = d.slice(3);
      d = d.slice(0, 9);
      let out = "+998";
      if (d.length) out += " (" + d.slice(0, 2);
      if (d.length >= 2) out += ") " + d.slice(2, 5);
      if (d.length >= 5) out += "-" + d.slice(5, 7);
      if (d.length >= 7) out += "-" + d.slice(7, 9);
      phone.value = out;
    });
  }

  const form = document.getElementById("callbackForm");
  const status = document.getElementById("cbStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cbName").value.trim();
    const digits = phone.value.replace(/\D/g, "");
    if (!name) {
      status.style.color = "var(--ink-400)";
      status.textContent = "Пожалуйста, введите имя.";
      return;
    }
    if (digits.length < 12) {
      status.style.color = "var(--ink-400)";
      status.textContent = "Введите корректный номер телефона.";
      return;
    }
    status.style.color = "var(--success)";
    status.textContent = `Спасибо, ${name}! Мы перезвоним вам в ближайшее время.`;
    form.reset();
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
