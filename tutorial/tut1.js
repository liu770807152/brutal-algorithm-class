let formula = "10+2x3";
let operator = {
    '+': (num1, num2) => num1 + num2,
    '-': (num1, num2) => num1 - num2,
    'x': (num1, num2) => num1 * num2,
    '/': (num1, num2) => num1 / num2
}

class Int {
    constructor(num) {
        this.num = num;
    }
    evaluate() {
        return this.num;
    }
}

class Operation {
    constructor(num, op, exp) {
        this.num = num;
        this.op = op;
        this.exp = exp;
    }
    evaluate() {
        return operator[this.op](this.num.evaluate(), this.exp.evaluate())
    }
}

function compute(formula) {
    let ast = parse(formula)
    return interpret(ast)
}

// exp = int | operation
// operation = int operator exp
function parse(formula) {
    let [value, err] = parseInt(formula);   // O(n), "123456x..."
    if (err) {
        value = parseOperation(formula);    // O(n*(n-T)*...*1) -> O(n!)
    }
    return value;
}

function parseInt(str) {
    let value = Number(str)
    if (Number.isNaN(value)) {
        return [value, true]
    }
    return [new Int(value), false]
}

function parseOperation(formula) {
    // 10+2x3+ -> 10, +, 2x3
    let i = firstOp(formula)
    return new Operation(
        parseInt(formula.slice(0, i))[0], 
        formula[i],
        parse(formula.slice(i + 1))
    )
}

function firstOp(formula) {
    for (let i = 0; i < formula.length; i++) {
        if (formula[i] in operator) {
            return i
        }
    }
    throw new Error('syntax error')
}

function interpret(ast) {
    return ast.evaluate()
}

console.log(compute(formula))