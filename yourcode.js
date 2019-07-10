'use strict';

class ViewVerifier {
  constructor (targetClassName) {
    const targetElements = [...document.getElementsByClassName(targetClassName)];
    const elementTracker = targetElements.map(element => ({
      id: element.id,
      hasBeenVisible: false,
      hasBeenHalfVisible: false
    }));

    this.elementTracker = elementTracker;
    this.targetElements = targetElements;
    this.processTargetElements = this.processTargetElements.bind(this);
    this.processTargetElements();
    document.addEventListener('scroll', this.processTargetElements);
  }

  processTargetElements () {
    const viewportHeight = window.innerHeight;

    this.targetElements.forEach((element) => {
      const elementBoundingCoordinates = element.getClientRects()[0];
      const elementHeight = element.clientHeight;

      if (this.isElementInViewport(elementBoundingCoordinates, elementHeight, viewportHeight)) {
        let viewPercentage = (viewportHeight - elementBoundingCoordinates.top) / elementHeight;
        this.logElementView(viewPercentage, element.id);
      }
    });
  }

  isElementInViewport (elementBoundingCoordinates, elementHeight, viewportHeight) {
    return (
      elementBoundingCoordinates &&
      (elementBoundingCoordinates.top >= (elementHeight * -1)) &&
      (elementBoundingCoordinates.bottom <= viewportHeight + elementHeight)
    );
  }

  logElementView (viewPercentage, elementId) {
    const elementStatus = this.elementTracker.find(e => e.id === elementId);

    if (elementStatus && !elementStatus.hasBeenVisible) {
      console.log(`Column with id: ${elementId} started to become visible on the page.`);
      elementStatus.hasBeenVisible = true;
    }

    if (elementStatus && viewPercentage >= .5 && !elementStatus.hasBeenHalfVisible) {
      console.log(`Column with id: ${elementId} is now more than 50% visible on the page.`);
      elementStatus.hasBeenHalfVisible = true;
    }

    if (elementStatus && viewPercentage >= 1) {
      console.log(`Column with id: ${elementId} is now fully visible on the page.`);
      const elementStatusIndex = this.elementTracker.indexOf(elementStatus);
      this.elementTracker.splice(elementStatusIndex, 1);
    }
  }

}

new ViewVerifier('column');
