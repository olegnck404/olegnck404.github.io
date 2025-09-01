import { animate } from '../utils/animate.js'

/**
 * Интерактивные элементы страницы
 */
export class InteractiveElements {
  constructor() {
    this.projectList = document.querySelector('.card__portfolio-list')
    this.profilePhoto = document.querySelector('.card__photo')
    this.skillsList = document.querySelectorAll('#html li')
    this.cardBlock = document.querySelector('.card__block')
    this.init()
  }
  init() {
    this.setupProjectLinks()
    this.setupProfilePhoto()
    this.setupSkillsAnimation()
    this.setupScrollAnimations()
    this.setupEasterEgg()
  }
  setupProjectLinks() {
    if (!this.projectList) return
    this.projectList.addEventListener('mouseover', e => {
      if (e.target.classList.contains('card__link')) {
        this.handleProjectHover(e)
      }
    })
    this.projectList.addEventListener('mouseout', e => {
      if (e.target.classList.contains('card__link')) {
        this.handleProjectLeave(e)
      }
    })
  }
  handleProjectHover(e) {
    const hue = Math.random() * 360
    animate(e.target, {
      color: `hsl(${hue}, 70%, 70%)`,
      transform: 'translateX(10px)'
    })
  }
  handleProjectLeave(e) {
    animate(e.target, {
      color: '',
      transform: ''
    })
  }
  setupProfilePhoto() {
    if (!this.profilePhoto) return
    let isHovering = false
    const handleMouseMove = (e) => {
      if (!isHovering) return
      const rect = this.profilePhoto.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 10
      const y = (e.clientY - rect.top - rect.height / 2) / 10
      requestAnimationFrame(() => {
        this.profilePhoto.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.05)`
      })
    }
    this.profilePhoto.addEventListener('mouseenter', () => isHovering = true)
    this.profilePhoto.addEventListener('mouseleave', () => {
      isHovering = false
      animate(this.profilePhoto, {
        transform: 'perspective(1000px) rotateY(0) rotateX(0) scale(1)'
      })
    })
    this.profilePhoto.addEventListener('mousemove', handleMouseMove)
  }
  setupSkillsAnimation() {
    const skills = {
      'TypeScript & React': 90,
      'Vite & Tailwind CSS': 80,
      'Python': 75,
      'SQL & Docker': 70,
      'Git & Linux': 65
    }
    this.skillsList.forEach(skill => {
      const name = skill.textContent.trim()
      if (skills[name]) {
        this.createSkillIndicator(skill, skills[name])
      }
    })
  }
  createSkillIndicator(element, value) {
    const indicator = document.createElement('div')
    indicator.className = 'skill-indicator'
    indicator.style.cssText = `position: absolute; right: 0; top: 50%; transform: translateY(-50%); opacity: 0; transition: all 0.3s ease;`
    const progress = document.createElement('div')
    progress.style.cssText = `width: ${value}%; height: 4px; background: var(--primary-color); border-radius: 2px;`
    indicator.appendChild(progress)
    element.appendChild(indicator)
    element.style.position = 'relative'
    element.addEventListener('mouseenter', () => animate(indicator, { opacity: 1 }))
    element.addEventListener('mouseleave', () => animate(indicator, { opacity: 0 }))
  }
  setupScrollAnimations() {
    if (!this.cardBlock) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    this.cardBlock.querySelectorAll(':scope > *').forEach(el => {
      el.classList.add('fade-in')
      observer.observe(el)
    })
  }
  setupEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let index = 0
    document.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[index]) {
        index++
        if (index === konamiCode.length) {
          this.triggerEasterEgg()
          index = 0
        }
      } else {
        index = 0
      }
    })
  }
  triggerEasterEgg() {
    document.body.classList.add('rainbow-mode')
    setTimeout(() => document.body.classList.remove('rainbow-mode'), 5000)
  }
}
