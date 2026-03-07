document.addEventListener("DOMContentLoaded", () => {

  // ===== Overlay menu =====
  const menuBtn = document.querySelector(".menu-btn");
  const overlay = document.querySelector(".menu-overlay");
  const closeBtn = document.querySelector(".menu-close");
  const backdrop = document.querySelector(".menu-backdrop");

  const openMenu = () => {
    if (!overlay || !menuBtn) return;
    overlay.hidden = false;
    overlay.offsetHeight;
    overlay.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!overlay || !menuBtn) return;
    overlay.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    window.setTimeout(() => { overlay.hidden = true; }, 220);
  };

  if (menuBtn && overlay) {
    menuBtn.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    backdrop?.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) closeMenu();
    });
    overlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  // ===== Hero scroll indicator =====
  const scrollBtn = document.querySelector(".scroll-indicator");
  const scrollTarget = document.querySelector("#intro") || document.querySelector("#services");
  if (scrollBtn && scrollTarget) {
    scrollBtn.addEventListener("click", () => {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const updateVisibility = () => {
      scrollBtn.classList.toggle("is-hidden", (window.scrollY || 0) > 40);
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
  }

  // ===== Header hide on scroll =====
  const header = document.querySelector(".site-header");
  let lastY = window.scrollY || 0;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY || 0;
    const delta = y - lastY;
    if (Math.abs(delta) < 6) return;
    const menuOpen = overlay && !overlay.hidden;
    if (!menuOpen && header) {
      if (delta > 0 && y > 80) header.classList.add("is-hidden");
      if (delta < 0) header.classList.remove("is-hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  // ===== 1. FADE-IN AU SCROLL =====
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    const fadeEls = document.querySelectorAll(
      ".section-head, .feature-item, .card, .split > *, " +
      ".cta-bar, .photo-strip__grid img, .signatures-display img, " +
      ".stat-item, .founder-quote, .page-hero .container > *"
    );

    fadeEls.forEach((el, i) => {
      el.classList.add("will-fade");
      // Stagger siblings inside the same parent
      const siblings = [...el.parentElement.children].filter(c => c.classList.contains("will-fade"));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 80}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    fadeEls.forEach(el => observer.observe(el));
  }

  // ===== 2. KEN BURNS SLIDESHOW =====
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    let current = 0;
    const SLIDE_DURATION = 6000;   // ms per slide
    const FADE_DURATION  = 1600;   // matches CSS transition

    const goTo = (next) => {
      slides[current].classList.remove("hero-slide--active");
      // Reset animation so it replays on re-activation
      slides[next].style.animation = "none";
      slides[next].offsetHeight; // reflow
      slides[next].style.animation = "";
      slides[next].classList.add("hero-slide--active");
      current = next;
    };

    const advance = () => goTo((current + 1) % slides.length);

    // Auto-advance
    let timer = setInterval(advance, SLIDE_DURATION);

    // Pause on reduced motion
    if (prefersReduced) clearInterval(timer);

    // Pause when tab hidden to save resources
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(timer);
      else timer = setInterval(advance, SLIDE_DURATION);
    });
  }

  // ===== 3. COMPTEUR STATS =====
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (statNumbers.length && !prefersReduced) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();
        const isFloat = !Number.isInteger(target);

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = target * eased;
          el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        statsObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));
  }

});
