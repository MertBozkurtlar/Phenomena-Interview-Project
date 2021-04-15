// Init
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const axis = document.getElementById("source")
const addBtn = document.getElementById("addButton")
const game = document.getElementById("game")
const hero = document.getElementById("hero")
const nameLogo = document.getElementById("nameLogo")

// Dynamic Screen
if(innerWidth < 1440 || innerHeight <900){
    hero.style.top= "10%"
    hero.style.left= "5%"
    nameLogo.style.display = "none"
}
else{
    nameLogo.style.display = ""
}
addEventListener("resize", ()=>{
    if(innerWidth < 1440 || innerHeight <900){
        hero.style.top= "10%"
        hero.style.left= "5%"
        nameLogo.style.display = "none"
    }
    else{
        hero.style.top= "22%"
        hero.style.left= "16%"
        nameLogo.style.display = ""
    }
})

// Canvas Size
canvas.width = 640
canvas.height  = 640

// COORDINATE SYSTEM //
// Coordinate System Variables
var gridSize = 30
var axisSize = 600
var originX = canvas.width / 2
var originY = canvas.height / 2
var axisStartX = originX - axisSize/2
var axisStartY = originY - axisSize/2
var numLines = Math.floor(axisSize/gridSize)
var tickLength = 5

// Create a list of axis values to print 
var values = []
for (var i = -(numLines/2); i <= (numLines/2); i += 1) {
    values.push(i)
}


// Function to draw the coordinate system
function drawAxis(){
    // X Lines
    for(i = 0; i <= numLines; i++){
        c.beginPath()
        // Draw parallel lines from beginning to end
        c.lineTo(axisStartX, axisStartY + gridSize * i)
        c.lineTo(axisStartX + axisSize, axisStartY + gridSize * i)

        // Make the origin axis thicker & red
        if(i == (numLines / 2)){
            c.strokeStyle = "red"
            c.lineWidth = 2
        }
        else{
            c.strokeStyle = "black"
            c.lineWidth = 0.2
        }
        c.stroke()
        c.closePath()

        // Draw ticks of axes
        c.beginPath()
        c.lineTo(axisStartY + i * gridSize, originX - tickLength)
        c.lineTo(axisStartY + i * gridSize, originX + tickLength)
        c.lineWidth = 1
        c.stroke()
        c.closePath()

        // Print values below ticks excluding the origin
        if(i != numLines/2){
            c.font = "12px Poppins"
            c.strokeText(values[i], axisStartY + i * gridSize - (gridSize/10), originX + 3 * tickLength)
        }
    }

    // Y Lines
    for(i = 0; i <= numLines; i++){
        // Draw parallel lines from beginning to end
        c.beginPath()-
        c.lineTo(axisStartX + gridSize * i, axisStartY)
        c.lineTo(axisStartX + gridSize * i, axisStartY + axisSize)

        // Make the origin axis thicker & red
        if(i == ((axisSize / gridSize) / 2)){
            c.strokeStyle = "red"
            c.lineWidth = 2
        }
        else{
            c.strokeStyle = "black"
            c.lineWidth = 0.2
        }
        c.stroke()
        c.closePath()

        
        // Draw ticks of axes
        c.beginPath()
        c.lineTo(originY - tickLength, axisStartX + i * gridSize)
        c.lineTo(originY + tickLength, axisStartX + i * gridSize)
        c.lineWidth = 1
        c.stroke()
        c.closePath()
        // Print values next to ticks excluding the origin
        if(i != numLines/2){
            c.font = "12px Poppins"
            c.strokeText(values[numLines - i], originY + 1.5 * tickLength, axisStartX + i * gridSize + (gridSize/10))
        }
    }
}


// Class for instancing and drawing the line
class Line{
    constructor(m, b, color) {
        this.m = m
        this.b = b
        this.color = color
    }

    // Draw the line on the canvas
    draw() {
        var multiplier = 30  // Equal to grid size
        // Draw the line acoording to variables relative to the origin of the frame
        c.beginPath()
        c.lineTo((originX - (-50 * multiplier)), (originY + ((-50 * this.m - this.b) * multiplier))) // magic numbers correspond to relative infinity
        c.lineTo((originX - (50 * multiplier)), (originY + ((50 * this.m - this.b) * multiplier)))
        c.strokeStyle = this.color
        c.stroke()
        c.closePath()
    }

