// DOM elements 
const firstOperand = document.getElementById("firstOperand");
const secondOperand = document.getElementById("secondOperand");
const addButton = document.getElementById("addBtn");
const subtractButton = document.getElementById("subtractBtn");
const multiplyButton = document.getElementById("multiplyBtn");
const divideButton = document.getElementById("divideBtn");
const resultBox = document.getElementById("resultBox");

// Used to retrieve the actual numeric value from a user's string input in the text fields.
function retrieveNumber(number) {
    let realNumber = null;
    // Check to make sure the user entered a number
    try {
        realNumber = parseFloat(number.value);
    }   catch (e) {
        alert("Error: Enter a valid number for the operands");
        return;
    }
    return realNumber;
}

// Arithmetic operations

function add() {
    return (retrieveNumber(firstOperand) + retrieveNumber(secondOperand));
}

function subtract() {
    return (retrieveNumber(firstOperand) - retrieveNumber(secondOperand));
}

function multiply() {
    return (retrieveNumber(firstOperand) * retrieveNumber(secondOperand));
}

function divide() {
    // Check user did not divide by 0
    if (retrieveNumber(secondOperand) === 0) {
        alert("Error: Can not divide by 0");
        return null;
    }
    return (retrieveNumber(firstOperand) / retrieveNumber(secondOperand));
}

// Select arithmetic operation depending on which radio button is checked
function calculate() {
    let result = 0;
    if (addButton.checked) {
        result = add();
    }   else if (subtractButton.checked) {
        result = subtract();
    }   else if (multiplyButton.checked) {
        result = multiply();
    }   else if (divideButton.checked) {
        // Return nothing if user divided by 0
        if (divide() === null) {
            return;
        }
        result = divide();
    }   else {
        alert("Error: You must select an operation before trying to calculate");
        return;
    }
    resultBox.textContent = result;
}

