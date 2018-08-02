'use strict';
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let scale = 4;

function point(x, y, color){
	ctx.fillStyle = color;
	ctx.fillRect(x*scale,y*scale,scale,scale);
}

function move(x,y,lastPoint, color){
	let shadow = color+'5';
	point(lastPoint[0], lastPoint[1],'#fff');
	point(lastPoint[0], lastPoint[1],shadow);
	point(lastPoint[0]+x, lastPoint[1]+y, color);
	if(+x != x){
		console.log(x,y)
	}
	return [lastPoint[0]+x, lastPoint[1]+y]
}

function random(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function getRange(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

function setPlant(x,y,value){
	plants.push([x,y,value])
	point(x,y,'#55dd55');
}

function setWater(x,y,value){
	water.push([x,y,value]);
	point(x,y,'#8888ff');
}

function setDied(x,y,value){
	died.push([x,y,value])
	point(x,y,'#000');
}

let antsCount = 0;
let allAntsCount = 0;
let antsCounter = document.getElementById('antsCounter');


class Ant{
	constructor(id, population, coord){
		this.alive = true;
		this.id = id;
		this.population = population;
		
		antsCount++;
		allAntsCount++;

		this.color = popProp[this.population].color;
		
		this.lastPoint = coord;
		this.tick = random(0,popProp[this.population].duration);
		this.count = 5;
		this.x = random(-1,2);
		this.y = random(-1,2);
	}
	
	eat(n){
		foods[this.population]-=n;
	}
	
	moveAnt(){
		if(this.tick > popProp[this.population].duration){
			this.die(this.id);
		}
		if(this.tick % this.count === 0){
			this.x = random(-1,2);
			this.y = random(-1,2);
			this.count = random(2,popProp[this.population].step);
		}
		
		if(foods[this.population] < populations[this.population]*popProp[this.population].eatRate){
			this.die(this.id)
		}
		
		if(foods[this.population] > populations[this.population]*popProp[this.population].birthCost+popProp[this.population].birthCost*2){
			this.reproduce();
			this.eat(popProp[this.population].birthCost);
		}
		
		if(this.tick % 100 === 0){
			
			this.eat(popProp[this.population].eatRate);
				
		}
		
		
				
		this.target = targets[this.population];
		
		
		if(this.target){
		
		
			let range = getRange(this.target[0]+this.x, this.target[1]+this.y, this.lastPoint[0], this.lastPoint[1]);
			let lastRange =  getRange(this.target[0], this.target[1], this.lastPoint[0], this.lastPoint[1]);
			if(range > lastRange){
				this.lastPoint = move(this.x,this.y, this.lastPoint, this.color);
				this.tick++;
			}
			else{
				this.count = random(2,popProp[this.population].step);
				this.x = random(-1,2);
				this.y = random(-1,2);
			}
			if(range < 1){
				if(popProp[this.population].color == '#e22'){
					//foods[3]-=popProp[this.population].eatQuickness/10;
					
					for(let i = 0; i<ants.length; i++){
						if(ants[i].lastPoint[0] == this.target[0] && ants[i].lastPoint[1] == this.target[1]){
							ants[i].tick+=20000;
						}
					}
					this.target[2]-=popProp[this.population].eatQuickness*1000;
					foods[this.population]+=popProp[this.population].eatQuickness;
				}
				
				else{
					this.target[2]-=popProp[this.population].eatQuickness;
					foods[this.population]+=popProp[this.population].eatQuickness;
				}
				//foodCounters[this.population].innerHTML = foods[this.population];
			}
			if(this.target[2] < 0){
				targets[this.population] = null;
				point(this.target[0],this.target[1],'#fff');
			}	
		}
		
			
		else{
			this.lastPoint = move(this.x,this.y, this.lastPoint, this.color);
			this.tick++;
		}
		
		
		
		for(let i = 0; i<popProp[this.population].foodType.length; i++){
			if(!this.target){
			
				
				if(popProp[this.population].foodType[i] && getRange(popProp[this.population].foodType[i][0]+this.x, popProp[this.population].foodType[i][1]+this.y, this.lastPoint[0], this.lastPoint[1]) < popProp[this.population].rangeVisible){
					targets[this.population] = [0,0,0]
					targets[this.population][0] = popProp[this.population].foodType[i][0];
					targets[this.population][1] = popProp[this.population].foodType[i][1];
					targets[this.population][2] = popProp[this.population].foodType[i][2];
					popProp[this.population].foodType[i] = null;
					
					break;
				}
			}
		}
		
			
		
	
	}
	start(id){

		this.live = setInterval(function(){
			ants[id].moveAnt.call(ants[id]);
		},50)
	}
	
	die(id){
		populations[this.population]--;
		
		setDied(this.lastPoint[0], this.lastPoint[1], popProp[this.population].deadCapacity);
		
		clearInterval(this.live)
		this.alive = false;
	}
	
	reproduce(){
		add(this.population, this.lastPoint);
		populations[this.population]++;
	}
	

}

let targets = [null,null]

let foods = [1000];
let plants = [];
let foodCounters = [];
let popCounters = [];
let water = [];
let died = [];
let meat = [];
let populations = [];

let popProp = [
{ 						//Падальщики
	eatRate: 10, 			//Сколько потребляет энергии за один прием пищи
	foodType: died,			//Тип пищи
	rangeVisible: 10,		//На каком расстоянии замечает пищу
	birthCost: 2000,		//Сколько энергии требуется для размоножения
	duration: 20000,		//Продолжительность жизни
	step: 6,				//Дальность шага
	color: '#444',			//Цвет
	eatQuickness: 500,		//Скорость поедания
	deadCapacity: 2000,		//Энергетическая ценность трупа
},
{						//Хищник
	eatRate: 50,
	foodType: meat,
	rangeVisible: 15,
	birthCost: 7000,
	duration: 20000,
	step: 2,
	color: '#e22',
	eatQuickness: 5000,
	deadCapacity: 3000,
},
{
	eatRate: 15,		//Рыба
	foodType: water,
	rangeVisible: 20,
	birthCost: 100,
	duration: 20000,
	step: 6,
	color: '#22e',
	eatQuickness: 50,
	deadCapacity: 2000,
},
{
	eatRate: 5,		//Мелкое травоядное
	foodType: plants,
	rangeVisible: 30,
	birthCost: 10,
	duration: 20000,
	step: 4,
	color: '#e90',
	eatQuickness: 50,
	deadCapacity: 200,
},
{
	eatRate: 10,		//Рыба
	foodType: water,
	rangeVisible: 10,
	birthCost: 50,
	duration: 20000,
	step: 10,
	color: '#2ee',
	eatQuickness: 100,
	deadCapacity: 200,
},
{
	eatRate: 400,		//Травоядный динозавр
	foodType: plants,
	rangeVisible: 2,
	birthCost: 25000,
	duration: 60000,
	step: 1,
	color: '#e2e',
	eatQuickness: 2000,
	deadCapacity: 10000,
}
]

let ants = new Array();



function add(population, coord){
	ants[allAntsCount] = new Ant(allAntsCount, population, coord);
	ants[allAntsCount-1].start(allAntsCount-1);
	if(!foods[population]){
		
		foods.push(1000);
	}
}

for(let i = 0; i< 512; i++){
	let x = random(50,150);
	let y = random(50, 150);
	if(getRange(x,y,100,100) < 50){
		setPlant(x, y, random(0,1000));
	}
}

setInterval(function(){//главный цикл
	let x = random(0,200);
	let y = random(0, 200);
	if(getRange(x,y,100,100) < 80){
		setPlant(x, y, random(0,1000));
	}
	else{
		setWater(x,y, random(0, 1000));
	}
	
	ctx.fillStyle = '#ffffff09';
	ctx.fillRect(0,0,800,800);
	
	for(let i = 0; i<plants.length; i++){
		if(plants[i]){
			point(plants[i][0],plants[i][1],'#55dd55');
		}
	}
	
	for(let i = 0; i<died.length; i++){
		if(died[i]){
			point(died[i][0],died[i][1],'#000');
		}
	}
	
	for(let i = 0; i<water.length; i++){
		if(water[i]){
			point(water[i][0],water[i][1],'#8888ff');
		}
	}
	
	for(let i = 0; i < populations.length; i++){
		foodCounters[i].innerHTML = foods[i];
		popCounters[i].innerHTML = populations[i];
	}
	for(let i = 0; i<ants.length; i++){
		meat.shift();
	}
	for(let i = 0; i<ants.length; i++){
		if(ants[i].alive && ants[i].population === 3){
			meat.push(ants[i].lastPoint.concat(ants[i].tick/100))
		}
	}
	
	
},50);

let coord = [100,100];
for(let i = 0; i< 5; i++){
	for(let j = 0; j< 8; j++){
		coord = [random(50,150),random(50,150)]
		add(i, coord);
		populations[i] = j+1;
	}
	foodCounters.push(document.getElementById('foodCounter'+i));
	popCounters.push(document.getElementById('popCounter'+i));
}


add(5, coord);
add(5, coord);
foods[5] = 10000;
populations[5] = 2;
foodCounters.push(document.getElementById('foodCounter5'));
popCounters.push(document.getElementById('popCounter5'));
//['#444','#e22','#22e','#e90','#2ee','#e2e']

setInterval(function(){
	populations.forEach(function(item, i){
		if(item == 0){
		let n = new Date;
		console.log(`РџРѕРїСѓР»СЏС†РёСЏ ${i} РІС‹РјРµСЂР»Р° \n${n}`);
		populations[i] = -1;
		}
		
    }
)
}
,1000)