    // Get the coordinates where the line cross the axes
    getCross(){
        return [[-this.b / this.m, 0], [0, this.b]]
    }
}


// INPUT SYSTEM //
// Initial values and initializers 
var slope = 1
document.getElementById("slopeBox").value = slope
var intercept = 0
document.getElementById("interceptBox").value = intercept

// Synchronize between box input and range input, return the value every frame
function getInput(sliderName, boxName, step){
    var slider = document.getElementById(sliderName)
    var box = document.getElementById(boxName)
    // Change the value of the input box when value of slider changes..
    slider.addEventListener("mousedown", function(){ // ..when press down the mouse
        box.value = slider.value / step
        slider.onmousemove = function() {   // ..move the mouse
            box.value = slider.value / step
        }
    });
    slider.addEventListener("mouseup", function(){
        slider.onmousemove = null   // Destroy the move event listener if mouse is up
    });
    slider.onchange = function(){  // ..when slider is moved by arrow keys
        box.value = slider.value / step
    }

    // Change the value of the slider from the input box
    box.onchange = function(){
        var i = box.value
        slider.value =  i * step
        box.value = Math.round(i * 10)/10
        if(box.value > 10){
            box.value = 10
        }
        if(box.value < -10){
            box.value = -10
        }
    }
    // Return the value of input entities
    return slider.value / step
}


// Show cross-section points
var mousePosX = 0
var mousePosY = 0
canvas.addEventListener("mousemove", function(event) { 
    var cRect = canvas.getBoundingClientRect();        
    mousePosX = Math.round(event.clientX - cRect.left);  
    mousePosY = Math.round(event.clientY - cRect.top);   
});

function showPos(corX, corY){
    posX = originX + corX * gridSize
    posY = originY - corY * gridSize
    if(Math.abs(mousePosX - posX) < 5 && Math.abs(mousePosY - posY) < 5){
        // Show the coordinate position when the cursor is on the point
        var text = "(" + Math.round(corX * 100) / 100 + ", " + Math.round(corY * 100) / 100 + ")"
        if(corX >= 7){shiftX = -100}
        else{shiftX = 16}
        if(corY >= 7){shiftY = -50}
        else{shiftY = 25}
        c.beginPath()
        c.fillStyle = "#6084FF"
        c.fillRect(posX + shiftX , posY-32 - shiftY, text.length * 13, 42)
        c.fillStyle = "white"
        c.font = "30px Poppins"
        c.fillText(text, posX + shiftX, posY - shiftY)
    }
    // Show a dot on crossing points
    c.beginPath()
    c.arc(posX, posY, 5, 0, 2*Math.PI, true)
    c.fillStyle = "#6084FF"
    c.fill()
    c.closePath()
} 


// Play System //

//Initilizer
const learnText = document.getElementById("learnText")  // Show wrong or right
const singleChoice = document.getElementById("singleChoice")
const multipleChoice = document.getElementById("multipleChoice")
const easyBtn = document.getElementById("easyButton")
const mediumBtn = document.getElementById("mediumButton")
const hardBtn = document.getElementById("hardButton")
const nextBtn = document.getElementById("nextButton") // Next button for medium mode
const nextBtnSingle = document.getElementById("nextButtonSingle")  // Next button for easy & hard
const checkBtn = document.getElementById("checkButton")
const difficultySelection = document.getElementById("difficultySelection")
const image = document.getElementById('grass'); // Grass Image

learnText.style.display = "none"
game.style.display = "none"
var gamemode = 3 // Difficulty


// Function to create platform on the canvas
function createPlatform(corX, corY, side){
    const width = 5
    const height = 3
    if(side=="left"){
        var posX = originX + (corX - width) * gridSize
    }else{
        var posX = originX + (corX) * gridSize
    }
    var posY = originY - corY * gridSize
    c.beginPath()
    c.fillStyle = "rgba(38,52,100,0.5)"
    c.drawImage(image, posX,posY, width*gridSize, height*gridSize)
}

// Return random positions for platforms 
function playSystem(){
    while(true){
        var xL = Math.floor(Math.random() * (-2 + 9) - 9)
        var yL = Math.floor(Math.random() * (9 + 9) - 9)
        var xR = Math.floor(Math.random() * (9 - 2) + 2)
        var yR = Math.floor(Math.random() * (9 + 9) - 9)
        var m = (yR - yL) / (xR - xL)
        var b = yR - m * xR
        if(((m / 0.1).toPrecision(3) % 1) == 0 && b % 1 == 0 && m != 0){
            break
        }
    }
    return [[xL,yL], [xR,yR]]
}

