/**
 * Анимация текста по буквам
 */
export class TextAnimator {
  constructor(element, text, options = {}) {
    this.element = element
    this.text = text
    this.options = {
      speed: options.speed || 100,
      delay: options.delay || 1000
    }
  }
  async animate() {
    await new Promise(resolve => setTimeout(resolve, this.options.delay))
    this.element.textContent = ''
    for (let char of this.text) {
      await new Promise(resolve => setTimeout(resolve, this.options.speed))
      this.element.textContent += char
    }
  }
}
