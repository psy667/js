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
*/
//console.log('Загрузка', performance.now() | 0)

'use strict';
let cellSize = 3;


let height
let width

let start = {
    x: 1,
    y: 1
};

let end = {
    x: width - 5,
    y: height - 5
};

let matrix
let born, survive
let wave
createTerrain()

function createTerrain() {
    cellSize = document.getElementById('cellsize').value;
    height = (window.innerWidth / (cellSize / 2) - 5) | 0;
    width = (window.innerHeight / (cellSize / 2) - 10) | 0;
    
    height = 256
    width = 256
    matrix = createMatrix();

//    born = {6: '',7: '',8: '',9: '',9: '',9: ''};
//    survive = {3: '',4: '',5: '',6: '',7: '',8: ''};
//
//    for (let i = 0; i < 10; i++) {
//        output()
//    };
//
//    born = survive = {5: '',6: '',7: '',8: ''};
//
//    for (let i = 0; i < 10; i++) {
//        output()
//    };
//
//    born = {}
//
//    for (let i = 0; i < 2; i++) {
//        output()
//    };
    showMatrix(matrix)
}


function output() {
    matrix = update(matrix);

    for (let i = 0; i < height; i++) {
        matrix[i][0] = 1;
        matrix[i][width - 1] = 1;
    }
    for (let i = 0; i < width; i++) {
        matrix[0][i] = 1;
        matrix[height - 1][i] = 1;
    }

    showMatrix(matrix);
}

function main(startPoint, endPoint) {
    let startTimer = performance.now()
    clearPath(matrix)
    start = {
        x: startPoint[0],
        y: startPoint[1]
    };
    end = {
        x: endPoint[0],
        y: endPoint[1]
    };
    matrix[start.x][start.y] = 2;
    matrix[end.x][end.y] = 3;
    wave = createWaveMatrix(matrix);
    wave = startWave(wave, start);
    findPath(wave[0], wave[1])
    document.getElementById('timer').innerHTML = +((performance.now() - startTimer) | 0) + 'ms'
    showMatrix(matrix);
}
// wave = null;
// path = null;
// matrix = null;

function clearPath(matrix) {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (matrix[i][j] == 3 || matrix[i][j] == 2 || matrix[i][j] == 4) {
                matrix[i][j] = 0;
            }
        }
    }
}


function findPath(wave, d) {
    //Построение обратного пути

    let isFinded = false;
    let l = 0;
    let path = [
        [end.x, end.y]
    ];

    while (!isFinded && wave) {


        try {
            if (path[l][0] == start.x && path[l][1] == start.y) {
                isFinded = true;
                continue;
            }
        } catch (e) {
            document.getElementById('timer').innerHTML = 'Path not found'
            showMatrix(matrix);
        }



        for (let i of [[0, -1],[-1, 0],[1, 0],[0, 1],[-1, -1],[1, -1],[-1, 1],[1, 1]]) {
            let n = i[0];
            let k = i[1];
            if (wave[path[l][0] + n][path[l][1] + k] === d - 1) {
                path.push([path[l][0] + n, path[l][1] + k])
                break;
            }
        }
        
        l++
        d--

    }


    for (let i of path) {
        matrix[i[0]][i[1]] = 4
    }
    
    matrix[start.x][start.y] = 2;
    matrix[end.x][end.y] = 3;
}

function copy(n) {
    return JSON.parse(JSON.stringify(n))
}


function startWave(wave) {
    let pathExist = true
    let isFinded = false;
    let d = 0;
    let array;
    let n = 1;
    let count = 0;
    let newarr;
    let arr = [
        [
            [start.x, start.y]
        ]
    ]

    let timer = performance.now()

    while (n) {
        n++

        if (n > width * 4) {
            n = 0;
        }

        arr.push([
            []
        ])
        array = '[';

        for (let i of arr[d]) {
            let k = i[0];
            let l = i[1];
            newarr = fillNull(k, l);
            arr[d + 1] = []

            for (let m of newarr) {
                array += ',' + JSON.stringify(m)
                count++
            }
        }

        array = array.replace(',', '');

        arr[d + 1] = JSON.parse(array + ']')
        arr[d] = [];
        d++

    }
    arr = null;
    array = null;
    return [wave, d]

    function fillNull(i, j) {
        let newarr = [];
        for (let l = -1; l < 2; l++) {
            for (let k = -1; k < 2; k++) {
                if (l || k) {
                    if (wave[i + l][j + k] == -2) {
                        n = 0;
                    }

                    if (wave[i + l][j + k] == null) { //Добавляем соседей
                        wave[i + l][j + k] = d + 1;
                        newarr.push([i + l, j + k]);
                    }
                }
            }
        }
        return newarr;
    }

}



