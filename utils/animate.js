/**
 * Анимация свойств элемента
 * @param {HTMLElement} element
 * @param {Object} properties
 * @param {number} duration
 * @returns {Promise<void>}
 */
export const animate = (element, properties, duration = 300) => {
  return new Promise(resolve => {
    element.style.transition = `all ${duration}ms ease`
    Object.entries(properties).forEach(([key, value]) => {
      element.style[key] = value
    })
    setTimeout(resolve, duration)
  })
}
