var elementToDrag = document.getElementsByTagName('img');
var wrapper = document.getElementById('wrapper');

function dragAndDrop() {

    var getCoords = function (elem) { 
      var objCoords = elem.getBoundingClientRect();
      return {
        top: objCoords.top + pageYOffset,
        left: objCoords.left + pageXOffset
      };
    }

    this.dragAndDropFunc = function(element) {
        for (var i = 0; i < element.length; i++) {
            
            element[i].onmousedown = function(e) {
                if(e.button < 2) {
                    var shiftX = e.pageX - getCoords(this).left;
                    var shiftY = e.pageY - getCoords(this).top;

                    this.style.position = 'absolute';
                    wrapper.appendChild(this);
                    this.style.zIndex = 1000; 

                    function moveAt(e) {
                        e.preventDefault();
                        e.target.style.cursor ='-webkit-grab';
                        e.target.style.left = e.pageX - shiftX + 'px';
                        e.target.style.top = e.pageY - shiftY + 'px';
                    }

                    this.onmousemove = function(e) {
                        moveAt(e);
                    };

                    this.onmouseup = function() {
                        this.cursor ='pointer';
                        this.onmousemove = null;
                        this.onmouseup = null;
                    };

                    this.ondragstart = function() {
                        return false;
                    };  
                }
            } 
        }
    }
}

var dragAndDrops = new dragAndDrop();
dragAndDrops.dragAndDropFunc(elementToDrag);
