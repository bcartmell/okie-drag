/*
 * Okie-drag -- A simple plugin to allow for drag scrolling
 */

var OkieDrag = (function() {
  var okieDragClassName = 'okie-drag-draggable';

  return function(element) {
    if (element.className.indexOf(okieDragClassName) !== -1) {
      // We've done this before
      return false;
    }
    this.element = element;
    this.element.classList.add('okie-drag-draggable');

    var startPos;
    var downPos;
    var maxPos = 0;

    this.element.addEventListener('mousedown', function(event) {
      helpers.stopEvent(event);
      startScroll();
      event.target.classList.add('okie-drag-dragging');
      downPos =  {x: event.clientX, y:event.clientY}
      window.addEventListener('mousemove', moveListener, false);
      window.addEventListener('mouseup', endMouseListener, false);
    });

    this.element.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) endscroll(); 
      // if touchlength is greater than 1,
      // the user is probably trying to zoom, 
      // let's stay out of there way.

      else {
        startScroll();
        downPos =  {x: event.touches[0].clientX, y:event.touches[0].clientY }
        window.addEventListener('touchmove', moveListener, false);
        window.addEventListener('touchend', endTouchListener, false);
      }
    });

    this.element.addEventListener('wheel', function(event) {
      startPos = getPosition();
      var deltaVal = (function() {
        if (event.deltaMode === 0) return event.deltaY;
        if (event.deltaMode === 1) return event.deltaY * 20;
      }())

      scrollY(deltaVal);

      // calling endscroll immediately doesn't provide
      // a chance for our bounce animation to run, so we set a very small delay.
      setTimeout(endScroll, 3);
    }, false);

    function minPos() {
      return element.parentElement.clientHeight-element.scrollHeight;
    }

    function scrollY(ammount) {
      element.style.top = startPos.y - ammount +'px';
    }

    function moveListener(event) {
      helpers.stopEvent(event);
      if (event.touches && event.touches.length > 1) endScroll();
      // if touchlength is greater than 1,
      // the user is probably trying to zoom, 
      // let's stay out of there way.
      else {
        var change =  {
          x: downPos.x - (event.clientX || event.touches[0].clientX),
          y: downPos.y - (event.clientY || event.touches[0].clientY)
        };
        scrollY(change.y);
      }
    }

    function getPosition() {
      return {
        x: parseInt(element.style.left) || 0,
        y: parseInt(element.style.top) || 0
      }
    }

    function bounceToBoundry(pos) {
      element.classList.add('transition-position');
      element.style.top = pos+'px';
      setTimeout(function() {
        element.classList.remove('transition-position');
      }, helpers.getTransDuration(element));
    }

    function startScroll() {
      startPos = getPosition();
    };

    function endScroll() {
      if (parseInt(element.style.top) > maxPos) bounceToBoundry(maxPos);
      if (parseInt(element.style.top) < minPos()) bounceToBoundry(minPos());
    }

    function endMouseListener(event) {
      endScroll();
      event.target.classList.remove('okie-drag-dragging');
      window.removeEventListener('mousemove', moveListener, false);
      window.removeEventListener('mouseup', endMouseListener, false);
    };

    function endTouchListener() {
      endScroll();
      window.removeEventListener('touchmove', moveListener, false);
      window.removeEventListener('touchend', endTouchListener, false);
    }

  };
}());

