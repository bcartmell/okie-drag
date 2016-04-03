/*
 * OKie-drag -- A simple plugin to allow for drag scrolling
 */

var OkieDrag = function(element) {
  var self = this;

  this.element = element;
  this.element.classList.add('okie-drag-draggable');

  this.container = element.parentElement;
  this.container.classList.add('okie-drag-container');

  this.downPos;
  this.maxPos = 0;

  function minPos() {
    return this.container.clientHeight-element.scrollHeight;
  }

  function getPos() {
    var style = getComputedStyle(self.element);
    return { x: style.left, y: style.top };
  }

  this.element.addEventListener('mousedown', function(event) {
    startScroll();
    event.target.classList.add('okie-drag-dragging');
    downPos =  {x: event.x, y:event.y}
    window.addEventListener('mousemove', dragMove, false);
    window.addEventListener('mouseup', endMouseListener, false);
  });

  this.element.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) return false; 
    // if touchlength is greater than 1,
    // the user is probably trying to zoom, 
    // let's stay out of there way.

    startScroll();
    downPos =  {x: event.touches[0].clientX, y:event.touches[0].clientY }
    window.addEventListener('touchmove', dragMove, false);
    window.addEventListener('touchend', endTouchListener, false);
  });

  this.element.addEventListener('keyup', function(event) {
    console.log(event);
  }, false);

}
OkieDrag.prototype = {
  dragStart: function(event) {
    var startPos = getPos();

  },

  dragMove: function(event) {
    if (event.touches && event.touches.length > 1) return endScroll(); 
    // if touchlength is greater than 1, the user is probably trying to zoom, let's stay out of there way.

    event.preventDefault();
    event.stopPropagation();
    // prevent conflict with other listeners

    this.element.style.top = this.startPos.y - (event.y || event.touches[0].clientY) +'px';
    // move element to match dragMove
  },

  bounceTo: function(pos) {
    this.element.classList.add('transition-position');
    this.element.style.top = pos+'px';
    setTimeout(function() {
      this.element.classList.remove('transition-position');
    }, helpers.getTransDuration(element));
  },

  checkBoundry: function() {
    if (parseInt(this.element.style.top) > maxPos) this.bounceTo(maxPos);
    if (parseInt(this.element.style.top) < minPos()) this.bounceTo(minPos());
  },

  endMouseListener: function() {
    checkBoundry();
    event.target.classList.remove('okie-drag-dragging');
    window.removeEventListener('mousemove', this.dragMove, false);
    window.removeEventListener('mouseup', this.endMouseListener, false);
  },

  endTouchListener: function() {
    checkBoundry();
    window.removeEventListener('touchmove', this.dragMove, false);
    window.removeEventListener('touchend', this.endTouchListener, false);
  }

};