// Function to handle the quiz system for medium mode
function mediumMode(question, quizContainer, resultsContainer, submitButton){
	function createQuestion(question, quizContainer){
        // A list for answers
        var answers = []
        // Iterate over every answer in the question
        for(letter in question.answers){
            // Create a radio input for every answer, and append to list of answers
            answers.push('<label>' + '<input style = "margin-top: 20px" type="radio" name="question" value='+letter+'>' +" " + question.answers[letter] + '</label> <br>')
        }
    
        // Put all the answers in an answers division
        var output =  '<div class="answers">' + answers.join('') +'</div>'   
        // Push the division as value of the quiz container
        quizContainer.innerHTML = output
    }

	function checkInput(question, quizContainer, resultsContainer){       
        // Get the selected answer, return undef if none selected
        var chosenAnswer = (document.querySelector('input[name=question]:checked')||{}).value

        // Check if the chosen answer is equal to the correct
        if(chosenAnswer==question.correctAnswer){
            // Hide the information text
            learnText.style.display = ""
            learnText.innerHTML = "Excellent!"
            // Set the variables of the line to correct values
            slope = question.correctValues[0]
            intercept = question.correctValues[1]
            // Handle the button
            nextBtn.style.display = ""
            submitButton.style.display = "none"
            // Give a new question when pressed Next
            nextBtn.addEventListener("click", () => {
                learnText.style.display = "none"
                // Return the line to the default position
                slope = 0
                intercept = 0
                // Handle the button
                nextBtn.style.display = "none"
                submitButton.style.display = ""
                // Create new coordinates for platforms and show the new question/answers
                coord = playSystem()
                myquestion = questionGenerator(coord)
                mediumMode(myquestion, quizContainer, resultsContainer, submitButton)
            })
        }
        // If the answer is incorrect, show the information text
        else{
            learnText.style.display = ""
            learnText.innerHTML = "Looks like you got something wrong :( <br>Would you like to revisit \"Learn\" ?"
        }
    }
	// Show the first question
	createQuestion(question, quizContainer)

	// Check if the answer is correct when click on the submit
	submitButton.onclick = function(){
		checkInput(question, quizContainer, resultsContainer)
	}
}

// Question generator for medium mode
function questionGenerator(correct){
    // A list to prevent duplicates
    questionPool = []
    // Correct answer
    var correctM = (correct[1][1] - correct[0][1]) / (correct[1][0] - correct[0][0])
    var correctB = correct[1][1] - correctM * correct[1][0]
    questionPool.push([correctM,correctB])
    var correctIndex = Math.floor(Math.random() * (3 - 0))
    // Question dictionary
    var question = {question: "Soru", answers: {}, correctAnswer: "", correctValues: [0,0]}
    // Iterate over every choice
    for(var i = 0; i < 3; i++){
        // If its not the correct choice, create random values for m and b and append them as answer
        if(i != correctIndex){
            var coord = playSystem()
            var m = (coord[1][1] - coord[0][1]) / (coord[1][0] - coord[0][0])
            var b = coord[1][1] - m * coord[1][0]
            if([m,b] in questionPool){ // Prevent duplicates
                i -= 1
            }
            else{
                question.answers[i] = "m: " + m + " / b: " + b
                questionPool.push([m,b])
            }
        }else{  // If it is the correct choice, append the correct m and b as answer
            question.answers[i] = "m: " + correctM + " / b: " + correctB
            question.correctAnswer = i
            question.correctValues[0] = correctM
            question.correctValues[1] = correctB
        }
    }
    return question
}


