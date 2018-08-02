'use strict';
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let scale = 4;

function point(x, y, color){
	ctx.fillStyle = color;
	ctx.fillRect(x*scale,y*scale,scale,scale);
}

function move(x,y,lastPoint, color){
	point(lastPoint[0], lastPoint[1],'#fff5');
	let shadow = color+'0';
	//point(lastPoint[0], lastPoint[1],shadow);
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
		
		if(this.tick % 10 === 0){
			
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
				
					let quickness = popProp[this.population].eatQuickness;
					
					for(let i = 0; i<ants.length; i++){
						if(ants[i].lastPoint[0] == this.target[0] && ants[i].lastPoint[1] == this.target[1]){
							ants[i].tick+=20000;
							
							if(this.target[2] < popProp[this.population].eatQuickness){
							quickness = this.target[2];
					}
					
							this.target[2]-=quickness;
							foods[this.population]+=Math.round(quickness)
						}
					}
					
					
				}
				
				else{
					let quickness = popProp[this.population].eatQuickness;
		
					if(this.target[2] < popProp[this.population].eatQuickness){
						quickness = this.target[2];
					}
					
					this.target[2]-=quickness;
					foods[this.population]+=quickness
					
					
				}
				//foodCounters[this.population].innerHTML = foods[this.population];
			}
			if(this.target[2] < 1){
				targets[this.population] = null;
				point(this.target[0],this.target[1],'#fff');
			}	
		}
		
			
		else{
			this.lastPoint = move(this.x,this.y, this.lastPoint, this.color);
			this.tick++;
		}
		
		
		
		for(let i = 0; i<popProp[this.population].foodType.length; i++){
			//console.log(popProp[this.population].foodType[i])
			if(popProp[this.population].foodType[i] && this.population != 1){
				let x = popProp[this.population].foodType[i][0];
				let y = popProp[this.population].foodType[i][1];
				
				if(x == this.lastPoint[0]+this.x && y == this.lastPoint[1]+this.y){
					let quickness = popProp[this.population].eatQuickness;
					if(popProp[this.population].foodType[i][2] < popProp[this.population].eatQuickness){
						quickness = popProp[this.population].foodType[i][2];
					}
					
					popProp[this.population].foodType[i][2]-=quickness;
					foods[this.population]+=quickness
					//console.log(this.population, quickness)
					targets[this.population] = null;
				}
			}
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
let popProp
popProp = [
{ 						//Падальщики
	eatRate: 5, 			//Сколько потребляет энергии за один прием пищи
	foodType: died,			//Тип пищи
	rangeVisible: 20,		//На каком расстоянии замечает пищу
	birthCost: 2000,		//Сколько энергии требуется для размоножения
	duration: 20000,		//Продолжительность жизни
	step: 3,				//Дальность шага
	color: '#444',			//Цвет
	eatQuickness: 5000,		//Скорость поедания
	deadCapacity: 500,		//Энергетическая ценность трупа
},
{						//Хищник
	eatRate: 20,
	foodType: meat,
	rangeVisible: 10,
	birthCost: 4000,
	duration: 40000,
	step: 1,
	color: '#e22',
	eatQuickness: 4000,
	deadCapacity: 3000,
},
{
	eatRate: 10,		//Рыба
	foodType: water,
	rangeVisible: 5,
	birthCost: 500,
	duration: 20000,
	step: 1,
	color: '#22e',
	eatQuickness: 5000,
	deadCapacity: 500,
},
{
	eatRate: 8,		//Мелкое травоядное
	foodType: plants,
	rangeVisible: 5,
	birthCost: 100,
	duration: 7000,
	step: 2,
	color: '#e90',
	eatQuickness: 1500,
	deadCapacity: 50,
},
{
	eatRate: 3,		//Рыба
	foodType: water,
	rangeVisible: 30,
	birthCost: 100,
	duration: 20000,
	step: 2,
	color: '#2ee',
	eatQuickness: 1000,
	deadCapacity: 100,
},
{
	eatRate: 40,		//Травоядный динозавр
	foodType: plants,
	rangeVisible: 20,
	birthCost: 15000,
	duration: 80000,
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

for(let i = 0; i< 5000; i++){
	let x = random(0,200);
	let y = random(0, 200);
	if(random(0,1) == 0){
		if(getRange(x,y,100,100) < random(60,70)){
			setPlant(x, y, random(0,1000));
		}
		else{
			setWater(x,y, random(1000, 2000));
		}
	}
}

setInterval(function(){//главный цикл
	let x = random(0,200);
	let y = random(0, 200);
	if(random(0,1) == 0){
		if(getRange(x,y,100,100) < random(60,70)){
			setPlant(x, y, random(0,5000));
		}
		else{
			setWater(x,y, random(2000, 3000));
		}
	}
	ctx.fillStyle = '#ffffff08';
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
		if(ants[i].alive && ants[i].population != 1 && ants[i].population != 0){
			meat.push(ants[i].lastPoint.concat(ants[i].tick))
		}
	}
	
	
},100);

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