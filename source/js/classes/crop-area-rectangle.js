'use strict';

crop.factory('CropAreaRectangle', ['cropArea', 'cropAreaSquare', function(CropArea, CropAreaSquare){
  var CropAreaRectangle = function () {
    CropAreaSquare.apply(this, arguments);

    this._aspectRatio = 1;
  };

  CropAreaRectangle.prototype = new CropAreaSquare();

  CropAreaRectangle.prototype.setAspectRatio = function(ar){
    this._aspectRatio = ar;
    this._drawArea = drawArea.bind(null, ar);
    this._dontDragOutside();
  }

  CropAreaRectangle.prototype.getAspectRatio = function () {
    return this._aspectRatio;
  }

  CropAreaRectangle.prototype._drawArea = drawArea.bind(null, 1);

  CropAreaRectangle.prototype._calcSquareCorners=function() {
    var areaRect = calcRectBound(this.getAspectRatio(), this._size);

    return [
      [this._x-(areaRect.width/2), this._y-(areaRect.height/2)],
      [this._x+(areaRect.width/2), this._y-(areaRect.height/2)],
      [this._x-(areaRect.width/2), this._y+(areaRect.height/2)],
      [this._x+(areaRect.width/2), this._y+(areaRect.height/2)]
    ];
  };

  CropAreaRectangle.prototype._dontDragOutside=function() {
    var h=this._ctx.canvas.height,
        w=this._ctx.canvas.width;

    var areaAr = this.getAspectRatio();

    var maxV = 0;
    if(areaAr >= 1){
      maxV = Math.min(h*areaAr, w);
    }else{
      maxV = Math.min(w/areaAr, h);
    }


    this._size = Math.min(this._size, maxV);
    var areaRect = calcRectBound(areaAr, this._size);

    this._x = Math.min(Math.max(this._x, (areaRect.width/2)), w-(areaRect.width/2));
    this._y = Math.min(Math.max(this._y, (areaRect.height/2)), h-(areaRect.height/2));
  };

  function drawArea(ar, ctx,centerCoords,size) {
    var areaRect = calcRectBound(ar, size);
    ctx.rect(centerCoords[0]-(areaRect.width/2),centerCoords[1]-(areaRect.height/2), areaRect.width, areaRect.height);
  }

  function calcRectBound(ar, size) {
    var w,h; w = h = size;

    if(ar>=1){
      h = h / ar;
    }else{
      w = w * ar;
    }

    return {width: w, height: h, aspectRatio: ar};
  }

  return CropAreaRectangle;


}]);
