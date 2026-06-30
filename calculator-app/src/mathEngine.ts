export interface Token {
  type: 'NUMBER' | 'OPERATOR' | 'FUNCTION' | 'CONSTANT' | 'LPAREN' | 'RPAREN' | 'FACTORIAL';
  value: string;
}

export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  // Normalize expression (replace pretty symbols with evaluateable strings)
  const cleanExpr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/sin⁻¹/g, 'asin')
    .replace(/cos⁻¹/g, 'acos')
    .replace(/tan⁻¹/g, 'atan')
    .replace(/√/g, 'sqrt');

  while (i < cleanExpr.length) {
    const char = cleanExpr[i];
    
    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    
    // Check if it's a number
    if (/[0-9.]/.test(char)) {
      let numStr = '';
      let hasDot = false;
      while (i < cleanExpr.length && /[0-9.]/.test(cleanExpr[i])) {
        if (cleanExpr[i] === '.') {
          if (hasDot) break; // Stop matching at double decimal point
          hasDot = true;
        }
        numStr += cleanExpr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }
    
    // Check if it's a letter (function or constant)
    if (/[a-zA-Z]/.test(char)) {
      let name = '';
      while (i < cleanExpr.length && /[a-zA-Z0-9]/.test(cleanExpr[i])) {
        name += cleanExpr[i];
        i++;
      }
      
      const functions = [
        'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
        'sin', 'cos', 'tan', 'sqrt', 'ln', 'log'
      ];
      
      if (functions.includes(name)) {
        tokens.push({ type: 'FUNCTION', value: name });
      } else if (name === 'pi') {
        tokens.push({ type: 'CONSTANT', value: 'π' });
      } else if (name === 'e') {
        tokens.push({ type: 'CONSTANT', value: 'e' });
      } else {
        throw new Error(`Unknown identifier: ${name}`);
      }
      continue;
    }
    
    // Check operators/brackets
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }
    if (char === '!') {
      tokens.push({ type: 'FACTORIAL', value: '!' });
      i++;
      continue;
    }
    if (['+', '*', '/', '^'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }
    if (char === '-') {
      // Determine if unary or binary minus
      let isUnary = false;
      if (tokens.length === 0) {
        isUnary = true;
      } else {
        const lastToken = tokens[tokens.length - 1];
        if (
          lastToken.type === 'OPERATOR' ||
          lastToken.type === 'LPAREN' ||
          lastToken.type === 'FUNCTION'
        ) {
          isUnary = true;
        }
      }
      
      if (isUnary) {
        tokens.push({ type: 'OPERATOR', value: 'u-' });
      } else {
        tokens.push({ type: 'OPERATOR', value: '-' });
      }
      i++;
      continue;
    }
    
    throw new Error(`Unknown character: ${char}`);
  }
  
  return tokens;
}

export function shuntingYard(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  const precedence: Record<string, number> = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    '^': 4,
    'u-': 5,
  };

  const associativity: Record<string, 'LEFT' | 'RIGHT'> = {
    '+': 'LEFT',
    '-': 'LEFT',
    '*': 'LEFT',
    '/': 'LEFT',
    '^': 'RIGHT',
    'u-': 'RIGHT',
  };

  for (const token of tokens) {
    if (token.type === 'NUMBER' || token.type === 'CONSTANT') {
      output.push(token);
    } else if (token.type === 'FUNCTION') {
      operators.push(token);
    } else if (token.type === 'FACTORIAL') {
      output.push(token);
    } else if (token.type === 'OPERATOR') {
      const o1 = token.value;
      let top = operators[operators.length - 1];
      while (
        top &&
        (top.type === 'OPERATOR' || top.type === 'FUNCTION') &&
        (top.type === 'FUNCTION' ||
          precedence[top.value] > precedence[o1] ||
          (precedence[top.value] === precedence[o1] && associativity[o1] === 'LEFT'))
      ) {
        output.push(operators.pop()!);
        top = operators[operators.length - 1];
      }
      operators.push(token);
    } else if (token.type === 'LPAREN') {
      operators.push(token);
    } else if (token.type === 'RPAREN') {
      let top = operators[operators.length - 1];
      while (top && top.type !== 'LPAREN') {
        output.push(operators.pop()!);
        top = operators[operators.length - 1];
      }
      if (!top) {
        throw new Error('Mismatched brackets');
      }
      operators.pop(); // Pop '('
      if (operators.length > 0 && operators[operators.length - 1].type === 'FUNCTION') {
        output.push(operators.pop()!);
      }
    }
  }

  while (operators.length > 0) {
    const op = operators.pop()!;
    if (op.type === 'LPAREN' || op.type === 'RPAREN') {
      throw new Error('Mismatched brackets');
    }
    output.push(op);
  }

  return output;
}

