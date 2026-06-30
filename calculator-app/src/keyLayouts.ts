export interface ButtonDef {
  label: string;
  action: string;
  type: 'digit' | 'operator' | 'function' | 'constant' | 'action' | 'bracket' | 'modal' | 'spacer';
}

export const basicLayout: ButtonDef[][] = [
  // Grid above Bottom Bar
  [
    { label: 'AC', action: 'clear', type: 'action' },
    { label: 'DEL', action: 'delete', type: 'action' },
    { label: '(', action: '(', type: 'bracket' },
  ],
  [
    { label: '7', action: '7', type: 'digit' },
    { label: '8', action: '8', type: 'digit' },
    { label: '9', action: '9', type: 'digit' },
  ],
  [
    { label: '4', action: '4', type: 'digit' },
    { label: '5', action: '5', type: 'digit' },
    { label: '6', action: '6', type: 'digit' },
  ],
  [
    { label: '1', action: '1', type: 'digit' },
    { label: '2', action: '2', type: 'digit' },
    { label: '3', action: '3', type: 'digit' },
  ],
  [
    { label: '0', action: '0', type: 'digit' },
    { label: '.', action: '.', type: 'digit' },
    { label: ')', action: ')', type: 'bracket' },
  ],
];

export const scientificLayout: ButtonDef[][] = [
  // Grid above Bottom Bar (Split into Left: Scientific, Right: Basic)
  [
    { label: 'sin', action: 'sin(', type: 'function' },
    { label: 'cos', action: 'cos(', type: 'function' },
    { label: 'tan', action: 'tan(', type: 'function' },
    { label: 'AC', action: 'clear', type: 'action' },
    { label: 'DEL', action: 'delete', type: 'action' },
    { label: '(', action: '(', type: 'bracket' },
  ],
  [
    { label: 'sin⁻¹', action: 'sin⁻¹(', type: 'function' },
    { label: 'cos⁻¹', action: 'cos⁻¹(', type: 'function' },
    { label: 'tan⁻¹', action: 'tan⁻¹(', type: 'function' },
    { label: '7', action: '7', type: 'digit' },
    { label: '8', action: '8', type: 'digit' },
    { label: '9', action: '9', type: 'digit' },
  ],
  [
    { label: 'sinh', action: 'sinh(', type: 'function' },
    { label: 'cosh', action: 'cosh(', type: 'function' },
    { label: 'tanh', action: 'tanh(', type: 'function' },
    { label: '4', action: '4', type: 'digit' },
    { label: '5', action: '5', type: 'digit' },
    { label: '6', action: '6', type: 'digit' },
  ],
  [
    { label: '√', action: '√(', type: 'function' },
    { label: 'ln', action: 'ln(', type: 'function' },
    { label: 'log', action: 'log(', type: 'function' },
    { label: '1', action: '1', type: 'digit' },
    { label: '2', action: '2', type: 'digit' },
    { label: '3', action: '3', type: 'digit' },
  ],
  [
    { label: 'x²', action: '^2', type: 'operator' },
    { label: '^', action: '^', type: 'operator' },
    { label: 'π', action: 'π', type: 'constant' },
    { label: '0', action: '0', type: 'digit' },
    { label: '.', action: '.', type: 'digit' },
    { label: ')', action: ')', type: 'bracket' },
  ],
  [
    { label: 'e', action: 'e', type: 'constant' },
    { label: 'nPr', action: 'nPr', type: 'modal' },
    { label: 'nCr', action: 'nCr', type: 'modal' },
    { label: 'STAT', action: 'STAT', type: 'modal' },
    { label: '', action: '', type: 'spacer' },
    { label: '', action: '', type: 'spacer' },
  ],
];

// Bottom Bar Row for operators (used in both basic and scientific modes)
export const bottomBarLayout: ButtonDef[] = [
  { label: '+', action: '+', type: 'operator' },
  { label: '-', action: '-', type: 'operator' },
  { label: '×', action: '×', type: 'operator' },
  { label: '÷', action: '÷', type: 'operator' },
  { label: '=', action: 'equals', type: 'operator' },
];
