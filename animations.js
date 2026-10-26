/**
 * NIIT MUN Inaugural Edition — Complete Shared Animation Engine
 * Includes: Intro Overlay, Canvas Particle System, Navbar Scroll & Mobile Drawer,
 * GSAP ScrollTrigger Reveals, Multi-Phase Countdown Timer, Animated Counters,
 * and Magnetic Buttons.
 */

/* ==========================================================================
   1. Intro Animation Controller
   ========================================================================== */
function initIntroAnimation() {
  const overlay = document.querySelector('.intro-overlay');
  if (!overlay) return;

  const logo = overlay.querySelector('.intro-logo');
  const text = overlay.querySelector('.intro-text');
  const logosRow = overlay.querySelector('.intro-logos-row');
  const date = overlay.querySelector('.intro-date');

  let tl = null;
  const dismissOverlay = () => {
    if (tl) tl.kill();
    overlay.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      overlay.style.display = 'none';
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 500);
  };

  if (typeof gsap === 'undefined') {
    setTimeout(dismissOverlay, 1500);
    return;
  }

  tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      overlay.style.display = 'none';
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }
  });

  // Automatic high-impact reveal sequence (total ~2.2s)
  tl.fromTo(
    logo,
    { scale: 0.6, opacity: 0, filter: 'drop-shadow(0 0 0px rgba(201, 168, 76, 0))' },
    { scale: 1, opacity: 1, filter: 'drop-shadow(0 0 35px rgba(26, 95, 173, 0.8))', duration: 0.65, ease: 'expo.out' }
  )
    .fromTo(
      text,
      { opacity: 0, y: 15, letterSpacing: '4px' },
      { opacity: 1, y: 0, letterSpacing: '8px', duration: 0.45, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo(
      logosRow,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.15'
    )
    .fromTo(
      date,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      '-=0.1'
    )
    .to(overlay, {
      yPercent: -100,
      duration: 0.75,
      ease: 'expo.inOut',
      delay: 0.35
    });
}

/* ==========================================================================
   2. Particle System (Disabled for Clean Diplomatic Aesthetic)
   ========================================================================== */
function initParticles() {
  // Disabled to reduce AI-template look and keep site fast & dignified
  return;
}

/* ==========================================================================
   2b. Top Ribbon Early Bird Live Countdown
   ========================================================================== */
function initRibbonCountdown() {
  const earlyBirdEnd = new Date('2026-11-09T23:59:59+05:00').getTime();

  function updateRibbon() {
    const now = new Date().getTime();
    const diff = earlyBirdEnd - now;

    const daysEls = document.querySelectorAll('.ribbon-days');
    const hoursEls = document.querySelectorAll('.ribbon-hours');
    const minsEls = document.querySelectorAll('.ribbon-mins');
    const secsEls = document.querySelectorAll('.ribbon-secs');

    if (diff <= 0) {
      daysEls.forEach((el) => (el.textContent = '00'));
      hoursEls.forEach((el) => (el.textContent = '00'));
      minsEls.forEach((el) => (el.textContent = '00'));
      secsEls.forEach((el) => (el.textContent = '00'));
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dStr = String(days).padStart(2, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(mins).padStart(2, '0');
    const sStr = String(secs).padStart(2, '0');

    daysEls.forEach((el) => (el.textContent = dStr));
    hoursEls.forEach((el) => (el.textContent = hStr));
    minsEls.forEach((el) => (el.textContent = mStr));
    secsEls.forEach((el) => (el.textContent = sStr));
  }

  updateRibbon();
  setInterval(updateRibbon, 1000);
}

/* ==========================================================================
   3. Navbar Scroll Behavior & Mobile Navigation
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  if (!navbar) return;

  // Scroll state
  function onScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('open');
      navToggle.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('open') && !navbar.contains(e.target)) {
        navbar.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  }

  // Smooth scroll with sticky offset
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Close mobile drawer if open
        if (navbar.classList.contains('open')) {
          navbar.classList.remove('open');
          if (navToggle) navToggle.classList.remove('open');
        }

        const tickerHeight = 36;
        const navbarHeight = 70;
        const totalOffset = tickerHeight + navbarHeight + 15;

        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. Scroll Reveal Animations (GSAP ScrollTrigger)
   ========================================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: show elements immediately
    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Filter out cards that are animated by dedicated grid staggers to prevent conflicting transforms
  const animatedElements = Array.from(document.querySelectorAll('[data-animate]')).filter(
    (el) => !el.closest('.committees-grid') && !el.closest('.fee-grid') && !el.closest('.socials-grid')
  );

  animatedElements.forEach((el) => {
    const animationType = el.getAttribute('data-animate');
    const delay = parseFloat(el.getAttribute('data-delay') || '0');

    let fromVars = {
      duration: 0.8,
      ease: 'power2.out',
      delay,
      clearProps: 'transform,opacity'
    };

    switch (animationType) {
      case 'fade-up':
        fromVars = { ...fromVars, opacity: 0, y: 35 };
        break;
      case 'fade-in':
        fromVars = { ...fromVars, opacity: 0 };
        break;
      case 'fade-left':
        fromVars = { ...fromVars, opacity: 0, x: -40 };
        break;
      case 'fade-right':
        fromVars = { ...fromVars, opacity: 0, x: 40 };
        break;
      case 'zoom-in':
        fromVars = { ...fromVars, opacity: 0, scale: 0.88 };
        break;
      case 'stagger':
        gsap.from(el.children, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
            toggleActions: 'play none none none'
          }
        });
        return;
      default:
        fromVars = { ...fromVars, opacity: 0, y: 25 };
    }

    gsap.from(el, {
      ...fromVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
        toggleActions: 'play none none none'
      }
    });
  });

  // Section headings: Animate ::after underline width
  const sectionHeadings = document.querySelectorAll('.section-heading');
  sectionHeadings.forEach((heading) => {
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 88%',
      once: true,
      onEnter: () => heading.classList.add('in-view')
    });
  });

  // Committee cards stagger entrance
  const committeeGrid = document.querySelector('.committees-grid');
  if (committeeGrid) {
    const cards = committeeGrid.querySelectorAll('.committee-card');
    if (cards.length > 0) {
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: committeeGrid,
          start: 'top 88%',
          once: true,
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // Socials cards stagger entrance
  const socialsGrid = document.querySelector('.socials-grid');
  if (socialsGrid) {
    const socialCards = socialsGrid.querySelectorAll('.social-card');
    if (socialCards.length > 0) {
      gsap.from(socialCards, {
        opacity: 0,
        y: 35,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: socialsGrid,
          start: 'top 88%',
          once: true,
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // Pricing cards stagger entrance
  const feeGrid = document.querySelector('.fee-grid');
  if (feeGrid) {
    const pricingCards = feeGrid.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
      gsap.from(pricingCards, {
        opacity: 0,
        y: 35,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: feeGrid,
          start: 'top 88%',
          once: true,
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // Refresh ScrollTrigger when window loads (ensures image layouts are settled)
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
}

/* ==========================================================================
   5. Multi-Phase Countdown Timer
   ========================================================================== */
function initCountdown() {
  const countdownEl = document.querySelector('.countdown');
  const phaseLabel = document.querySelector('.current-phase');
  const phaseWrapper = document.querySelector('.current-phase-wrapper');
  if (!countdownEl) return;

  const daysEl = countdownEl.querySelector('.countdown-days');
  const hoursEl = countdownEl.querySelector('.countdown-hours');
  const minsEl = countdownEl.querySelector('.countdown-mins');
  const secsEl = countdownEl.querySelector('.countdown-secs');

  // Defined registration phases
  // Early Bird: Oct 25 – Nov 9, 2026
  // Normal: Nov 10 – Nov 25, 2026
  // Late: Nov 26 – Dec 3, 2026
  const phases = [
    {
      id: 'early',
      name: 'Early Bird Registration',
      end: new Date('2026-11-09T23:59:59+05:00').getTime()
    },
    {
      id: 'normal',
      name: 'Normal Registration',
      end: new Date('2026-11-25T23:59:59+05:00').getTime()
    },
    {
      id: 'late',
      name: 'Late Registration',
      end: new Date('2026-12-03T23:59:59+05:00').getTime()
    }
  ];

  const pricingCards = document.querySelectorAll('.pricing-card');

  function updatePhaseHighlight(activePhaseId) {
    pricingCards.forEach((card) => {
      const cardPhase = card.getAttribute('data-phase');
      if (cardPhase === activePhaseId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  function tick() {
    const now = new Date().getTime();
    let currentPhase = null;

    for (let i = 0; i < phases.length; i++) {
      if (now < phases[i].end) {
        currentPhase = phases[i];
        break;
      }
    }

    if (!currentPhase) {
      // Past all phases
      if (phaseLabel) phaseLabel.textContent = 'Registration Closed';
      if (phaseWrapper) phaseWrapper.innerHTML = '<span class="current-phase">Registration Closed</span>';
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      pricingCards.forEach((card) => card.classList.remove('active'));
      return;
    }

    // Active phase
    if (phaseLabel && phaseLabel.textContent !== currentPhase.name) {
      phaseLabel.textContent = currentPhase.name;
    }
    updatePhaseHighlight(currentPhase.id);

    const diff = currentPhase.end - now;

    if (diff <= 0) {
      // Transition to next tick
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   6. Counter Animation
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-count'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeProgress * targetVal);

          el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${targetVal.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  counters.forEach((c) => observer.observe(c));
}

/* ==========================================================================
   7. Magnetic Buttons
   ========================================================================== */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - btnCenterX;
      const deltaY = e.clientY - btnCenterY;

      // Restrict pull distance to max 6px
      const maxDist = 6;
      const moveX = (deltaX / (rect.width / 2)) * maxDist;
      const moveY = (deltaY / (rect.height / 2)) * maxDist;

      btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ==========================================================================
   8. Poster Lightbox Modal Controller
   ========================================================================== */
function initPosterModal() {
  const modal = document.querySelector('.poster-modal');
  const triggers = document.querySelectorAll('.poster-modal-trigger, #openPosterModal');
  if (!modal || triggers.length === 0) return;

  const closeBtn = modal.querySelector('.poster-modal-close');
  const backdrop = modal.querySelector('.poster-modal-backdrop');

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. DOMContentLoaded Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRibbonCountdown();
  initIntroAnimation(); // Runs if .intro-overlay is present
  initScrollAnimations();
  initCountdown(); // Runs if .countdown is present
  initCounters();
  initMagneticButtons();
  initPosterModal();
});
