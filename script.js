// LinkTree Pro - Modern Interactive Landing Page
// Enhanced with cutting-edge animations and interactions

class LinkTreePro {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.createParticles();
    this.initThemeToggle();
    this.initMobileMenu();
    this.initScrollEffects();
    this.initIntersectionObserver();
    this.initTypewriter();
    this.initCursorEffects();
    this.initSmoothScroll();
    this.initCounterAnimation();
    this.preloadAssets();
  }

  setupEventListeners() {
    // CTA Buttons
    const getStartedBtn = document.getElementById('getStartedBtn');
    const watchDemoBtn = document.getElementById('watchDemoBtn');
    const playDemo = document.getElementById('playDemo');
    const modalClose = document.getElementById('modalClose');

    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', this.handleGetStarted.bind(this));
    }

    if (watchDemoBtn) {
      watchDemoBtn.addEventListener('click', this.handleWatchDemo.bind(this));
    }

    if (playDemo) {
      playDemo.addEventListener('click', this.handlePlayDemo.bind(this));
    }

    if (modalClose) {
      modalClose.addEventListener('click', this.closeModal.bind(this));
    }

    // Pricing buttons
    const pricingCTAs = document.querySelectorAll('.pricing-cta');
    pricingCTAs.forEach(btn => {
      btn.addEventListener('click', this.handlePricingClick.bind(this));
    });

    // Demo links hover effects
    const demoLinks = document.querySelectorAll('.demo-link');
    demoLinks.forEach(link => {
      link.addEventListener('mouseenter', this.handleDemoLinkHover.bind(this));
      link.addEventListener('mouseleave', this.handleDemoLinkLeave.bind(this));
    });

    // Window events
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  initializeAnimations() {
    // Add loading animation
    document.body.classList.add('loading');
    
    // Remove loading after page loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('loading');
      }, 500);
    });

    // Initialize GSAP-like animations with vanilla JS
    this.animateOnScroll();
  }

  createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    if (!themeToggle) return;

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      this.setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Animate icon
      if (themeIcon) {
        themeIcon.style.transform = 'scale(0)';
        setTimeout(() => {
          themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
          themeIcon.style.transform = 'scale(1)';
        }, 150);
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('mobile-open');
      
      if (isOpen) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
      } else {
        navMenu.classList.add('mobile-open');
        mobileToggle.classList.add('active');
      }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll
      if (scrollY > lastScrollY && scrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }

      lastScrollY = scrollY;
    });
  }

  initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Animate feature cards with stagger
          if (entry.target.classList.contains('features-grid')) {
            const cards = entry.target.querySelectorAll('.feature-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, index * 100);
            });
          }

          // Animate pricing cards
          if (entry.target.classList.contains('pricing-grid')) {
            const cards = entry.target.querySelectorAll('.pricing-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              }, index * 150);
            });
          }
        }
      });
    }, observerOptions);

    // Observe elements
    const elementsToObserve = document.querySelectorAll('.features-grid, .pricing-grid, .demo-section, .cta-section');
    elementsToObserve.forEach(el => {
      observer.observe(el);
    });
  }

  initTypewriter() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
      const text = element.getAttribute('data-typewriter');
      const speed = parseInt(element.getAttribute('data-speed')) || 50;
      
      element.textContent = '';
      let i = 0;
      
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          element.classList.add('typing-complete');
        }
      }, speed);
    });
  }

  initCursorEffects() {
    if (window.innerWidth < 768) return; // Skip on mobile

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Add hover effects
    const hoverElements = document.querySelectorAll('button, a, .demo-link, .feature-card, .pricing-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
      });
    });
  }

  initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  handleGetStarted() {
    this.showLoading();
    
    setTimeout(() => {
      this.hideLoading();
      this.showModal();
    }, 2000);
  }

  handleWatchDemo() {
    this.createVideoModal();
  }

  handlePlayDemo() {
    this.createVideoModal();
  }

  handlePricingClick(e) {
    const button = e.target;
    const plan = button.closest('.pricing-card').querySelector('.pricing-title').textContent;
    
    this.showLoading();
    
    setTimeout(() => {
      this.hideLoading();
      this.showPricingModal(plan);
    }, 1500);
  }

  handleDemoLinkHover(e) {
    const link = e.target.closest('.demo-link');
    link.style.transform = 'translateY(-4px) scale(1.02)';
    
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    link.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  handleDemoLinkLeave(e) {
    const link = e.target.closest('.demo-link');
    link.style.transform = 'translateY(0) scale(1)';
  }

  handleScroll() {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / documentHeight;
    
    // Update progress bar if exists
    this.updateScrollProgress(scrollProgress);
    
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero && scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
  }

  handleResize() {
    // Recreate particles on resize
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      this.createParticles();
    }
  }

  handleKeyboard(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
      this.closeModal();
    }
    
    // Space to play demo
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      this.handlePlayDemo();
    }
  }

  showModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  showLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
      loading.classList.add('active');
    }
  }

  hideLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
      loading.classList.remove('active');
    }
  }

  createVideoModal() {
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close">&times;</button>
        <div class="video-container">
          <div class="video-placeholder-large">
            <h3>🎬 عرض لينك تري برو</h3>
            <p>شاهد كم هو سهل إنشاء صفحة روابطك الرائعة!</p>
            <div class="demo-steps">
              <div class="demo-step">
                <span class="step-number">1</span>
                <span class="step-text">اختر قالبك</span>
              </div>
              <div class="demo-step">
                <span class="step-number">2</span>
                <span class="step-text">أضف روابطك</span>
              </div>
              <div class="demo-step">
                <span class="step-number">3</span>
                <span class="step-text">خصّص أسلوبك</span>
              </div>
              <div class="demo-step">
                <span class="step-number">4</span>
                <span class="step-text">انشر في ثوانٍ!</span>
              </div>
            </div>
            <div class="demo-features-preview">
              <div class="feature-preview">✨ رسوم متحركة جميلة</div>
              <div class="feature-preview">📱 تصميم يُقدّم الجوال أولاً</div>
              <div class="feature-preview">🎨 تخصيص غير محدود</div>
              <div class="feature-preview">📊 تحليلات في الوقت الفعلي</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(videoModal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      videoModal.classList.add('active');
    }, 10);
    
    const closeBtn = videoModal.querySelector('.video-modal-close');
    closeBtn.addEventListener('click', () => {
      videoModal.classList.remove('active');
      setTimeout(() => {
        videoModal.remove();
        document.body.style.overflow = '';
      }, 300);
    });
  }

  showPricingModal(plan) {
    const pricingModal = document.createElement('div');
    pricingModal.className = 'pricing-modal';
    pricingModal.innerHTML = `
      <div class="pricing-modal-content">
        <button class="pricing-modal-close">&times;</button>
        <div class="pricing-modal-header">
          <h3>🚀 ابدأ مع ${plan}</h3>
          <p>أنت على بُعد خطوة واحدة من إنشاء صفحة روابطك الرائعة!</p>
        </div>
        <div class="pricing-modal-body">
          <div class="signup-form">
            <input type="email" placeholder="أدخل بريدك الإلكتروني" class="signup-input">
            <input type="text" placeholder="اختر اسم المستخدم" class="signup-input">
            <button class="signup-btn">إنشاء صفحتي</button>
          </div>
          <div class="pricing-benefits">
            <div class="benefit">✓ تجربة مجانية لمدة 14 يوماً</div>
            <div class="benefit">✓ لا حاجة لبطاقة ائتمان</div>
            <div class="benefit">✓ إلغاء في أي وقت</div>
            <div class="benefit">✓ دعم على مدار الساعة</div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(pricingModal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      pricingModal.classList.add('active');
    }, 10);
    
    const closeBtn = pricingModal.querySelector('.pricing-modal-close');
    closeBtn.addEventListener('click', () => {
      pricingModal.classList.remove('active');
      setTimeout(() => {
        pricingModal.remove();
        document.body.style.overflow = '';
      }, 300);
    });
    
    const signupBtn = pricingModal.querySelector('.signup-btn');
    signupBtn.addEventListener('click', () => {
      signupBtn.textContent = 'جاري الإنشاء...';
      signupBtn.disabled = true;
      
      setTimeout(() => {
        pricingModal.classList.remove('active');
        setTimeout(() => {
          pricingModal.remove();
          document.body.style.overflow = '';
          this.showSuccessMessage(`مرحباً بك في ${plan}! 🎉`);
        }, 300);
      }, 2000);
    });
  }

  showSuccessMessage(message) {
    const successToast = document.createElement('div');
    successToast.className = 'success-toast';
    successToast.textContent = message;
    
    document.body.appendChild(successToast);
    
    setTimeout(() => {
      successToast.classList.add('active');
    }, 10);
    
    setTimeout(() => {
      successToast.classList.remove('active');
      setTimeout(() => {
        successToast.remove();
      }, 300);
    }, 3000);
  }

  updateScrollProgress(progress) {
    // Create scroll progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = `${progress * 100}%`;
  }

  animateOnScroll() {
    // Initialize elements for animation
    const elements = document.querySelectorAll('.feature-card, .pricing-card');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
      el.style.transition = 'all 0.6s ease-out';
    });
  }

  preloadAssets() {
    // Preload critical fonts and images
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap'
    ];
    
    fontLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (!statNumbers.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = el.getAttribute('data-count');
        if (!target) return;

        const hasPlus = target.includes('+');
        const isPercent = target.includes('%');
        const numStr = target.replace(/[^0-9.]/g, '');
        const num = parseFloat(numStr);
        const isDecimal = numStr.includes('.');
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = num * eased;

          const locale = document.documentElement.lang || 'ar';
          let display = isDecimal
            ? current.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
            : Math.floor(current).toLocaleString(locale);
          if (hasPlus) display += '+';
          if (isPercent) display += '%';
          el.textContent = display;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  // Utility functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Additional CSS for JavaScript-created elements
const additionalStyles = `
  .custom-cursor {
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--primary-500);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.2s ease;
  }

  .cursor-follower {
    position: fixed;
    width: 30px;
    height: 30px;
    border: 2px solid var(--primary-500);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.5;
    transition: transform 0.3s ease;
  }

  .cursor-hover {
    transform: scale(2);
  }

  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    inset: 0;
  }

  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  .video-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(8px);
  }

  .video-modal.active {
    opacity: 1;
  }

  .video-modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.8);
    transition: transform 0.3s ease;
  }

  .video-modal.active .video-modal-content {
    transform: scale(1);
  }

  .video-modal-close {
    position: absolute;
    top: var(--space-4);
    inset-inline-end: var(--space-4);
    background: none;
    border: none;
    font-size: var(--font-size-2xl);
    cursor: pointer;
    color: var(--text-secondary);
    transition: color 0.2s ease;
  }

  .video-modal-close:hover {
    color: var(--text-primary);
  }

  .video-placeholder-large {
    text-align: center;
    padding: var(--space-12);
    background: linear-gradient(135deg, var(--primary-50), var(--secondary-50));
    border-radius: var(--radius-xl);
  }

  .video-placeholder-large h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-4);
    color: var(--text-primary);
  }

  .video-placeholder-large p {
    color: var(--text-secondary);
    margin-bottom: var(--space-8);
  }

  .demo-steps {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .demo-step {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .step-number {
    width: 30px;
    height: 30px;
    background: var(--primary-500);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
  }

  .step-text {
    font-weight: var(--font-weight-medium);
    color: var(--text-primary);
  }

  .demo-features-preview {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .feature-preview {
    padding: var(--space-2) var(--space-3);
    background: var(--glass-bg);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    text-align: center;
  }

  .pricing-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(8px);
  }

  .pricing-modal.active {
    opacity: 1;
  }

  .pricing-modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
    max-width: 500px;
    width: 90%;
    position: relative;
    transform: scale(0.8);
    transition: transform 0.3s ease;
  }

  .pricing-modal.active .pricing-modal-content {
    transform: scale(1);
  }

  .pricing-modal-close {
    position: absolute;
    top: var(--space-4);
    inset-inline-end: var(--space-4);
    background: none;
    border: none;
    font-size: var(--font-size-2xl);
    cursor: pointer;
    color: var(--text-secondary);
    transition: color 0.2s ease;
  }

  .pricing-modal-close:hover {
    color: var(--text-primary);
  }

  .pricing-modal-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }

  .pricing-modal-header h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
    color: var(--text-primary);
  }

  .pricing-modal-header p {
    color: var(--text-secondary);
  }

  .signup-form {
    margin-bottom: var(--space-6);
  }

  .signup-input {
    width: 100%;
    padding: var(--space-4);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-4);
    background: var(--bg-secondary);
    color: var(--text-primary);
    transition: border-color 0.2s ease;
  }

  .signup-input:focus {
    outline: none;
    border-color: var(--primary-500);
  }

  .signup-btn {
    width: 100%;
    padding: var(--space-4);
    background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .signup-btn:hover {
    transform: translateY(-2px);
  }

  .signup-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .pricing-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .benefit {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .success-toast {
    position: fixed;
    top: var(--space-8);
    inset-inline-end: var(--space-8);
    background: var(--success);
    color: white;
    padding: var(--space-4) var(--space-6);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .success-toast.active {
    transform: translateX(0);
  }

  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
    z-index: 100;
    transition: width 0.2s ease;
  }

  .mobile-open {
    display: flex !important;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    flex-direction: column;
    padding: var(--space-6);
    box-shadow: var(--shadow-lg);
    border-top: 1px solid var(--border-color);
  }

  .mobile-menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .mobile-menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .mobile-menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  .navbar.scrolled {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
  }

  @media (max-width: 640px) {
    .demo-steps {
      grid-template-columns: 1fr;
    }
    
    .demo-features-preview {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LinkTreePro();
});

// Add service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}