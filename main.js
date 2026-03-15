/* ========================================
   XELNT TRADERS — Main JavaScript
   ======================================== */

(function() {
  'use strict';

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  
  function getPreferredTheme() {
    return 'dark'; // Default dark
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    
    const icon = theme === 'dark' ? sunIcon : moonIcon;
    if (themeToggle) themeToggle.innerHTML = icon;
    if (mobileThemeToggle) mobileThemeToggle.innerHTML = icon;
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
  
  setTheme(getPreferredTheme());

  // --- Mobile Navigation ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Sticky Navbar Scroll ---
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  if (navbar) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Scroll Reveal (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function(el) {
      el.classList.add('reveal--visible');
    });
  }

  // --- Stat Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(stat) {
      counterObserver.observe(stat);
    });
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1500;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      
      el.textContent = prefix + current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }
    
    requestAnimationFrame(update);
  }

  // --- Contact Form Handler ---
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(this);
      const data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });
      
      // Build WhatsApp message
      let message = `Hi, I'm ${data.name} from ${data.brand || 'my brand'}.\n`;
      message += `I'm interested in ${data.product_type || 'custom manufacturing'}.\n`;
      message += `Quantity: ${data.quantity || 'TBD'}\n`;
      if (data.message) message += `\nDetails: ${data.message}`;
      
      const whatsappUrl = `https://wa.me/923022922242?text=${encodeURIComponent(message)}`;
      
      // Show success state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Redirecting to WhatsApp...';
      submitBtn.style.background = '#25D366';
      
      setTimeout(function() {
        window.open(whatsappUrl, '_blank');
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        contactForm.reset();
      }, 800);
    });
  }

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('navbar__link--active');
    }
  });

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