function createWaveMatrix(matrix) { // матрица для волны
    let wave = [];

    for (let i = 0; i < height; i++) {
        wave.push([])
        for (let j = 0; j < width; j++) {
            if (matrix[i][j] == 1) {
                wave[i].push(-1)
            } else {
                wave[i].push(null)
            }
        }
    }

    wave[start.x][start.y] = 0;
    wave[end.x][end.y] = -2;
    return wave
}

function createMatrix() {
    let arr = [];

    for (let i = 0; i < height; i++) {
        arr.push([])
        for (let j = 0; j < width; j++) {
//             arr[i].push(0) // пустая карта
            arr[i].push(Math.round(Math.random() + 0.08)) //рандом
        }
    }

    // Рамки
    for (let i = 0; i < height; i++) {
        arr[i][0] = 1;
        arr[i][width - 1] = 1;
    }
    for (let i = 0; i < width; i++) {
        arr[0][i] = 1;
        arr[height - 1][i] = 1;
    }


    return arr;
}

function showText(wave) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = height * cellSize / 2;
    canvas.height = width * cellSize / 2;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '10px serif'
    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            ctx.fillText(wave[x][y], x * cellSize / 2, y * cellSize / 2, cellSize)
        }
    }
}


function showMatrix(matrix) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
//    let colors = ['#f7f7f7', '#171717', '#f44336', '#2196f3', '#4caf50']
    let colors = ['#555', '#171717', '#f44336', '#2196f3', '#4caf50']


    canvas.width = height * cellSize / 2;
    canvas.height = width * cellSize / 2;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            ctx.fillStyle = colors[matrix[x][y]]
            ctx.fillRect(x * cellSize / 2, y * cellSize / 2, cellSize, cellSize)
        }
    }

}



function update(arr) {

    let matrix = arr;
    let b = copy(matrix)

    function check(x, y) {
        let sum = 0;
        let arr1;
        let arr2;

        if (matrix[x][y] !== 0) {
            sum -= matrix[x][y];
        }

        arr1 = arr2 = [-1, 0, 1];

        if (x === 0) {
            arr1 = [0, 1];
        } else if (x == height - 1) {
            arr1 = [-1, 0];
        }

        if (y === 0) {
            arr2 = [0, 1];
        } else if (y == width - 1) {
            arr2 = [-1, 0];
        }

        for (let k = 0; k < arr1.length; k++) {
            for (let l = 0; l < arr2.length; l++) {
                sum += matrix[x + arr1[k]][y + arr2[l]];
            }
        }
        return sum
    }

    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {

            if (matrix[x][y] === 0) {
                if (check(x, y) in born) {
                    b[x][y] = 1;
                } else {
                    b[x][y] = 0
                }
            } else {
                if (check(x, y) in survive) {
                    b[x][y] = 1;
                } else {
                    b[x][y] = 0;
                }
            }
        }
    }

    return b
}

function div(a, b) {
    return (a - a % b) / b;
}


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let last = [];
let now = [];

canvas.addEventListener('mousemove', function(evt) {
    let mousePos = getMousePos(canvas, evt);
    let x = div(mousePos.x, cellSize / 2);
    let y = div(mousePos.y, cellSize / 2);
    now = [x, y];
    
    if (matrix[x][y] == 0) {
        main(last, now)
    }

}, false);

canvas.addEventListener('click', function(evt) {
    let mousePos = getMousePos(canvas, evt);
    let x = div(mousePos.x, cellSize / 2);
    let y = div(mousePos.y, cellSize / 2);
    last = [x, y]
}, false);