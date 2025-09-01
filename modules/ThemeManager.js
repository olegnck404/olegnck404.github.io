import { animate } from '../utils/animate.js'

/**
 * Управление темой сайта
 */
export class ThemeManager {
  constructor() {
    this.themeLink = document.getElementById("theme")
    this.switchButton = document.getElementById("switchMode")
    this.currentTheme = localStorage.getItem('theme') || 'light'
    this.init()
  }
  init() {
    this.themeLink.href = `${this.currentTheme}.css`
    this.setupTransition()
    this.setupEventListeners()
  }
  setupTransition() {
    document.body.style.opacity = '0'
    document.body.style.transition = 'opacity 0.5s ease'
    window.requestAnimationFrame(() => {
      document.body.style.opacity = '1'
    })
  }
  setupEventListeners() {
    this.switchButton.addEventListener('click', async () => {
      await animate(document.body, { opacity: '0' })
      this.currentTheme = this.themeLink.getAttribute("href").includes("dark") ? "light" : "dark"
      this.themeLink.href = `${this.currentTheme}.css`
      localStorage.setItem('theme', this.currentTheme)
      await animate(document.body, { opacity: '1' })
    })
  }
}
