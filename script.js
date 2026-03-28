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
    this.injectDynamicStyles();
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
    const saved = localStorage.getItem('colosseum-theme');
    const initial = saved || 'dark';
    this.applyTheme(initial, themeIcon);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next    = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next, themeIcon);
      localStorage.setItem('colosseum-theme', next);
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
    signupBtn.addEventListener('click', () => {
      const emailInput = modal.querySelector('input[type="email"]');
      const email = emailInput?.value?.trim();
      if (email && !email.includes('@')) {
        emailInput.style.borderColor = 'var(--error)';
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

  // ── Dynamic Styles (JS-created elements) ─────────────────
  injectDynamicStyles() {
    const css = `
      /* Scroll progress */
      .scroll-progress-bar {
        position: fixed;
        top: 0; left: 0;
        height: 2.5px;
        background: linear-gradient(90deg, var(--primary-500), var(--secondary-400));
        z-index: 200;
        transition: width 0.15s linear;
        border-radius: 0 2px 2px 0;
        pointer-events: none;
      }

      /* Video modal */
      .video-modal,
      .pricing-modal {
        position: fixed;
        inset: 0;
        background: rgba(5, 2, 1, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.32s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .video-modal.active,
      .pricing-modal.active { opacity: 1; }

      .video-modal-content,
      .pricing-modal-content {
        background: var(--bg-secondary);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-2xl);
        padding: var(--space-8);
        max-width: 640px;
        width: 92%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.88) translateY(20px);
        transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
        font-family: var(--font-family-primary);
        box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,73,26,0.15);
      }

      .pricing-modal-content { max-width: 480px; }

      .video-modal.active .video-modal-content,
      .pricing-modal.active .pricing-modal-content { transform: scale(1) translateY(0); }

      .video-modal-close,
      .pricing-modal-close {
        position: absolute;
        top: var(--space-4);
        inset-inline-end: var(--space-4);
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        font-size: var(--font-size-xl);
        cursor: pointer;
        color: var(--text-secondary);
        width: 34px; height: 34px;
        border-radius: var(--radius-lg);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-family-primary);
        transition: all 0.2s ease;
      }

      .video-modal-close:hover,
      .pricing-modal-close:hover {
        background: var(--primary-800);
        border-color: var(--primary-500);
        color: var(--gray-50);
      }

      .video-placeholder-large {
        text-align: center;
        padding: var(--space-10);
        background: linear-gradient(135deg, rgba(196,73,26,0.08), rgba(201,136,18,0.06));
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
      }

      .video-placeholder-large h3 {
        font-family: var(--font-family-primary);
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--space-2);
        color: var(--text-primary);
      }

      .video-placeholder-large p {
        font-family: var(--font-family-primary);
        color: var(--text-secondary);
        margin-bottom: var(--space-8);
        font-size: var(--font-size-lg);
      }

      .demo-steps {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-3);
        margin-bottom: var(--space-8);
      }

      .demo-step {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        transition: all 0.2s ease;
        font-family: var(--font-family-primary);
      }

      .demo-step:hover {
        border-color: var(--primary-700);
        background: rgba(196,73,26,0.08);
      }

      .step-number {
        width: 32px; height: 32px;
        background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
        color: var(--gray-50);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-family-primary);
        font-weight: var(--font-weight-black);
        font-size: var(--font-size-base);
        flex-shrink: 0;
        box-shadow: 0 3px 10px rgba(196,73,26,0.4);
      }

      .step-text {
        font-family: var(--font-family-primary);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        font-size: var(--font-size-base);
      }

      .demo-features-preview {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-2);
      }

      .feature-preview {
        font-family: var(--font-family-primary);
        padding: var(--space-2) var(--space-3);
        background: rgba(196,73,26,0.07);
        border: 1px solid rgba(196,73,26,0.15);
        border-radius: var(--radius-lg);
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        text-align: center;
      }

      /* Pricing modal */
      .pricing-modal-header {
        text-align: center;
        margin-bottom: var(--space-6);
      }

      .pricing-modal-header h3 {
        font-family: var(--font-family-primary);
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--space-2);
        color: var(--text-primary);
      }

      .pricing-modal-header p {
        font-family: var(--font-family-primary);
        color: var(--text-secondary);
      }

      .signup-form { margin-bottom: var(--space-5); }

      .signup-input {
        width: 100%;
        padding: var(--space-4);
        border: 1.5px solid var(--border-color);
        border-radius: var(--radius-xl);
        font-family: var(--font-family-primary);
        font-size: var(--font-size-base);
        margin-bottom: var(--space-3);
        background: var(--bg-tertiary);
        color: var(--text-primary);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        text-align: start;
      }

      .signup-input:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(196,73,26,0.15);
      }

      .signup-btn {
        width: 100%;
        padding: var(--space-4);
        background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
        color: var(--gray-50);
        border: none;
        border-radius: var(--radius-xl);
        font-family: var(--font-family-primary);
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-bold);
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        box-shadow: 0 5px 18px rgba(196,73,26,0.4);
      }

      .signup-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(196,73,26,0.55);
      }

      .signup-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
      }

      .pricing-benefits {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-4);
        background: rgba(196,73,26,0.05);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
      }

      .benefit {
        font-family: var(--font-family-primary);
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
      }

      .benefit::before { color: var(--success); font-weight: 900; }

      /* Toast */
      .success-toast {
        position: fixed;
        top: var(--space-8);
        inset-inline-end: var(--space-6);
        background: linear-gradient(135deg, var(--primary-700), var(--primary-900));
        border: 1px solid var(--primary-500);
        color: var(--gray-50);
        font-family: var(--font-family-primary);
        font-weight: var(--font-weight-semibold);
        padding: var(--space-4) var(--space-6);
        border-radius: var(--radius-xl);
        box-shadow: 0 8px 28px rgba(196,73,26,0.45);
        z-index: 2000;
        transform: translateX(calc(100% + 40px));
        transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        max-width: 320px;
      }

      .success-toast.active { transform: translateX(0); }

      /* Responsive */
      @media (max-width: 640px) {
        .demo-steps          { grid-template-columns: 1fr; }
        .demo-features-preview { grid-template-columns: 1fr; }
        .success-toast { inset-inline-end: var(--space-3); inset-inline-start: var(--space-3); max-width: none; }
      }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => new Colosseum());
