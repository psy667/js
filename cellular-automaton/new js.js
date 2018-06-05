var width = 170;
var height = 360;

function update(arr){
	var matrix  = arr;
	var b = copy(matrix)
	
	function check(x,y){
		var sum = 0;
		var arr1;
		var arr2;
		
		if (matrix[x][y] !==0){
			sum-=matrix[x][y];
		}
		
		arr1 = arr2 = [-1,0,1];
		
		if(x===0){
			arr1 = [0,1];
		}
		else if(x == height-1){
			arr1 = [-1,0];
		}

		if(y===0){
			arr2 = [0,1];
		}
		else if(y == width-1){
			arr2 = [-1,0];
		}
		
		for(var k = 0; k< arr1.length; k++){
			for(var l = 0; l< arr2.length; l++){
				sum+=matrix[x + arr1[k]][y + arr2[l]];
			}
		}
		return sum
	}
	
	for(var x=0; x<height; x++){
		for(var y=0; y<width; y++){
			
			if (matrix[x][y] === 0){
				if(check(x,y) == 3){
					b[x][y] = 1;
				}
				else{
					b[x][y] = 0
				}
			}
			else{
				if(check(x,y) === 2 || check(x,y) === 3){
					b[x][y] = 1;
				}
				else{
					b[x][y] = 0;
				}
			}
		}
	}
	
	return b
}

function createMatrix(){
	var arr = [];
	for(var i=0; i<height; i++){
		arr.push([])

		for(var j=0; j<width; j++){
			arr[i].push(Math.round(Math.random()-0.2) )
		}
	}

	arr[2][1] = 1;arr[2][2] = 1;arr[2][3] = 1;
	return arr;
}

function copy(n){
	return JSON.parse(JSON.stringify(n))
}

var m = createMatrix();

function create(){
	m = createMatrix();
}

function output(){
	m = update(m);
	document.getElementById('out').innerHTML = '';
//	for(var t = 0;t<height;t++){
//		document.getElementById('out').innerHTML = document.getElementById('out').innerHTML + '<br>'+(m[t]);
//	}
	
	
	var bg = document.getElementById('bg');
	var ctx = bg.getContext('2d');
	var cellSize = 10;
	
	//
	bg.width = height*cellSize/2+20;
	bg.height = width*cellSize/2+20;
	ctx.fillStyle = '#222';
	ctx.fillRect(0,0,bg.width, bg.height);

	for(var x=0; x<height; x++){
		for(var y=0; y<width; y++){
			if (m[x][y] === 1){
				ctx.fillStyle = 'lime';
				ctx.fillRect(x*cellSize/2 + cellSize, y*cellSize/2 + cellSize,cellSize/2,cellSize/2)

			}
		}
	}
	//
}

var delay = 60;
var stop = -1
var timerID
function start(){
	stop*=-1
	if (stop == 1){
		timerID = setInterval(output,delay);
		document.getElementById('start').innerHTML = 'STOP';
	}
	else{
		clearTimeout(timerID);
		document.getElementById('start').innerHTML = 'START';
	}
}

