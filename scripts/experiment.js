// Init
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const axis = document.getElementById("source")
const secondary = document.querySelector('#secondary')
const addBtn = document.getElementById("addButton")
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

var showSecond = false   // Default to not to show the second line
var slopeTwo = -1
document.getElementById("slopeBoxTwo").value = slopeTwo
var interceptTwo = 0
document.getElementById("interceptBoxTwo").value = interceptTwo

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

// Handle the button to show the second line
addBtn.addEventListener("click", () => {
    if(showSecond){
        addBtn.innerHTML = "Add Line"
        showSecond = false
        secondary.style.display = "none"
    }
    else{
        addBtn.innerHTML = "Remove Line"
        showSecond = true
        secondary.style.display = ""
    }
})

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

// Handle the color change  
// Default values and initializers
var lineColor = "teal"
var lineColorTwo = "red"
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

// Color handling for the second line
const colorPickerSecond = document.querySelector("#colorPickerTwo")
const lineBtnTwo = document.getElementById("lineButtonTwo")
lineBtnTwo.style.color = "red"
var colors = ["tealTwo", "blueTwo", "redTwo", "pinkTwo", "magentaTwo"]
var colorButtons = []
for(var i = 0; i < 5; i++){
    colorButtons.push(document.getElementById(colors[i]))
}
colorButtons[0].onclick = function () {lineColorTwo = "teal"; lineBtnTwo.style.color = "teal"}
colorButtons[1].onclick = function () {lineColorTwo = "#6084FF"; lineBtnTwo.style.color = "#6084FF"}
colorButtons[2].onclick = function () {lineColorTwo = "red"; lineBtnTwo.style.color = "red"}
colorButtons[3].onclick = function () {lineColorTwo = "pink"; lineBtnTwo.style.color = "pink"}
colorButtons[4].onclick = function () {lineColorTwo = "magenta"; lineBtnTwo.style.color = "magenta"}
colorPickerSecondShowing = false
colorPickerSecond.style.display = "none"
lineBtnTwo.addEventListener("click", () => {
    if(colorPickerSecondShowing){
        colorPickerSecond.style.display = "none"
        colorPickerSecondShowing = false
    }
    else{
        colorPickerSecond.style.display = ""
        colorPickerSecondShowing = true
    }
})



// Play the canvas //
function animate() {
    requestAnimationFrame(animate);
    // Clear the screen at the beginning of each frame
    c.clearRect(0,0,3840,2160)

    // Display the axis
    drawAxis()

    // Call the input handlers for each input entity
    slope = getInput("slope", "slopeBox", 10)
    intercept = getInput("intercept", "interceptBox", 1)

    if(showSecond){
        slopeTwo = getInput("slopeTwo", "slopeBoxTwo", 10)
        interceptTwo = getInput("interceptTwo", "interceptBoxTwo", 1)
    }

    // Draw lines and get axes crossing points
    // First
    c.lineWidth = 3
    const line1 = new Line(slope, intercept, lineColor)
    line1.draw()
    showPos(line1.getCross()[0][0], line1.getCross()[0][1])
    showPos(line1.getCross()[1][0], line1.getCross()[1][1])
    // Second
    if(showSecond){
        c.strokeStyle = "red"
        c.lineWidth = 3
        const line2 = new Line(slopeTwo, interceptTwo, lineColorTwo)
        line2.draw()
        showPos(line2.getCross()[0][0], line2.getCross()[0][1])
        showPos(line2.getCross()[1][0], line2.getCross()[1][1])

        // Show cross-section of two lines
        var xP = (interceptTwo - intercept)/(slope - slopeTwo)
        var yP = slope * xP + intercept
        showPos(xP, yP)
    }
}

// Play the canvas
animate();