var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
width = 1024,
height = 900;

canvas.width = width;
canvas.height = height;

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createTerrain(r){
    var arr = [];
    var lenght = width;

    arr[0] = height/2 + random(-height/8, height/8);
    arr[lenght] = height/2 + random(-height/8, height/8);

    for(var n = lenght; n>=1; n/=2){
        for(var i = 0; i<=lenght; i+=n){
            if (arr[i] == undefined){
                arr[i] = (arr[i-n] + arr[i+n])/2 + random(-n*2*r,n*2*r);
            }
        }
    }
    return arr

}

var terPoints = createTerrain(0.5)

ctx.beginPath();
ctx.moveTo(0, terPoints[0]);
for (var t = 1; t < terPoints.length; t++) {
  ctx.lineTo(t*2, terPoints[t]);
}

ctx.lineTo(canvas.width, canvas.height);
ctx.lineTo(0, canvas.height);
ctx.closePath();
ctx.fill();
