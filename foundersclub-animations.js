/**
 * FoundersClub GSAP Animations
 * Version: 1.0.0
 * 
 * Unified animation module for Webflow sites.
 * Requires: GSAP + ScrollTrigger loaded before this script.
 * 
 * Usage via CDN:
 *   <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
 *   <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
 *   <script src="https://cdn.jsdelivr.net/gh/YOUR_USER/foundersclub-animations-cdn@v1.0.0/foundersclub-animations.js" defer></script>
 * 
 * Debug mode:
 *   - Add data-gsap-debug to <html> or <body>, OR
 *   - Set window.GSAP_DEBUG = true before this script loads
 */
(function() {
  'use strict';

  // ========================================
  // CONFIG & UTILS
  // ========================================
  const CONFIG = {
    debug: false,
    defaults: {
      y: 50,
      duration: 1.2,
      ease: 'power2.out',
      start: 'top 75%',
      staggerDelay: 0.15,
      blur: 8
    }
  };

  // Check for debug mode via data attribute or global flag
  const initDebugMode = () => {
    if (window.GSAP_DEBUG === true) {
      CONFIG.debug = true;
      return;
    }
    if (document.documentElement.hasAttribute('data-gsap-debug') ||
        document.body?.hasAttribute('data-gsap-debug')) {
      CONFIG.debug = true;
    }
  };

  const log = (...args) => {
    if (CONFIG.debug) console.log('[GSAP]', ...args);
  };

  const warn = (...args) => {
    console.warn('[GSAP]', ...args);
  };

  // ========================================
  // CORE
  // ========================================
  const Core = {
    init() {
      if (typeof gsap === 'undefined') {
        warn('GSAP not loaded. Make sure to include GSAP before this script.');
        return false;
      }

      if (typeof ScrollTrigger === 'undefined') {
        warn('ScrollTrigger not loaded. Make sure to include ScrollTrigger before this script.');
        return false;
      }

      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
      });

      return true;
    }
  };

  // ========================================
  // MODULE: Events Section
  // ========================================
  const EventsModule = {
    name: 'EventsSection',

    init() {
      const section = document.querySelector('[data-events-section]');
      if (!section) return;

      const texts = section.querySelectorAll('[data-events-text]');
      const images = section.querySelectorAll('[data-events-image]');
      const overlay = section.querySelector('[data-events-overlay]');
      const bg = section.querySelector('[data-events-bg]');

      if (!texts.length || !images.length) return;

      gsap.set(texts, { opacity: 0, y: 30 });
      gsap.set(images, { opacity: 0, scale: 0.95, x: '3vw' });
      if (overlay) gsap.set(overlay, { opacity: 0 });
      if (bg) gsap.set(bg, { scale: 1.1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
          markers: CONFIG.debug,
          id: 'events-section'
        }
      });

      if (overlay) tl.to(overlay, { opacity: 1, duration: 0.8 });
      tl.to(texts, { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, overlay ? '-=0.4' : 0);
      if (bg) tl.to(bg, { scale: 1, duration: 1.2 }, '-=0.8');

      texts.forEach((text) => {
        const imageId = text.getAttribute('data-events-text');
        const image = section.querySelector(`[data-events-image="${imageId}"]`);

        if (!image) return;

        text.addEventListener('mouseenter', () => {
          gsap.to(texts, { opacity: 0.5, duration: 0.3 });
          gsap.to(text, { opacity: 1, duration: 0.3 });
          gsap.to(images, { opacity: 0, scale: 0.95, duration: 0.4 });
          gsap.to(image, { opacity: 1, scale: 1, x: '3vw', duration: 0.4 });
        });

        text.addEventListener('mouseleave', () => {
          gsap.to(texts, { opacity: 1, duration: 0.3 });
          gsap.to(images, { opacity: 0, scale: 0.95, duration: 0.4 });
        });
      });

      log('✅ Events Section initialized');
    }
  };

  // ========================================
  // MODULE: Scroll Text Reveal
  // ========================================
  const ScrollTextModule = {
    name: 'ScrollTextReveal',

    splitTextToChars(text) {
      return text.split(' ').map(word => {
        const chars = word.split('').map(char =>
          `<span data-char style="opacity:0.2;display:inline-block">${char}</span>`
        ).join('');
        return `<span data-word>${chars}</span>`;
      }).join(' ');
    },

    init() {
      const scrollTexts = document.querySelectorAll('[data-scroll-text]');
      if (!scrollTexts.length) return;

      scrollTexts.forEach((element, index) => {
        Array.from(element.childNodes).forEach(node => {
          if (node.nodeType === 3 && node.textContent.trim()) {
            const span = document.createElement('span');
            span.innerHTML = this.splitTextToChars(node.textContent);
            node.replaceWith(span);
          } else if (node.nodeType === 1) {
            node.innerHTML = this.splitTextToChars(node.textContent);
          }
        });

        const chars = element.querySelectorAll('[data-char]');
        if (!chars.length) return;

        gsap.to(chars, {
          opacity: 1,
          stagger: 0.02,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
            markers: CONFIG.debug,
            id: `scroll-text-${index}`,
            invalidateOnRefresh: true
          }
        });
      });

      log('✅ Scroll Text Reveal:', scrollTexts.length, 'elements');
    }
  };

  // ========================================
  // MODULE: Curtain Reveal
  // ========================================
  const CurtainModule = {
    name: 'CurtainReveal',
    mm: null,

    init() {
      const wrapper = document.querySelector('[data-curtain-wrapper]');
      const overlay = document.querySelector('[data-curtain-overlay]');

      if (!wrapper || !overlay) return;

      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 768px)', () => {
        gsap.to(overlay, {
          yPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
            markers: CONFIG.debug,
            id: 'curtain-desktop'
          }
        });
      });

      this.mm.add('(max-width: 767px)', () => {
        gsap.to(overlay, {
          yPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
            markers: CONFIG.debug,
            id: 'curtain-mobile'
          }
        });
      });

      log('✅ Curtain Reveal initialized');
    },

    destroy() {
      if (this.mm) this.mm.revert();
    }
  };

  // ========================================
  // MODULE: Horizontal Scroll
  // ========================================
  const HorizontalModule = {
    name: 'HorizontalScroll',
    mm: null,
    section: null,
    resizeHandler: null,

    init() {
      this.section = document.querySelector('[data-horizontal-section]');
      const cardsTrack = document.querySelector('[data-cards-track]');

      if (!this.section || !cardsTrack) return;

      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 992px)', () => {
        const getScrollDistance = () => {
          const wrapper = cardsTrack.parentElement;
          const viewportWidth = wrapper ? wrapper.offsetWidth : window.innerWidth;
          return cardsTrack.scrollWidth - viewportWidth;
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: this.section,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: CONFIG.debug,
            id: 'horizontal-scroll',
            refreshPriority: 1
          }
        });

        tl.to(cardsTrack, {
          x: () => -getScrollDistance(),
          ease: 'none'
        });

        return () => {
          tl.scrollTrigger?.kill();
          gsap.set(cardsTrack, { clearProps: 'all' });
        };
      });

      this.mm.add('(max-width: 991px)', () => {
        const flex = this.section.querySelector('.members_horizontal_flex');
        if (flex) {
          flex.style.overflowX = 'auto';
          flex.style.webkitOverflowScrolling = 'touch';
        }
      });

      log('✅ Horizontal Scroll initialized');
    },

    getSection() {
      return this.section;
    },

    destroy() {
      if (this.mm) this.mm.revert();
    }
  };

  // ========================================
  // MODULE: Stagger Animations
  // ========================================
  const StaggerModule = {
    name: 'StaggerAnimations',

    init() {
      const { defaults } = CONFIG;
      const horizontalSection = HorizontalModule.getSection();

      const isAfterPinnedSection = (element) => {
        if (!horizontalSection) return false;
        return horizontalSection.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING;
      };

      // Individual items
      const individualItems = document.querySelectorAll(
        '[data-animate-item]:not([data-animate-stagger] [data-animate-item])'
      );

      individualItems.forEach((item, index) => {
        gsap.set(item, {
          opacity: 0,
          y: defaults.y,
          filter: `blur(${defaults.blur}px)`
        });

        const triggerConfig = {
          trigger: item,
          start: defaults.start,
          once: true,
          invalidateOnRefresh: true,
          markers: CONFIG.debug,
          id: `animate-item-${index}`,
          refreshPriority: -1
        };

        if (isAfterPinnedSection(item) && horizontalSection) {
          triggerConfig.pinnedContainer = horizontalSection;
        }

        gsap.to(item, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: defaults.duration,
          ease: defaults.ease,
          scrollTrigger: triggerConfig
        });
      });

      // Stagger containers
      const staggerContainers = document.querySelectorAll('[data-animate-stagger]');

      staggerContainers.forEach((container, containerIndex) => {
        const items = container.querySelectorAll('[data-animate-item]');
        if (!items.length) return;

        const customStart = container.getAttribute('data-stagger-start');
        const customDelay = parseFloat(container.getAttribute('data-stagger-delay')) || defaults.staggerDelay;
        const customY = parseFloat(container.getAttribute('data-stagger-y')) || defaults.y;

        gsap.set(items, {
          opacity: 0,
          y: customY,
          filter: `blur(${defaults.blur}px)`
        });

        const triggerConfig = {
          trigger: container,
          start: customStart || defaults.start,
          once: true,
          invalidateOnRefresh: true,
          markers: CONFIG.debug,
          id: `stagger-container-${containerIndex}`,
          refreshPriority: -1
        };

        if (isAfterPinnedSection(container) && horizontalSection) {
          triggerConfig.pinnedContainer = horizontalSection;
        }

        gsap.to(items, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: defaults.duration,
          stagger: customDelay,
          ease: defaults.ease,
          scrollTrigger: triggerConfig
        });
      });

      log('✅ Animations:', individualItems.length, 'items +', staggerContainers.length, 'staggers');
    }
  };

  // ========================================
  // MODULE: Hover Cards
  // ========================================
  const HoverCardsModule = {
    name: 'HoverCards',

    init() {
      const hoverCards = document.querySelectorAll('[data-hover-card]');

      hoverCards.forEach(card => {
        const overlay = card.querySelector('[data-hover-overlay]');
        const text = card.querySelector('[data-hover-text]');

        if (!overlay || !text) return;

        gsap.set(overlay, { opacity: 0, scale: 1 });
        gsap.set(text, { opacity: 1 });

        const hoverTl = gsap.timeline({ paused: true });

        hoverTl
          .to(text, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in'
          }, 0)
          .to(overlay, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            onStart: () => { overlay.style.pointerEvents = 'auto'; }
          }, 0.1);

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => {
          hoverTl.reverse();
          overlay.style.pointerEvents = 'none';
        });
      });

      log('✅ Hover Cards:', hoverCards.length, 'initialized');
    }
  };

  // ========================================
  // MODULE: Parallax Polaroids
  // ========================================
  const ParallaxModule = {
    name: 'ParallaxPolaroids',
    mm: null,

    init() {
      const section = document.querySelector('[data-founders-section]');
      if (!section) return;

      const leftImg = document.querySelector('[data-parallax-img="left"]');
      const rightImg = document.querySelector('[data-parallax-img="right"]');

      if (!leftImg || !rightImg) return;

      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 768px)', () => {
        gsap.to(leftImg, {
          y: 150,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true,
            markers: CONFIG.debug,
            id: 'parallax-left'
          }
        });

        gsap.to(rightImg, {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true,
            markers: CONFIG.debug,
            id: 'parallax-right'
          }
        });
      });

      log('✅ Parallax Polaroids initialized');
    },

    destroy() {
      if (this.mm) this.mm.revert();
    }
  };

  // ========================================
  // MODULE: Scroll Pin Section (from second script)
  // ========================================
  const ScrollPinModule = {
    name: 'ScrollPinSection',

    init() {
      const section = document.querySelector('[data-scroll-pin]');
      if (!section) return;

      const blocks = section.querySelectorAll('[data-block]');
      const images = section.querySelectorAll('[data-image]');

      if (!blocks.length || !images.length) return;

      const setActiveImage = (imageId) => {
        images.forEach(img => {
          if (img.dataset.image === imageId) {
            img.classList.add('is-active');
          } else {
            img.classList.remove('is-active');
          }
        });
      };

      blocks.forEach((block) => {
        const imageId = block.dataset.block;

        ScrollTrigger.create({
          trigger: block,
          start: 'top top',
          end: 'bottom top',
          markers: CONFIG.debug,
          id: `scroll-pin-${imageId}`,
          onEnter: () => setActiveImage(imageId),
          onEnterBack: () => setActiveImage(imageId)
        });
      });

      log('✅ Scroll Pin Section initialized with', blocks.length, 'blocks');
    }
  };

  // ========================================
  // CONTROLLER
  // ========================================
  const Controller = {
    modules: [
      EventsModule,
      ScrollTextModule,
      CurtainModule,
      HorizontalModule,
      StaggerModule,
      HoverCardsModule,
      ParallaxModule,
      ScrollPinModule
    ],

    initialized: false,

    init() {
      if (this.initialized) {
        log('Already initialized, skipping...');
        return;
      }

      initDebugMode();

      if (!Core.init()) return;

      this.modules.forEach(module => {
        try {
          module.init();
        } catch (err) {
          warn(`Error in ${module.name}:`, err);
        }
      });

      // Single consolidated refresh
      setTimeout(() => {
        ScrollTrigger.refresh();
        log('🔄 ScrollTrigger refreshed');
      }, 100);

      this.initialized = true;
      log('🚀 All GSAP modules initialized');
    },

    destroy() {
      this.modules.forEach(module => {
        if (typeof module.destroy === 'function') {
          try {
            module.destroy();
          } catch (err) {
            warn(`Error destroying ${module.name}:`, err);
          }
        }
      });
      ScrollTrigger.getAll().forEach(st => st.kill());
      this.initialized = false;
    },

    refresh() {
      ScrollTrigger.refresh();
      log('🔄 Manual refresh triggered');
    },

    setDebug(value) {
      CONFIG.debug = !!value;
      log('Debug mode:', CONFIG.debug ? 'ON' : 'OFF');
    }
  };

  // ========================================
  // INIT
  // ========================================
  const bootstrap = () => {
    Controller.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // Expose controller globally for debugging/manual control
  window.GSAPController = Controller;

})();

