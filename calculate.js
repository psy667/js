// Вычисление математических выражений с операторами + - * / 

const calc = (rawStr) => {
  const getType = (val) => isNaN(Number(val)) ? 'exp': 'val';
  const getPair = (str) => {
    const operandChars = ['+', '-', '*', '/'];
    const operand = operandChars.filter(i => Boolean(str.indexOf(i)+1))[0];

    const left = str.split(operand).slice(0, -1).join(operand);
    const right = str.split(operand).slice(-1)[0];

    return {left: {type: getType(left), value: left}, 
            right: {type: getType(right), value: right}, 
            operand: operand}
  }

  const operands = {
    '+': (a,b) => a + b,
    '-': (a,b) => a - b,
    '*': (a,b) => a * b,
    '/': (a,b) => a / b
  }

  const iter = (obj) => {
    if(obj.type === 'val'){
      return Number(obj.value);
    }
    const {left, right, operand} = getPair(obj.value);
    const operandFunc = operands[operand];

    return operandFunc(iter(left), iter(right));
  }

  const str = rawStr.split('').filter(i => i !== ' ').join('');
  return iter({type: 'exp', value: str});
}
const rawStr = '2 + 2 * 2';
console.log(calc(rawStr));