// Easy & Hard
function singleMode(correct){
    // Check if the correct variables selected when the check button pressed
    checkBtn.addEventListener("click", () => {
        var m = (correct[1][1] - correct[0][1]) / (correct[1][0] - correct[0][0])
        var b = correct[1][1] - m * correct[1][0]
        // If its right show the success text and next button
        if(document.getElementById("slopeBox").value == m && document.getElementById("interceptBox").value == b){
            slope = m
            intercept = b
            checkBtn.style.display = "none"
            nextBtnSingle.style.display = ""
            learnText.style.display = ""
            learnText.innerHTML = "Excellent!"
        }
        // If its wrong show the wrong button
        else{
            learnText.style.display = ""
            learnText.innerHTML = "Looks like you got something wrong :( <br>Would you like to revisit \"Learn\" ?"
        }
    })
    // When pressed next, show the next question and check button
    nextBtnSingle.addEventListener("click", () => {
        correct = playSystem()
        globalThis.coord = correct
        nextBtnSingle.style.display = "none"
        checkBtn.style.display = ""
        learnText.style.display = "none"
    })
}


// Global variable to hold platform positions
var coord = [[0,0],[0,0]]

// Set the screen elements according to difficulty selected at the beginning of the game
// Easy
easyBtn.addEventListener("click", () => {
    coord = playSystem()
    nextBtnSingle.style.display = "none"
    game.style.display = ""
    difficultySelection.style.display = "none"
    multipleChoice.style.display = "none"
    gamemode = 0
    singleMode(coord)
})


// Medium
mediumBtn.addEventListener("click", () => {
    coord = playSystem()
    nextBtn.style.display = "none"
    slope = 0
    intercept = 0
    game.style.display = ""
    difficultySelection.style.display = "none"
    singleChoice.style.display = "none"
    var myquestion = questionGenerator(coord)
    var quizContainer = document.getElementById('quiz');
    var resultsContainer = document.getElementById('results');
    var submitButton = document.getElementById('submit');
    gamemode = 1
    mediumMode(myquestion, quizContainer, resultsContainer, submitButton);
})
// Hard
hardBtn.addEventListener("click", () => {
    coord = playSystem()
    nextBtnSingle.style.display = "none"
    game.style.display = ""
    slope = 0
    intercept = 0
    difficultySelection.style.display = "none"
    multipleChoice.style.display = "none"
    document.getElementById("slope").style.display = "none"
    document.getElementById("intercept").style.display = "none"
    document.getElementById("variables").style.gridTemplateColumns = "150px 300px"
    gamemode = 1
    singleMode(coord)
})


// Handle the color change //
// Default values and initializers
var lineColor = "teal"
const colorPickerFirst = document.querySelector("#colorPicker")
const lineBtn = document.getElementById("lineButton")
lineBtn.style.color = "teal"
var colors = ["teal", "blue", "red", "pink", "magenta"]
colorPickerFirstShowing = false
colorPickerFirst.style.display = "none"

// Create a list of color buttons
var colorButtons = []
for(var i = 0; i < 5; i++){
    colorButtons.push(document.getElementById(colors[i]))
}

// Create a event listener for each color button
colorButtons[0].onclick = function () {lineColor = "teal"; lineBtn.style.color = "teal"}
colorButtons[1].onclick = function () {lineColor = "#6084FF"; lineBtn.style.color = "#6084FF"}
colorButtons[2].onclick = function () {lineColor = "red"; lineBtn.style.color = "red"}
colorButtons[3].onclick = function () {lineColor = "pink"; lineBtn.style.color = "pink"}
colorButtons[4].onclick = function () {lineColor = "magenta"; lineBtn.style.color = "magenta"}

// Show/Hide the color palette when clicked on "y" button.
lineBtn.addEventListener("click", () => {
    if(colorPickerFirstShowing){
        colorPickerFirst.style.display = "none"
        colorPickerFirstShowing = false
    }
    else{
        colorPickerFirst.style.display = ""
        colorPickerFirstShowing = true
    }
})

// Play the canvas //
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,2560,1440)

    // Display the axis
    drawAxis()

    if(gamemode != 1){
        // Get inputs
        slope = getInput("slope", "slopeBox", 10)
        intercept = getInput("intercept", "interceptBox", 1)
    }

    // Draw Lines
    c.lineWidth = 4
    const line1 = new Line(slope, intercept, lineColor)
    line1.draw()
    showPos(line1.getCross()[0][0], line1.getCross()[0][1])
    showPos(line1.getCross()[1][0], line1.getCross()[1][1])

    createPlatform(coord[0][0], coord[0][1], "left")
    createPlatform(coord[1][0], coord[1][1], "right")
    showPos(coord[0][0], coord[0][1])
    showPos(coord[1][0], coord[1][1])
}

window.onload = function() {
    animate();
  };