export function evaluateRPN(rpn: Token[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const val = parseFloat(token.value);
      if (isNaN(val)) throw new Error('Invalid number');
      stack.push(val);
    } else if (token.type === 'CONSTANT') {
      if (token.value === 'π') {
        stack.push(Math.PI);
      } else if (token.value === 'e') {
        stack.push(Math.E);
      } else {
        throw new Error('Unknown constant');
      }
    } else if (token.type === 'FACTORIAL') {
      if (stack.length < 1) throw new Error('Empty stack for factorial');
      const val = stack.pop()!;
      const res = factorial(val);
      if (isNaN(res)) throw new Error('Invalid factorial');
      stack.push(res);
    } else if (token.type === 'OPERATOR') {
      if (token.value === 'u-') {
        if (stack.length < 1) throw new Error('Empty stack for unary operator');
        const val = stack.pop()!;
        stack.push(-val);
      } else {
        if (stack.length < 2) throw new Error('Empty stack for binary operator');
        const y = stack.pop()!;
        const x = stack.pop()!;
        let res: number;
        switch (token.value) {
          case '+':
            res = x + y;
            break;
          case '-':
            res = x - y;
            break;
          case '*':
            res = x * y;
            break;
          case '/':
            if (y === 0) throw new Error('Division by zero');
            res = x / y;
            break;
          case '^':
            res = Math.pow(x, y);
            break;
          default:
            throw new Error(`Unknown operator: ${token.value}`);
        }
        stack.push(res);
      }
    } else if (token.type === 'FUNCTION') {
      if (stack.length < 1) throw new Error('Empty stack for function');
      const x = stack.pop()!;
      let res: number;
      switch (token.value) {
        case 'sin':
          res = Math.sin(x * Math.PI / 180);
          break;
        case 'cos':
          res = Math.cos(x * Math.PI / 180);
          break;
        case 'tan':
          if (Math.abs(Math.cos(x * Math.PI / 180)) < 1e-15) {
            throw new Error('Tangent undefined');
          }
          res = Math.tan(x * Math.PI / 180);
          break;
        case 'asin':
          if (x < -1 || x > 1) throw new Error('Arcsin domain error');
          res = Math.asin(x) * 180 / Math.PI;
          break;
        case 'acos':
          if (x < -1 || x > 1) throw new Error('Arccos domain error');
          res = Math.acos(x) * 180 / Math.PI;
          break;
        case 'atan':
          res = Math.atan(x) * 180 / Math.PI;
          break;
        case 'sinh':
          res = Math.sinh(x);
          break;
        case 'cosh':
          res = Math.cosh(x);
          break;
        case 'tanh':
          res = Math.tanh(x);
          break;
        case 'sqrt':
          if (x < 0) throw new Error('Sqrt domain error');
          res = Math.sqrt(x);
          break;
        case 'ln':
          if (x <= 0) throw new Error('Ln domain error');
          res = Math.log(x);
          break;
        case 'log':
          if (x <= 0) throw new Error('Log domain error');
          res = Math.log10(x);
          break;
        default:
          throw new Error(`Unknown function: ${token.value}`);
      }
      stack.push(res);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Malformed expression');
  }

  return stack[0];
}

export function evaluateExpression(expression: string): string {
  try {
    const trimmed = expression.trim();
    if (!trimmed) return '0';
    if (trimmed === '0') return '0';
    
    const tokens = tokenize(trimmed);
    
    // Auto-close parenthetical tokens for intermediate evaluations
    let openParens = 0;
    for (const token of tokens) {
      if (token.type === 'LPAREN') openParens++;
      if (token.type === 'RPAREN') openParens--;
    }
    while (openParens > 0) {
      tokens.push({ type: 'RPAREN', value: ')' });
      openParens--;
    }
    
    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn);
    
    if (isNaN(result) || !isFinite(result)) {
      return 'Error';
    }
    
    return formatResult(result);
  } catch (error) {
    return 'Error';
  }
}

// Factorial function
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Combinatorics: nPr
export function nPr(n: number, r: number): number {
  if (n < 0 || r < 0 || n < r || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
  return factorial(n) / factorial(n - r);
}

// Combinatorics: nCr
export function nCr(n: number, r: number): number {
  if (n < 0 || r < 0 || n < r || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

// Statistics: Mean
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Statistics: Variance (Sample Variance)
export function variance(values: number[]): number {
  if (values.length <= 1) return 0;
  const m = mean(values);
  return values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / (values.length - 1);
}

// Statistics: Standard Deviation
export function stddev(values: number[]): number {
  if (values.length <= 1) return 0;
  return Math.sqrt(variance(values));
}

// Format result rounding to 10 significant figures
export function formatResult(num: number): string {
  if (num === 0) return '0';
  
  let str = num.toPrecision(10);
  
  if (str.includes('e')) {
    const [mantissa, exponent] = str.split('e');
    const cleanMantissa = parseFloat(mantissa).toString();
    return `${cleanMantissa}e${exponent}`;
  }
  
  return parseFloat(str).toString();
}
