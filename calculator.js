const firstOperand = document.getElementById("firstOperand");
const secondOperand = document.getElementById("secondOperand");
const addButton = document.getElementById("addBtn");
const subtractButton = document.getElementById("subtractBtn");
const multiplyButton = document.getElementById("multiplyBtn");
const divideButton = document.getElementById("divideBtn");
const resultBox = document.getElementById("resultBox");

function retrieveNumber(number) {
    // console.log("number is: " + number);
    let realNumber = null;
    try {
        // console.log("number.value is: " + number.value);
        realNumber = parseFloat(number.value);
    }   catch (e) {
        alert("Error: Enter a valid number for the operands");
        return;
    }
    // console.log("The returned value is: " + realNumber);
    return realNumber;
}

function add() {
    console.log(firstOperand.value);
    // console.log("First thing added is: " + retrieveNumber(firstOperand));
    return (retrieveNumber(firstOperand) + retrieveNumber(secondOperand));
}

function subtract() {
    return (retrieveNumber(firstOperand) - retrieveNumber(secondOperand));
}

function multiply() {
    return (retrieveNumber(firstOperand) * retrieveNumber(secondOperand));
}

function divide() {
    if (retrieveNumber(secondOperand) === 0) {
        alert("Error: Can not divide by 0");
        return null;
    }
    return (retrieveNumber(firstOperand) / retrieveNumber(secondOperand));
}

function calculate() {
    let result = 0;
    if (addButton.checked) {
        result = add();
    }   else if (subtractButton.checked) {
        result = subtract();
    }   else if (multiplyButton.checked) {
        result = multiply();
    }   else if (divideButton.checked) {
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

