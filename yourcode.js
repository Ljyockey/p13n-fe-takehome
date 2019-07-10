// Submitted by Leo Yockey
'use strict';

class ViewReporter {
  constructor (targetClassName) {
    const targetElements = document.getElementsByClassName(targetClassName);
    const targetElementsState = {};

    for (let i in targetElements) {
      const element = targetElements[i];
      if (typeof element !== 'object') continue;

      targetElementsState[element.id] = {
        hasBeenVisible: false,
        hasBeenHalfVisible: false,
        element: element
      };
    }

    this.targetElementsState = targetElementsState;
    this.processTargetElements = this.processTargetElements.bind(this);
    this.addReporter();
  }

  addReporter () {
    this.processTargetElements();
    document.addEventListener('scroll', this.processTargetElements);
  }

  removeReporter () {
    document.removeEventListener('scroll', this.processTargetElements);
  }

  processTargetElements () {
    const viewportHeight = window.innerHeight;
    for (let i in this.targetElementsState) {
      const element = this.targetElementsState[i].element;
      const elementBoundingCoordinates = element.getClientRects()[0];
      const elementHeight = element.clientHeight;

      if (this.isElementInViewport(elementBoundingCoordinates, elementHeight, viewportHeight)) {
        const viewPercentage = elementBoundingCoordinates.top >= 0
          ? (viewportHeight - elementBoundingCoordinates.top) / elementHeight
          : elementBoundingCoordinates.bottom / elementHeight;

        this.logElementView(viewPercentage, element.id);
      }
    }
  }

  isElementInViewport (elementBoundingCoordinates, elementHeight, viewportHeight) {
    return (
      elementBoundingCoordinates &&
      this.isTopInView(elementBoundingCoordinates.top, elementHeight) &&
      this.isBottomInView(elementBoundingCoordinates.bottom, elementHeight, viewportHeight)
    );
  }

  isTopInView (topCoordinate, elementHeight) {
    return topCoordinate > (elementHeight * -1);
  }

  isBottomInView (bottomCoordinate, elementHeight, viewportHeight) {
    /*
      The instructions asked for when the top of the element comes into view,
      but many browsers remember scroll postition and this feature may seem broken
      if we don't also account for the bottom of the element coming into view.
    */
    return (
      bottomCoordinate < (viewportHeight + elementHeight) &&
      bottomCoordinate > (elementHeight * -1)
    );
  }

  logElementView (viewPercentage, elementId) {
    const element = this.targetElementsState[elementId];

    if (element && !element.hasBeenVisible) {
      console.log(`Column with id: ${elementId} started to become visible on the page.`);
      element.hasBeenVisible = true;
    }

    if (element && viewPercentage >= .5 && !element.hasBeenHalfVisible) {
      console.log(`Column with id: ${elementId} is now more than 50% visible on the page.`);
      element.hasBeenHalfVisible = true;
    }

    if (element && viewPercentage >= 1) {
      console.log(`Column with id: ${elementId} is now fully visible on the page.`);
      delete this.targetElementsState[elementId];
      if (Object.keys(this.targetElementsState).length === 0) this.removeReporter();
    }
  }

}

new ViewReporter('column');
