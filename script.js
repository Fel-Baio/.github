// ─────────────────────────────────────────────────────────────
//  Colosseum — Landing Page Script
//  Palette: Terracotta · Aged Gold · Warm Stone
//  Font: Tajawal (RTL Arabic-first)
// ─────────────────────────────────────────────────────────────

class Colosseum {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createParticles();
    this.initThemeToggle();
    this.initMobileMenu();
    this.initScrollEffects();
    this.initRevealObserver();
    this.initSmoothScroll();
    this.initCounterAnimation();
    // Dynamic styles are in styles.css
  }

  // ── Event Listeners ──────────────────────────────────────
  setupEventListeners() {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const watchDemoBtn  = document.getElementById('watchDemoBtn');
    const playDemo      = document.getElementById('playDemo');
    const modalClose    = document.getElementById('modalClose');

    if (getStartedBtn) getStartedBtn.addEventListener('click', () => this.handleGetStarted());
    if (watchDemoBtn)  watchDemoBtn.addEventListener('click',  () => this.createVideoModal());
    if (playDemo)      playDemo.addEventListener('click',      () => this.createVideoModal());
    if (modalClose)    modalClose.addEventListener('click',    () => this.closeModal());

    // Modal backdrop click
    const successModal = document.getElementById('successModal');
    if (successModal) {
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) this.closeModal();
      });
    }

    // Pricing buttons
    document.querySelectorAll('.pricing-cta').forEach(btn => {
      btn.addEventListener('click', (e) => this.handlePricingClick(e));
    });

    // CTA large button
    const ctaLarge = document.querySelector('.cta-primary-large');
    if (ctaLarge) ctaLarge.addEventListener('click', () => this.handleGetStarted());

    // Modal CTA
    const modalCta = document.querySelector('.modal-cta');
    if (modalCta) modalCta.addEventListener('click', () => this.closeModal());

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    // Resize
    window.addEventListener('resize', this.debounce(() => {
      const pc = document.getElementById('particles');
      if (pc) { pc.innerHTML = ''; this.createParticles(); }
    }, 400));
  }

  // ── Particles (terracotta / gold sparks) ─────────────────
  createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 22 : 44;
    const colors = [
      '#C4491A', '#D65A22', '#E07038',
      '#C98812', '#E2A11E', '#E8B830',
      '#8B6132', '#A67B4C',
    ];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 2 + 1}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        opacity: ${Math.random() * 0.5 + 0.2};
        animation-delay: ${Math.random() * 12}s;
        animation-duration: ${Math.random() * 8 + 8}s;
      `;
      container.appendChild(p);
    }
  }

  // ── Theme Toggle (dark default → toggle to light) ────────
  initThemeToggle() {
    const toggle   = document.getElementById('themeToggle');
    const themeIcon = toggle?.querySelector('.theme-icon');
    if (!toggle) return;

    // Dark is default; respect saved preference
    let saved = 'dark';
    try { saved = localStorage.getItem('colosseum-theme') || 'dark'; } catch (_) { /* unavailable */ }
    const initial = saved;
    this.applyTheme(initial, themeIcon);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next    = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next, themeIcon);
      try { localStorage.setItem('colosseum-theme', next); } catch (_) { /* unavailable */ }
    });
  }

  applyTheme(theme, iconEl) {
    document.documentElement.setAttribute('data-theme', theme);
    if (iconEl) {
      iconEl.style.transform = 'scale(0) rotate(90deg)';
      setTimeout(() => {
        iconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
        iconEl.style.transform = 'scale(1) rotate(0deg)';
        iconEl.style.transition = 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)';
      }, 150);
    }
  }

  // ── Mobile Menu ───────────────────────────────────────────
  initMobileMenu() {
    const toggle  = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!toggle || !navMenu) return;

    toggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('mobile-open');
      navMenu.classList.toggle('mobile-open', !isOpen);
      toggle.classList.toggle('active', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Scroll Effects ────────────────────────────────────────
  initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          navbar.classList.toggle('scrolled', y > 80);

          // Hide navbar on scroll down, reveal on scroll up
          if (y > lastY && y > 180) {
            navbar.style.transform = 'translateY(-100%)';
          } else {
            navbar.style.transform = 'translateY(0)';
          }
          lastY = y;

          // Scroll progress bar
          this.updateScrollProgress(y);

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateScrollProgress(scrollY) {
    let bar = document.querySelector('.scroll-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
    }
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(scrollY / total) * 100}%` : '0%';
  }

  // ── Reveal on Scroll ──────────────────────────────────────
  initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── Smooth Scroll for anchor links ───────────────────────
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
      });
    });
  }

  // ── Counter Animation ─────────────────────────────────────
  initCounterAnimation() {
    const statEls = document.querySelectorAll('.stat-number[data-count]');
    if (!statEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = el.getAttribute('data-count');
        if (!target) return;

        const hasPlus  = target.includes('+');
        const isPct    = target.includes('%');
        const num      = parseFloat(target.replace(/[^0-9.]/g, ''));
        const isFloat  = target.replace(/[^0-9.]/g, '').includes('.');
        const duration = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          const val = num * eased;
          const locale = document.documentElement.lang || 'ar';
          let display = isFloat
            ? val.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
            : Math.floor(val).toLocaleString(locale);
          if (hasPlus) display += '+';
          if (isPct)   display += '%';
          el.textContent = display;
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.6 });

    statEls.forEach(el => observer.observe(el));
  }

  // ── Button Actions ────────────────────────────────────────
  handleGetStarted() {
    this.showLoading();
    setTimeout(() => {
      this.hideLoading();
      this.showModal();
    }, 1600);
  }

  handlePricingClick(e) {
    const card = e.currentTarget.closest('.pricing-card');
    const plan = card?.querySelector('.pricing-title')?.textContent?.trim() || 'البرنامج';
    this.showLoading();
    setTimeout(() => {
      this.hideLoading();
      this.showPricingModal(plan);
    }, 1200);
  }

  // ── Modals ────────────────────────────────────────────────
  showModal() {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  showLoading() {
    const el = document.getElementById('loadingScreen');
    if (el) el.classList.add('active');
  }

  hideLoading() {
    const el = document.getElementById('loadingScreen');
    if (el) el.classList.remove('active');
  }

  createVideoModal() {
    if (document.querySelector('.video-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close" aria-label="إغلاق">&times;</button>
        <div class="video-placeholder-large">
          <h3>🏛️ عرض لينك تري برو</h3>
          <p>شاهد كم هو سهل إنشاء صفحة روابطك الرائعة في دقائق!</p>
          <div class="demo-steps">
            <div class="demo-step"><span class="step-number">١</span><span class="step-text">اختر قالبك</span></div>
            <div class="demo-step"><span class="step-number">٢</span><span class="step-text">أضف روابطك</span></div>
            <div class="demo-step"><span class="step-number">٣</span><span class="step-text">خصّص أسلوبك</span></div>
            <div class="demo-step"><span class="step-number">٤</span><span class="step-text">انشر في ثوانٍ!</span></div>
          </div>
          <div class="demo-features-preview">
            <div class="feature-preview">✨ رسوم متحركة جميلة</div>
            <div class="feature-preview">📱 يقدّم الجوال أولاً</div>
            <div class="feature-preview">🎨 تخصيص غير محدود</div>
            <div class="feature-preview">📊 تحليلات فورية</div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('active'));

    const close = () => {
      modal.classList.remove('active');
      setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 320);
    };

    modal.querySelector('.video-modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  showPricingModal(plan) {
    if (document.querySelector('.pricing-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'pricing-modal';
    modal.innerHTML = `
      <div class="pricing-modal-content">
        <button class="pricing-modal-close" aria-label="إغلاق">&times;</button>
        <div class="pricing-modal-header">
          <h3>🚀 ابدأ مع ${plan}</h3>
          <p>خطوة واحدة تفصلك عن صفحة روابطك الرائعة!</p>
        </div>
        <div class="pricing-modal-body">
          <div class="signup-form">
            <input type="email" placeholder="أدخل بريدك الإلكتروني" class="signup-input" dir="ltr">
            <input type="text" placeholder="اختر اسم المستخدم" class="signup-input">
            <button class="signup-btn">إنشاء صفحتي ←</button>
          </div>
          <div class="pricing-benefits">
            <div class="benefit">✓ تجربة مجانية ١٤ يوماً</div>
            <div class="benefit">✓ لا حاجة لبطاقة ائتمان</div>
            <div class="benefit">✓ إلغاء في أي وقت</div>
            <div class="benefit">✓ دعم على مدار الساعة</div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('active'));

    const close = () => {
      modal.classList.remove('active');
      setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 320);
    };

    modal.querySelector('.pricing-modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    const signupBtn = modal.querySelector('.signup-btn');
    // Accessible live region for validation errors
    const liveRegion = document.createElement('span');
    liveRegion.setAttribute('role', 'alert');
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.className = 'form-error-msg';
    liveRegion.style.display = 'none';
    signupBtn.insertAdjacentElement('beforebegin', liveRegion);

    signupBtn.addEventListener('click', () => {
      const emailInput = modal.querySelector('input[type="email"]');
      const email = emailInput?.value?.trim() || '';
      // RFC-5321 simplified pattern — rejects obvious invalids
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (email && !validEmail) {
        emailInput.classList.add('input-error');
        liveRegion.style.display = 'block';
        liveRegion.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
        emailInput.addEventListener('input', () => {
          emailInput.classList.remove('input-error');
          liveRegion.style.display = 'none';
        }, { once: true });
        return;
      }
      signupBtn.textContent = 'جاري الإنشاء...';
      signupBtn.disabled = true;
      setTimeout(() => {
        close();
        setTimeout(() => this.showToast(`أهلاً بك في ${plan}! 🎉`), 320);
      }, 1800);
    });
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('active'));
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  // ── Utilities ─────────────────────────────────────────────
  debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

}

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => new Colosseum());
