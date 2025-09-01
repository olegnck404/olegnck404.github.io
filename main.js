import { InteractiveElements } from './modules/InteractiveElements.js'
import { TextAnimator } from './modules/TextAnimator.js'
import { ThemeManager } from './modules/ThemeManager.js'

window.addEventListener('DOMContentLoaded', () => {
  new ThemeManager()
  new InteractiveElements()
  const titleSpan = document.querySelector('.page__title span')
  if (titleSpan) {
    new TextAnimator(titleSpan, titleSpan.textContent).animate()
  }
})
