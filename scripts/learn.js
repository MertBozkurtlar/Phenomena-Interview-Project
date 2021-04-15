// Init
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const axis = document.getElementById("source")
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


// LEARN SYSTEM
const sections = {
    0: "Welcome to Phenomena! <br>This little app was designed to teach you the most fundamental equation of algebra, intuitively. <br>Let's start with" + 
    " changing the color of the line. Press the green colored \"y\" just below this text and change the color to red. <br>Then press \"Next\" to get to the next section!",
    1: "Now, you'll learn how to control the variables. Below the equation, you'll see sliders and input boxes. We'll learn about slope and intercept later," +
    "but for now play with them as you wish. <br>Press \"Next\" when you are ready.",
    2: "Can you see the little blue dots on the graph? That shows you the axis intercepts, where the line crosses an axis! Hover your mouse over it and see what happens." + 
    "<br>Those are the coordinates of that spot. First one corresponds to the horizontal position, x, and the second one is the vertical position, y." +
    "<br>Press \"Next\" when you are ready.",
    3: "Now is the time to learn the linear functions. As the name suggests, graphs of the linear functions are lines. You can see a linear graph on the left." +
    "<br> For a function to be called a linear function, it has to satisfy two conditions. First, variables' exponents should be equal to one and second, they can not have more than 2 variables."+
    "<br>Press \"Next\" to learn what that means.",
    4: "As you can see below, general formula of linear functions has two variables, x and y. Y is called the dependent variable since it changes" +
    " with x. And x is called the independent variable. <br> Press \"Next\" to learn more!",
    5: "Our first condition is that the powers of these variables should be equal to 1. That means that if you see terms like x^2 or x^1/2 in a function," +
    " it is not a linear function. In the function below, x and y both have the power of one so it satisfies our first condition. <br>To learn about second condition, press next.",
    6: "Our second condition for a function to be a linear function was that it should have only one or two variables. In the general form, you can see that there are two variables." + 
    "If you wonder what would happen to our graph if you only had y variable, set m to zero and observe!" + 
    "<br>Press \"Next\" when you are ready!",
    7: "Slope is the steepness of the graph. Higher the slope is steeper the graph. Positive slope suggests the value increases as you go to the right side of the graph." +
    " And the negative slope means the opposite, value decreases as you go to right!" +
    "You will usually see the slope referred to as \"m\" in equations. <br>Try fiddling with slope slider and press \"Next\" when you are ready",
    8: "Let's see how we can find the slope. Slope is the ratio of the difference in y to the difference in x. Choose two different points on the line. " + 
    " Find the difference between their y coordinates. Then do the same for their x coordinates. Divide the former to the latter. Thats your slope!" + 
    " <br> You can memorise this as rise/run. Use the interactive plot and try this concept by yourself and press \"Next\" when you are ready",
    9: "Intercept constant shows you where the function crosses the y axis. If you want to move the graph up, increase the intercept. And if you want to move it down, decrease the intercept." + 
    " With 0 as the intercept, the line will cross the y-axis at 0. And with -3, it will cross the axis at -3" +
    " You will usually see the intercept referred to as \"b\" in equations. Try fiddling with intercept slider and press \"Next\" when you are ready",
    10: "Now let's learn how to calculate intercept constant, b. <br>You already know how to calculate the slope. After calculating the slope, you choose one point on the line." +
    "Then you can simply solve the equation for b. <br> Press \"Next\" to see an example!",
    11: "For example let's say you calculated your slope as 2 and one of the points on the line is (1,4) " +
    " When you put everything in your formula you end up with the equation 4=2*1+b. By solving this equation for b, you can see that b is equal to 2. <br>Press \"Next\" when you are ready. ", 
    12: "Now you have gained the fundamental understanding of the topic. Now you can either \"Experiment\" by yourself or you can gain confidence while having fun by \"Play\"ing a game!" +
    "<br>Have Fun :)"
}

index = 0
const learnText = document.getElementById("learnText")
learnText.innerHTML = sections[0]
const nextBtn = document.getElementById("nextButton")
const backBtn = document.getElementById("backButton")
backBtn.style.display = "none"
// Show the next text when pressed on next
nextBtn.addEventListener("click", () => {
    index += 1
    learnText.innerHTML = sections[index]
    if(index == 12){
        nextBtn.style.display = "none"
    }
    if(index == 1){
        backBtn.style.display = ""
    }
})
backBtn.addEventListener("click", ()=> {
    index -= 1
    learnText.innerHTML = sections[index]
    if(index == 0){
        backBtn.style.display = "none"
    }
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
    c.clearRect(0,0,3840,2160)

    // Display the axis
    drawAxis()

    // Get inputs
    slope = getInput("slope", "slopeBox", 10)
    intercept = getInput("intercept", "interceptBox", 1)


    // Draw Lines
    // First
    c.lineWidth = 3
    const line1 = new Line(slope, intercept, lineColor)
    line1.draw()
    showPos(line1.getCross()[0][0], line1.getCross()[0][1])
    showPos(line1.getCross()[1][0], line1.getCross()[1][1])

}
animate();