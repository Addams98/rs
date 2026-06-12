/* ============================================================
   RÉVEIL SPIRITUEL — Proposition 7 Script
   ============================================================ */
(function () {
  'use strict';

  // === Page loader ===
  window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 350);
  });

  // === Navbar scroll ===
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // === Hamburger ===
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // === Gold particles in hero ===
  const particlesEl = document.getElementById('heroParticles');
  if (particlesEl) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'h-particle';
      const size = Math.random() * 2.5 + 1;
      p.style.cssText = `
        left:${Math.random() * 100}%;
        bottom:${Math.random() * 40}%;
        width:${size}px; height:${size}px;
        animation-duration:${Math.random() * 12 + 8}s;
        animation-delay:${Math.random() * 12}s;
      `;
      particlesEl.appendChild(p);
    }
  }

  // === Reveal on scroll ===
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => io.observe(el));

  // === Stagger index ===
  document.querySelectorAll('.stagger').forEach((el, i) => {
    el.style.setProperty('--si', i % 5);
  });

  // === Animated counters ===
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target || 0, 10);
      const duration = 2000;
      const startTime = performance.now();
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString('fr-FR');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

  // === Active nav link ===
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === page) link.classList.add('active');
  });

  // === Progress bars ===
  const pbio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.progress-fill');
        if (fill) {
          const w = fill.style.width;
          fill.style.width = '0';
          requestAnimationFrame(() => { fill.style.width = w; });
        }
        pbio.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-bar').forEach(el => pbio.observe(el));

  // === Smooth scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // === Back to top ===
  const topBtn = document.createElement('button');
  topBtn.id = 'back-top';
  topBtn.innerHTML = '<i class="fa fa-chevron-up"></i>';
  topBtn.setAttribute('aria-label', 'Retour en haut');
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // === Newsletter form ===
  const nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input[type="email"]');
      const btn = nlForm.querySelector('button[type="submit"]');
      const success = nlForm.closest('.newsletter-section')?.querySelector('.newsletter-success');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa fa-check"></i> Inscrit !';
      input.value = '';
      if (success) success.classList.add('visible');
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = 'S\'abonner <i class="fa fa-paper-plane"></i>';
        if (success) success.classList.remove('visible');
      }, 5000);
    });
  }

  // === Contact form ===
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const success = document.querySelector('.form-success');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa fa-check"></i> Envoyé !';
      btn.style.background = '#10b981';
      if (success) success.classList.add('visible');
      contactForm.reset();
    });
  }

  // === FAQ Accordion ===
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // === Carousel engine ===
  function initCarousel(wrap) {
    const track    = wrap.querySelector('.carousel-track');
    const slides   = wrap.querySelectorAll('.carousel-slide');
    const btnPrev  = wrap.querySelector('.carousel-btn-prev');
    const btnNext  = wrap.querySelector('.carousel-btn-next');
    const dotsWrap = wrap.querySelector('.carousel-dots');
    if (!track || slides.length === 0) return;

    let current = 0, autoTimer;
    let perView = getPerView();
    let total   = Math.max(1, slides.length - perView + 1);

    function getPerView() {
      if (window.innerWidth <= 580) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < Math.ceil(slides.length / perView); i++) {
        const d = document.createElement('button');
        d.className = 'c-dot' + (Math.floor(current / perView) === i ? ' active' : '');
        d.setAttribute('aria-label', 'Diapositive ' + (i + 1));
        d.addEventListener('click', () => goTo(i * perView));
        dotsWrap.appendChild(d);
      }
    }
    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === Math.floor(current / perView)));
    }
    function goTo(idx) {
      perView = getPerView(); total = Math.max(1, slides.length - perView + 1);
      current = Math.max(0, Math.min(idx, total - 1));
      const gap = 20, slideW = track.parentElement.offsetWidth;
      const cardW = (slideW - gap * (perView - 1)) / perView;
      track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
      if (btnPrev) btnPrev.disabled = current === 0;
      if (btnNext) btnNext.disabled = current >= total - 1;
      updateDots();
    }
    if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
    });
    function startAuto() { autoTimer = setInterval(() => goTo(current + 1 >= total ? 0 : current + 1), 5500); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();
    window.addEventListener('resize', () => {
      perView = getPerView(); total = Math.max(1, slides.length - perView + 1);
      current = Math.min(current, total - 1);
      buildDots(); goTo(current);
    }, { passive: true });
    buildDots(); goTo(0);
  }
  document.querySelectorAll('.carousel-wrap').forEach(initCarousel);

})();
