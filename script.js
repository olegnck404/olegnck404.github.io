/**
 * Portfolio Website - Main JavaScript
 * 
 * Architecture:
 * - Module pattern with IIFE for encapsulation
 * - Event-driven architecture
 * - Performance optimizations (throttle, debounce, RAF)
 * - Native CSS scroll-snap with JS enhancement
 */

(function () {
  'use strict'

  // ============================================
  // Configuration & Constants
  // ============================================

  const CONFIG = {
    typingSpeed: 100,
    typingDelay: 500,
    scrollSnapThreshold: 0.15, // 15% of viewport height
    wheelDelay: 100,
    touchThreshold: 50,
    touchTimeThreshold: 300,
    animationDuration: 400,
    debounceDelay: 150,
    throttleDelay: 16 // ~60fps
  }

  // ============================================
  // Utility Functions
  // ============================================

  const Utils = {
    /**
     * Debounce function execution
     */
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func.apply(this, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },

    /**
     * Throttle function execution
     */
    throttle(func, limit) {
      let inThrottle
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args)
          inThrottle = true
          setTimeout(() => inThrottle = false, limit)
        }
      }
    },

    /**
     * Request Animation Frame wrapper
     */
    raf(callback) {
      return requestAnimationFrame(callback)
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= -threshold &&
        rect.left >= -threshold &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
      )
    },

    /**
     * Detect mobile device
     */
    isMobile() {
      return window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }

  // ============================================
  // Scroll Manager Module
  // ============================================

  const ScrollManager = (function () {
    let sections = []
    let isScrolling = false
    let scrollLock = false
    let lastScrollTime = 0

    /**
     * Initialize scroll manager
     */
    function init() {
      sections = Array.from(document.querySelectorAll('section, footer'))
      if (sections.length === 0) return

      // Use native CSS scroll-snap, enhance with JS only for edge cases
      setupWheelHandler()
      setupKeyboardHandler()
      if (!Utils.isMobile()) {
        setupTouchHandler()
      }
    }

    /**
     * Get current section info
     */
    function getCurrentSection() {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const threshold = viewportHeight * CONFIG.scrollSnapThreshold

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const rect = section.getBoundingClientRect()
        const sectionTop = scrollY + rect.top
        const sectionBottom = sectionTop + section.offsetHeight

        if (scrollY >= sectionTop - threshold && scrollY < sectionBottom) {
          const isNearStart = scrollY <= sectionTop + threshold
          const isNearEnd = scrollY >= sectionBottom - threshold

          return {
            index: i,
            section,
            sectionTop,
            sectionBottom,
            isNearStart,
            isNearEnd
          }
        }
      }

      return {
        index: 0,
        section: sections[0],
        sectionTop: 0,
        sectionBottom: sections[0]?.offsetHeight || 0,
        isNearStart: true,
        isNearEnd: false
      }
    }

    /**
     * Smooth scroll to section
     */
    function scrollToSection(index, immediate = false) {
      if (index < 0 || index >= sections.length) return
      if (isScrolling) return

      const target = sections[index]
      if (!target) return

      const targetTop = target.offsetTop

      if (immediate) {
        window.scrollTo({ top: targetTop, behavior: 'auto' })
        return
      }

      isScrolling = true
      scrollLock = true

      const startY = window.scrollY
      const distance = targetTop - startY
      const duration = CONFIG.animationDuration
      let startTime = null

      function animate(currentTime) {
        if (startTime === null) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing: ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3)
        const currentY = startY + distance * ease

        window.scrollTo(0, currentY)

        if (progress < 1) {
          Utils.raf(animate)
        } else {
          isScrolling = false
          scrollLock = false
        }
      }

      Utils.raf(animate)
    }

    /**
     * Setup wheel event handler
     */
    function setupWheelHandler() {
      const handleWheel = Utils.throttle((e) => {
        const now = Date.now()
        if (now - lastScrollTime < CONFIG.wheelDelay) return
        if (isScrolling || scrollLock) return

        const current = getCurrentSection()
        const delta = e.deltaY
        const scrollY = window.scrollY

        // Only intercept at section boundaries
        if (current.isNearStart || current.isNearEnd) {
          if ((delta > 20 && current.isNearEnd) || (delta < -20 && current.isNearStart)) {
            e.preventDefault()
            lastScrollTime = now

            if (delta > 0) {
              scrollToSection(current.index + 1)
            } else {
              scrollToSection(current.index - 1)
            }
          }
        }
      }, CONFIG.throttleDelay)

      window.addEventListener('wheel', handleWheel, { passive: false })
    }

    /**
     * Setup keyboard navigation
     */
    function setupKeyboardHandler() {
      window.addEventListener('keydown', (e) => {
        if (isScrolling) return

        const current = getCurrentSection()
        let targetIndex = null

        switch (e.key) {
          case 'ArrowDown':
          case 'PageDown':
            e.preventDefault()
            targetIndex = current.index + 1
            break
          case 'ArrowUp':
          case 'PageUp':
            e.preventDefault()
            targetIndex = current.index - 1
            break
          case 'Home':
            e.preventDefault()
            targetIndex = 0
            break
          case 'End':
            e.preventDefault()
            targetIndex = sections.length - 1
            break
        }

        if (targetIndex !== null) {
          scrollToSection(targetIndex)
        }
      })
    }

    /**
     * Setup touch handler for tablets
     */
    function setupTouchHandler() {
      let touchStartY = 0
      let touchStartTime = 0

      window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY
        touchStartTime = Date.now()
      }, { passive: true })

      window.addEventListener('touchend', (e) => {
        if (isScrolling) return

        const touchEndY = e.changedTouches[0].clientY
        const touchEndTime = Date.now()
        const diff = touchStartY - touchEndY
        const timeDiff = touchEndTime - touchStartTime

        if (Math.abs(diff) > CONFIG.touchThreshold && timeDiff < CONFIG.touchTimeThreshold) {
          const current = getCurrentSection()
          const scrollY = window.scrollY
          const viewportHeight = window.innerHeight
          const threshold = viewportHeight * CONFIG.scrollSnapThreshold

          const isNearStart = scrollY <= current.sectionTop + threshold
          const isNearEnd = scrollY >= current.sectionBottom - threshold

          if (isNearStart || isNearEnd) {
            if (diff > 0) {
              scrollToSection(current.index + 1)
            } else {
              scrollToSection(current.index - 1)
            }
          }
        }
      }, { passive: true })
    }

    return { init }
  })()

  // ============================================
  // Animation Modules
  // ============================================

  const TypingAnimation = (function () {
    function init() {
      const element = document.querySelector('.typing-text')
      if (!element) return

      const text = element.textContent.trim()
      element.textContent = ''

      let index = 0
      function type() {
        if (index < text.length) {
          element.textContent += text.charAt(index)
          index++
          setTimeout(type, CONFIG.typingSpeed)
        }
      }

      setTimeout(type, CONFIG.typingDelay)
    }

    return { init }
  })()

  const BootAnimation = (function () {
    function init() {
      const element = document.querySelector('.hero__boot-text')
      if (!element) return

      const sequence = ['[SYSTEM BOOT]', '[INITIALIZING...]', '[SYSTEM BOOT]']
      let index = 0

      function update() {
        if (index < sequence.length - 1) {
          index++
          element.textContent = sequence[index]
          setTimeout(update, 300)
        }
      }

      setTimeout(update, 400)
    }

    return { init }
  })()

  const ScrollReveal = (function () {
    function init() {
      const elements = document.querySelectorAll('.section')
      if (elements.length === 0) return

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      })

      elements.forEach(el => observer.observe(el))
    }

    return { init }
  })()

  // ============================================
  // Interaction Modules
  // ============================================

  const CardEffects = (function () {
    function init() {
      const cards = document.querySelectorAll('.device__card, .skill__card, .project__card')

      cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
          this.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        })

        card.addEventListener('mousedown', function () {
          this.style.transform = 'translateY(-1px)'
        })

        card.addEventListener('mouseup', function () {
          this.style.transform = ''
        })
      })
    }

    return { init }
  })()

  const ProjectCards = (function () {
    function init() {
      const links = document.querySelectorAll('.project__link')

      links.forEach(link => {
        link.addEventListener('focus', function () {
          const card = this.closest('.project__card')
          if (card) {
            card.style.borderColor = 'var(--accent)'
            card.style.boxShadow = '0 8px 24px rgba(0, 217, 255, 0.15)'
          }
        })

        link.addEventListener('blur', function () {
          const card = this.closest('.project__card')
          if (card && !card.matches(':hover')) {
            card.style.borderColor = ''
            card.style.boxShadow = ''
          }
        })
      })
    }

    return { init }
  })()

  const SmoothScroll = (function () {
    function init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href')
          if (!href || href === '#') {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
          }

          const target = document.querySelector(href)
          if (target) {
            e.preventDefault()
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      })
    }

    return { init }
  })()

  // ============================================
  // Utility Modules
  // ============================================

  const CurrentYear = (function () {
    function init() {
      const element = document.getElementById('current-year')
      if (element) {
        element.textContent = new Date().getFullYear()
      }
    }

    return { init }
  })()

  const CursorBlink = (function () {
    function init() {
      const cursor = document.querySelector('.cursor-blink')
      if (!cursor) return

      const typingText = document.querySelector('.typing-text')
      if (typingText) {
        const textLength = typingText.textContent.length
        const duration = textLength * CONFIG.typingSpeed + CONFIG.typingDelay

        setTimeout(() => {
          cursor.style.opacity = '0.7'
        }, duration)
      }
    }

    return { init }
  })()

  // ============================================
  // Performance Optimizations
  // ============================================

  const Performance = (function () {
    function init() {
      // Pause animations when tab is hidden
      document.addEventListener('visibilitychange', () => {
        document.body.style.animationPlayState = document.hidden ? 'paused' : 'running'
      })

      // Optimize scroll performance
      let ticking = false
      const handleScroll = Utils.throttle(() => {
        // Any scroll-based logic here
        ticking = false
      }, CONFIG.throttleDelay)

      window.addEventListener('scroll', () => {
        if (!ticking) {
          Utils.raf(handleScroll)
          ticking = true
        }
      }, { passive: true })
    }

    return { init }
  })()

  // ============================================
  // Main Initialization
  // ============================================

  function init() {
    // Core functionality
    CurrentYear.init()
    ScrollManager.init()

    // Animations
    BootAnimation.init()
    TypingAnimation.init()
    ScrollReveal.init()
    CursorBlink.init()

    // Interactions
    CardEffects.init()
    ProjectCards.init()
    SmoothScroll.init()

    // Performance
    Performance.init()

    // Mark as loaded
    document.body.classList.add('loaded')
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

})()