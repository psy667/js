/*
Основная матрциа
0 - свободная клетка    белый
1 - занятая клетка      чёрный
2 - старт               красный
3 - конец               синий
4 - путь                зелёный

Матрица пути
-1 - занятая клетка
0 - старт
от 1 до Infinity - волна
-2 - конец

Скрость 64: 120 - 200 ms
        128: 350ms
        1024: 40 000ms

        128:
        Загрузка 34
        Создание матрицы 44
        Создание волны 49
        Распространение волны 232
        Нахождение обратного пути 235
        Отрисовка матрицы 281
*/
console.log('Загрузка', performance.now() | 0)
'use strict';
const width = 1024;
const height = width;
const cellSize = 2;

const start = {x:1,   y:1};
const end =   {x:250,  y:250};

let matrix = createMatrix(start, end);

console.log('Создание матрицы', performance.now() | 0)

let wave = [];

for(let i=0; i<height; i++){
  wave.push([])
  for(let j=0; j<width; j++){
    if (matrix[i][j] == 1){
      wave[i].push(-1)
    }
    else{
      wave[i].push(null)
    }

  }
}
wave[start.x][start.y] = 0;
wave[end.x][end.y] = -2;
pathExist = true
console.log('Создание волны', performance.now() | 0)

let isFinded = false;
let d = 0;
while(!isFinded){

  for(let i=0; i<height; i++){
    for(let j=0; j<width; j++){

      // Проверка дошли ли до конца


      //Если в то
      if (wave[i][j] == d){

        if( wave[i-1][j] == -2 || wave[i+1][j] == -2 || wave[i][j-1] == -2 || wave[i][j+1] == -2){
              isFinded = true;
        }

        if(wave[i-1][j] === null){
          wave[i-1][j] = d+1;

        }

        if(wave[i+1][j] === null){
          wave[i+1][j] = d+1;
        }

        if(wave[i][j-1] === null){
          wave[i][j-1] = d+1;
        }

        if(wave[i][j+1] === null){
          wave[i][j+1] = d+1;
        }
      }

    }
  }
  d++
  if(d > 500){
    isFinded = true;
    // alert('Путь закрыт')
    showMatrix(matrix)
    pathExist = false
  }
}

console.log('Распространение волны', performance.now() | 0)
//Построение обратного пути

isFinded = false;
let l = 0;
let path = [[end.x, end.y]];
while(!isFinded && pathExist){
  if (path[l][0] == start.x && path[l][1] == start.y){
    isFinded = true;
    continue;
  }


  if(wave[ path[l][0]-1] [ path[l][1] ] === d-1){
    let startTimer = performance.now()
    path.push([ path[l][0]-1, path[l][1] ])


  }

  else if(wave[ path[l][0]+1 ] [ path[l][1] ] === d-1){
    path.push([ path[l][0]+1, path[l][1] ])
  }
  else if(wave[ path[l][0] ] [ path[l][1]-1 ] === d-1){
    path.push([ path[l][0], path[l][1]-1 ])
  }
  else if(wave[ path[l][0] ] [ path[l][1]+1 ] === d-1){
    path.push([ path[l][0], path[l][1]+1 ])
  }




  l++
  d--
}
for(let i of path){
    matrix [i[0]] [i[1]] = 4
}
matrix[start.x][start.y] = 2;
matrix[end.x][end.y] = 3;

console.log('Нахождение обратного пути', performance.now() | 0)


showMatrix(matrix);

console.log('Отрисовка матрицы', performance.now() | 0)


function createMatrix(start,end){
	let arr = [];

	for(let i=0; i<height; i++){
		arr.push([])
		for(let j=0; j<width; j++){
			// arr[i].push(0) // пустая карта
      arr[i].push(Math.round(Math.random()-0.2)) //рандом
		}
	}



  // Рамки
  for(let i=0; i<height; i++){
    arr[i][0] = 1;
    arr[i][height-1] = 1;
  }
  for(let i=0; i<width; i++){
    arr[0][i] = 1;
    arr[width-1][i] = 1;
  }

	return arr;
}

function showText(wave){
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

	canvas.width = height*cellSize/2;
	canvas.height = width*cellSize/2;
	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.font = '10px serif'
	for(var x=0; x<height; x++){
		for(var y=0; y<width; y++){
      ctx.fillText(wave[x][y], x*cellSize/2, y*cellSize/2, cellSize)
		}
	}
}

function showMatrix(matrix){
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let colors = ['#f7f7f7', '#171717', '#f44336', '#2196f3', '#4caf50']


	canvas.width = height*cellSize/2;
	canvas.height = width*cellSize/2;
	// ctx.fillStyle = '#111';
	ctx.fillRect(0,0,canvas.width, canvas.height);

	for(var x=0; x<height; x++){
		for(var y=0; y<width; y++){
      ctx.fillStyle = colors[matrix[x][y]]
      ctx.fillRect(x*cellSize/2, y*cellSize/2, cellSize,cellSize)
		}
	}

}
