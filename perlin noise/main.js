'use strict';
let w = 400;
let h = w;
let matrix = new Matrix(w,h);


function Canvas(){
    this.cellSize = 2;
    this.canvas;
    this.ctx;
    this.colors = ['#555', '#171717', '#f44336', '#2196f3', '#4caf50'];
    let self = this;


    this.createElement = function(width, height){
        width*=self.cellSize;
        height*=self.cellSize;
        self.canvas = document.createElement('canvas');
        self.canvas.width = width;
        self.canvas.height = height;
        self.ctx = self.canvas.getContext('2d');
        self.canvas.style.display = 'block';
        self.canvas.style.margin = 'auto';
        document.body.appendChild(self.canvas);
    }

    this.drawField = function(matrix){

        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        for (let x = 0; x < self.canvas.height / self.cellSize; x++) {
            for (let y = 0; y < self.canvas.width / self.cellSize; y++) {

                self.ctx.fillStyle = self.colors[matrix[x][y]];
                self.ctx.fillRect(x * self.cellSize, y * self.cellSize, self.cellSize, self.cellSize);
            }
        }

    }

    this.drawPoint = function(x,y,color){
        // self.ctx.fillStyle = self.colors[color];
        let red = color;
        let green = color;
        let blue = color;

        self.ctx.fillStyle = 'rgb('+red+','+green+','+blue+')'
        self.ctx.fillRect(x * self.cellSize, y * self.cellSize, self.cellSize, self.cellSize);
    }


}

function Matrix(width, height){
    this.matrix;
    this.width = width;
    this.height = height;
    this.canvas = new Canvas();
    let self = this;

    this.get = function(){
        return self.matrix;
    }

    this.set = function(x,y,value){
        self.matrix[x][y] = value;
        self.canvas.drawPoint(x,y,value);
    }

    this._create = function(){
        self.canvas.createElement(self.width, self.height);
        self.matrix = [];

        for(let i=0; i<self.height; i++){
            self.matrix.push([]);
            for(var j=0; j<self.width; j++){
                self.matrix[i].push(1);
            }
        }
        self.canvas.drawField(self.matrix);
    }

    this.clear = function(){
        self.matrix = [];

        for(let i=0; i<self.height; i++){
            self.matrix.push([]);
            for(var j=0; j<self.width; j++){
                self.matrix[i].push(1);
            }
        }
        self.canvas.drawField(self.matrix);
    }

    if(!this.matrix){
        self._create();
    }

}

let table = [];
for(let i = 0; i< 1024; i++){
  table.push(Math.round((Math.random()*100)))
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}
function Perlin(){




  function GetPseudoRandomGradientVector(x,y){
    // console

    // let v = table[(((x * 1836311903) ^ (y * 2971215073) + 48047526976)&1023)]&3;
    let v = ((x*1231 ^ y*8544)+4212)&1023;
    v = table[v]&3;
    // return [Math.random()*100&3,Math.random()*100&2]
    // console.log(v)

    switch (v) {
      case 0:
        return [1,0];
        break;
      case 1:
        return [-1,0];
        break;
      case 2:
        return [0,1];
        break;
      default :
        return [0,-1]
    }
  }

  function QunticCurve(t){
    // return t * t * t * (t * (t * 6 - 15) + 10);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function Lerp(a, b, t){ //Интерполяция
    return a + (b - a) * t;
  }

  function Dot(a,b){ //Скалярное произведение
    return a[0] * b[0] + a[1] * b[1];
  }

  function Noise(fx,fy){
    let left =  Math.floor(fx);
    let top =   Math.floor(fy);

    let pointInQuadX = fx - left;
    let pointInQuadY = fy - top;

    let topLeftGradient     = GetPseudoRandomGradientVector(left,   top  );
    let topRightGradient    = GetPseudoRandomGradientVector(left+1, top  );
    let bottomLeftGradient  = GetPseudoRandomGradientVector(left,   top+1);
    let bottomRightGradient = GetPseudoRandomGradientVector(left+1, top+1);

    let distanceToTopLeft     = [pointInQuadX,    pointInQuadY];
    let distanceToTopRight    = [pointInQuadX-1,  pointInQuadY];
    let distanceToBottomLeft  = [pointInQuadX,    pointInQuadY-1];
    let distanceToBottomRight = [pointInQuadX-1,  pointInQuadY-1];

    let tx1 = Dot(distanceToTopLeft,     topLeftGradient);
    let tx2 = Dot(distanceToTopRight,    topRightGradient);
    let bx1 = Dot(distanceToBottomLeft,  bottomLeftGradient);
    let bx2 = Dot(distanceToBottomRight, bottomRightGradient);

    pointInQuadX = QunticCurve(pointInQuadX);
    pointInQuadY = QunticCurve(pointInQuadY);

    let tx = Lerp(tx1, tx2, pointInQuadX);
    let bx = Lerp(bx1, bx2, pointInQuadX);
    let tb = Lerp(tx, bx, pointInQuadY);

    return tb;
  }

  this.Octave = function(fx,fy,octaves){
    let persistance = 0.5;
    let amplitude = 1;
    let max = 0;
    let result = 0;

    while(octaves-- > 0){
      max+=amplitude;
      result += Noise(fx,fy) * amplitude;
      amplitude *= persistance;
      fx *= 2;
      fy *= 2;
    }
    return result/max
  }

}

let perlin = new Perlin();

let n = 40;

let min = 1000;
let max = 0;

function gen(i,j){
  for(let i = 0; i<(w/n); i+=1/n){
    for(let j = 0; j<(h/n); j+=1/n){
      let color = perlin.Octave(i, j, 8);
      max = color > max ? color : max;
      min = color < min ? color : min;
      color = Math.round((color+0.4)*255);
      matrix.set(Math.round(i*n), Math.round(j*n), color)
    }
  }
}

let x1 = 10;
let y1 = 11;
let x2 = 10;
let y2 = 11;


function gen2(i,j){
  for(let i = x1; i<y1; i+=1/n){
    for(let j = x2; j<y2; j+=1/n){
      let color = perlin.Octave(i, j, 8);
      max = color > max ? color : max;
      min = color < min ? color : min;
      color = Math.round((color+0.5)*255);

      matrix.set(Math.round(i*n), Math.round(j*n), color)
    }
  }
}



document.addEventListener("keydown", function(evt){
  x1 = evt.keyCode == 37 ? x1-=1 : x1;
  x2 = evt.keyCode == 38 ? x2-=1 : x2;
  x1 = evt.keyCode == 39 ? x1+=1 : x1;
  x2 = evt.keyCode == 40 ? x2+=1 : x2;

  y1 = x1 + 1;
  y2 = x2 + 1;
  console.log(evt.keyCode)
  gen2();
})

gen()
