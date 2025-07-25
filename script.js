// Calculator state
let display = "0";
let equation = "";
let history = [];

// DOM elements
const mainDisplay = document.getElementById('mainDisplay');
const equationDisplay = document.getElementById('equationDisplay');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Event listeners
clearHistoryBtn.addEventListener('click', clearHistory);

// Utility functions
function evaluateExpression(expr) {
    try {
        // Replace display symbols with JavaScript operators
        const jsExpr = expr.replace(/×/g, "*").replace(/÷/g, "/");
        // Use Function constructor for safe evaluation
        return Function('"use strict"; return (' + jsExpr + ")")();
    } catch {
        return 0;
    }
}

function updateCalculation(newEquation) {
    equation = newEquation;
    equationDisplay.textContent = equation;

    // Only evaluate if equation doesn't end with an operator
    if (newEquation && !/[+\-×÷]\s*$/.test(newEquation)) {
        const result = evaluateExpression(newEquation);
        display = String(result);
        updateDisplay();
    }
}

function updateDisplay() {
    mainDisplay.textContent = formatDisplay(display);
}

function updateHistory() {
    if (history.length > 0) {
        historySection.style.display = 'block';
        historyList.innerHTML = '';
        
        // Show last 3 entries
        const recentHistory = history.slice(-3);
        recentHistory.forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = entry;
            historyList.appendChild(historyItem);
        });
    } else {
        historySection.style.display = 'none';
    }
}

function formatDisplay(value) {
    const num = parseFloat(value);
    if (Math.abs(num) >= 1000000000) {
        return num.toExponential(2);
    }
    return value;
}

// Calculator functions
function inputNumber(num) {
    if (equation === "" || /[+\-×÷]\s*$/.test(equation)) {
        // Starting new number or after operator
        const newEquation = equation + num;
        updateCalculation(newEquation);
    } else {
        // Continuing current number
        const newEquation = equation + num;
        updateCalculation(newEquation);
    }
}

function inputDecimal() {
    if (equation === "") {
        updateCalculation("0.");
    } else if (/[+\-×÷]\s*$/.test(equation)) {
        updateCalculation(equation + "0.");
    } else {
        // Check if current number already has decimal
        const parts = equation.split(/[+\-×÷]/);
        const currentNumber = parts[parts.length - 1];
        if (!currentNumber.includes(".")) {
            updateCalculation(equation + ".");
        }
    }
}

function performOperation(op) {
    if (equation === "") {
        // Start with current display value
        const newEquation = display + " " + op + " ";
        equation = newEquation;
        equationDisplay.textContent = equation;
    } else if (/[+\-×÷]\s*$/.test(equation)) {
        // Replace last operator
        const newEquation = equation.replace(/[+\-×÷]\s*$/, " " + op + " ");
        equation = newEquation;
        equationDisplay.textContent = equation;
    } else {
        // Add operator to current equation
        const newEquation = equation + " " + op + " ";
        equation = newEquation;
        equationDisplay.textContent = equation;
    }
}

function handleEquals() {
    if (equation && !/[+\-×÷]\s*$/.test(equation)) {
        const result = evaluateExpression(equation);
        const historyEntry = equation + " = " + result;
        history.push(historyEntry);
        updateHistory();
        equation = "";
        equationDisplay.textContent = "";
        display = String(result);
        updateDisplay();
    }
}

function clearAll() {
    display = "0";
    equation = "";
    equationDisplay.textContent = "";
    updateDisplay();
}

function clearHistory() {
    history = [];
    updateHistory();
}

function backspace() {
    if (equation.length > 0) {
        // Remove the last character from equation
        let newEquation = equation.slice(0, -1);
        
        // If we removed a space or operator, clean up trailing spaces
        newEquation = newEquation.replace(/\s+$/, '');
        
        if (newEquation === "") {
            // If equation becomes empty, reset to "0"
            display = "0";
            equation = "";
            equationDisplay.textContent = "";
            updateDisplay();
        } else {
            // Update with the new equation
            updateCalculation(newEquation);
        }
    } else if (display !== "0") {
        // If no equation but display has content, backspace the display
        if (display.length > 1) {
            display = display.slice(0, -1);
        } else {
            display = "0";
        }
        updateDisplay();
    }
}

function percentage() {
    const value = parseFloat(display);
    display = String(value / 100);
    updateDisplay();
}

// Initialize display
updateDisplay();