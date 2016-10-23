import extend from 'object-assign'
import uniqueRandom from 'unique-random'
import getElementColor from '../util/get-element-color'

// Configure random number generator
const random = uniqueRandom(0, 255);

// Animates a single color (red, green, or blue) for an element
function animateElementColor ({
  element, targetColorName, targetColorValue, onComplete
}) {
  return function animate () {
    // Get the current value of the color that is being animated for the element
    const currentColorObj = getElementColor(element)
    const currentColorValue = currentColorObj[targetColorName]

    let newColorValue

    // Increase or decrease the value of the color by 1, depending on if the
    // current color value is greater than or lesser than the value we are
    // animating to (`targetColorValue`)
    if (currentColorValue > targetColorValue) {
      newColorValue = currentColorValue - 1
    } else if (currentColorValue < targetColorValue) {
      newColorValue = currentColorValue + 1
    } else {
      // Color value has reached or is out of bounds of `targetColorValue`,
      // which means that we're done animating!!
      return onComplete()
    }

    // Only update the element's color if the new color value is a valid color
    if (newColorValue >= 0 && newColorValue <= 255) {
      const newColor = extend({}, currentColorObj)
      newColor[targetColorName] = newColorValue

      element.style.color = 'rgb(' + newColor.red + ', ' + newColor.green + ', ' + newColor.blue + ')'

      return setTimeout(function () {
        requestAnimationFrame(animate)
      }, 100)
    }

    // Call onComplete just in case we end up here
    onComplete()
  }
}

// Helper function for starting the never ending color animation
function animateBodyColor (element, color) {
  return requestAnimationFrame(
    animateElementColor({
      element,
      targetColorName: color,
      targetColorValue: random(),
      onComplete () {
        // Run the animation again with a new color value
        animateBodyColor(element, color)
      }
    })
  )
}

export default function () {
  // Get body element
  const body = [].slice.call(document.querySelectorAll('.body'))[0]

  if (!body) {
    return false;
  }

  // Animate body color
  // Set a timeout for each individual color so we can avoid getting the same
  // integer value from random(), which would result in us always getting a
  // gray color 😬
  animateBodyColor(body, 'blue')
  animateBodyColor(body, 'green')
  animateBodyColor(body, 'red')
}
