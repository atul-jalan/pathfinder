/*
------------------------------VARIABLE DECLARATION------------------------------
*/

/*Lists of the four dropdown types*/
/*The id for each html element that populates the dropdown is the element in the list itself*/
algorithm = ["A*", "Dijkstra's Algorithm", "Greedy Best First", "Depth First Search", "Breadth First Search", ];
maze = ["Recursive Division", "Atul's Algorithm", "Basic Columns", "Basic Rows"];
speed = ["slow", "average", "fast", "ultra fast", "lightning"];
size = ["small", "normal", "large", "massive"]; //15 per column is small, 30 is medium, 45 is large

/*Lists outlining the possible sizes for grid and solve speeds*/
sizeChart = [15, 30, 45, 60]; //size of each column
speedChart = [35, 20, 10, 5, 1]; //time in ms between each event

/*The initially selected items from each dropdown type*/
algorithmSelected = undefined;
mazeSelected = undefined;
speedSelected = speed[2];
sizeSelected = size[1];

/*Number of rows and columns - gets updated when numRows is decided*/
rows = 0;
columns = 0;

/*To use for functions that need speed calculation - updated on changeSpeed function*/
currentSpeed = speedChart[2];

/*Position of start and finish square on grid*/
startPosition = [];
finishPosition = [];

/*Variable that returns whether or not the grid has been cleared. Begins as true. Becomes trues when at least path is cleared*/
gridCleared = true;

/*variable that returns whether the mouse is down. Starts as false - becomes true when mouse is down within the grid*/
mouseIsDown = false;
downOnStartPos = false;
downOnFinishPos = false;

/*variable used to disable the solve and clear buttons while a visualization is still running*/
finishedVisualization = true;

/*
------------------------------ON PAGE LOAD------------------------------
*/

/*Functions that run on the page loading*/
window.onload = function(){
	resizeElements();

	populateAlgorithmDropdown(algorithm);
	populateMazeDropdown(maze);
	populateSpeedDropdown(speed);
	populateSizeDropdown(size);

	grid = drawRects(getNumRows());
	rows = grid[0];
	columns = grid[1];

	initializeGraph(rows, columns);
}

window.onresize = function(){
	resizeElements();
}

const resizeElements = () => {
	tutorial = document.getElementById('tutorial');

	width = window.innerWidth;
	if (width < 1100){
		document.getElementById('headerLeft').style.visibility = 'hidden';
		document.getElementById('headerLeft').style.zIndex = -1;
		document.getElementById('headerLeft').style.position = "absolute";
	}
	else if (width < 1450){
		document.getElementById('headerLeft').style.visibility = 'visible';
		document.getElementById('headerLeft').style.zIndex = 0;
		document.getElementById('headerLeft').style.position = "relative";
		document.documentElement.style.setProperty('--header-margin', 10 + "px");
		document.getElementById("pageTitle").innerHTML = "Pathfinder";
	} else {
		document.getElementById('headerLeft').style.visibility = 'visible';
		document.getElementById('headerLeft').style.zIndex = 0;
		document.getElementById('headerLeft').style.position = "relative";
		document.documentElement.style.setProperty('--header-margin', 30 + "px");
		document.getElementById("pageTitle").innerHTML = "Pathfinder by Atul Jalan";
	}

	height = window.innerHeight;

	tutorial.style.marginTop = (height/2 - 260) + "px";
	tutorial.style.marginLeft = (width/2 - 400) + "px";

	headerHeight = document.getElementById('fixedHeader').clientHeight;

	gridHeight = height - headerHeight - 40;

	gridCSS = document.getElementById('grid');

	gridCSS.style.height = gridHeight + "px";
	gridCSS.style.marginTop = 20 + "px";

	document.getElementById('spacing').style.height = headerHeight + "px";
}

/*
------------------------------TUTORIAL------------------------------
*/

const showTutorial = e => {
	e.preventDefault();

	tutorialDiv = document.getElementById('tutorial');

	if(tutorialDiv.style.visibility == 'visible'){
		tutorialDiv.style.visibility = 'hidden';
		document.getElementById("tutorialButton").innerHTML = "Tutorial"
	} else {
		tutorialDiv.style.visibility = 'visible';
		document.getElementById("tutorialButton").innerHTML = "Close Tutorial"
	}
}

/*
------------------------------POPULATE------------------------------
*/

/*Populates the four dropdown menus with content*/
/*Accepts a list as input*/
const populateAlgorithmDropdown = algorithm => {
	content = "";

	for(let i = 0; i < algorithm.length; i++){
		id = algorithm[i];
		content += '<a href="" class="dropdownA" id="' + id + '" onclick="processAlgorithmChange(event, this.id)">' + algorithm[i] + '</a>';
	}

	document.getElementById('algorithmDropdownContent').innerHTML = content;
}
const populateMazeDropdown = maze => {
	content = "";

	for(let i = 0; i < maze.length; i++){
		id = maze[i];
		content += '<a href="" class="dropdownA" id="' + id + '" onclick="processMazeChange(event, this.id)">' + maze[i] + '</a>';
	}

	document.getElementById('mazeDropdownContent').innerHTML = content;
}
const populateSpeedDropdown = speed => {
	content = "";

	for(let i = 0; i < speed.length; i++){
		id = speed[i];
		content += '<a href="" class="dropdownA" id="' + id + '" onclick="processSpeedChange(event, this.id)">' + speed[i] + '</a>';
	}

	document.getElementById('speedDropdownContent').innerHTML = content;
	document.getElementById(speedSelected).className = "dropdownASelected";
}
const populateSizeDropdown = size => {
	content = "";

	for(let i = 0; i < size.length; i++){
		id = size[i];
		content += '<a href="" class="dropdownA" id="' + id + '" onclick="processSizeChange(event, this.id)">' + size[i] + '</a>';
	}

	document.getElementById('sizeDropdownContent').innerHTML = content;
	document.getElementById(sizeSelected).className = "dropdownASelected";
}

/*
------------------------------PROCESS DROPDOWN CHANGE------------------------------
*/

/*Processes changed choices in the dropdown menu*/
/*Accepts an event and id of the clicked on choice as input*/
/*Returns nothing*/
const processAlgorithmChange = (e, id) => {
	e.preventDefault();
	algorithmSelected = newDropdownSelection(algorithmSelected, id);
}
const processMazeChange = (e, id) => {
	e.preventDefault();

	clearAll();
	mazeSelected = newDropdownSelection(mazeSelected, id);

	if (mazeSelected == "Recursive Division"){
		recursiveDivision(0, rows-1, 0, columns-1, currentSpeed, rows-1, columns-1);
	} else if (mazeSelected == "Basic Columns"){
		basicColumns(rows, columns, currentSpeed);
	} else if (mazeSelected == "Atul's Algorithm"){
		atulAlgorithm(startPosition, finishPosition, rows, columns, currentSpeed);
	} else if (mazeSelected == "Basic Rows"){
		basicRows(rows, columns, currentSpeed);
	}
}
const processSpeedChange = (e, id) => {
	e.preventDefault();
	speedSelected = newDropdownSelection(speedSelected, id);
	changeSpeed();
}
const processSizeChange = (e, id) => {
	e.preventDefault();

	sizeSelected = newDropdownSelection(sizeSelected, id);

	finishedVisualization = true;

	if (mazeSelected != undefined){
		document.getElementById(mazeSelected).className = "dropdownA";
		mazeSelected = undefined;
	}

	gridDimensions = drawRects(getNumRows());
	rows = gridDimensions[0];
	columns = gridDimensions[1];

	initializeGraph(rows, columns);

	gridCleared = true;
}

/*Returns new selection (string)*/
/*Highlights the new selection and unhighights the old one.*/
const newDropdownSelection = (currentSelect, newSelect) => {
	if (currentSelect != undefined){
		document.getElementById(currentSelect).className = "dropdownA";
	}
	document.getElementById(newSelect).className = "dropdownASelected";
	return newSelect;
}

/*
------------------------------PROCESS CLEAR/SOLVE BUTTONS------------------------------
*/

const processSolveButton = e => {
	e.preventDefault();

	if (finishedVisualization == true){
		if (algorithmSelected == undefined){
			alert("Please select an algorithm!");
			return;
		}
		finishedVisualization = false;
		document.getElementById('solveButton').innerHTML = "Stop";
		if (gridCleared != true){
			clearPath();
		}
		gridCleared = false;

		if (algorithmSelected == "Breadth First Search"){
			BFS(startPosition, currentSpeed);
		} else if (algorithmSelected == "Depth First Search"){
			DFS(startPosition, currentSpeed);
		} else if (algorithmSelected == "A*"){
			aStar(startPosition, finishPosition, currentSpeed);
		} else if (algorithmSelected == "Greedy Best First"){
			greedyBestFirst(startPosition, finishPosition, currentSpeed);
		} else if (algorithmSelected == "Dijkstra's Algorithm"){
			BFS(startPosition, currentSpeed);
		}
	} else {
		finishedVisualization = true;
		document.getElementById('solveButton').innerHTML = "Solve";
	}
}
const processClearAll = e => {
	e.preventDefault();
	if (finishedVisualization == true){
		clearAll();
	}
}
const processClearPath = e => {
	e.preventDefault();
	if (finishedVisualization == true){
		clearPath();
	}
}

/*runs clearCosmeticGrid after resetting graph*/
const clearAll = () => {
	resetGraph(rows, columns, startPosition, finishPosition);
	clearCosmeticGrid();
	gridCleared = true;

	if (mazeSelected != undefined){
			document.getElementById(mazeSelected).className = "dropdownA";
			mazeSelected = undefined;
	}
}
/*Runs clearPathLoop after resetting graph*/
const clearPath = () => {
	resetGraph(rows, columns, startPosition, finishPosition);
	clearPathLoop();
	gridCleared = true;
}

/*Clears both the cosmetic grid path and adds walls to the newly generated graph -- performing both visual and backend work*/
const clearPathLoop = () => {
	for(let i = 0; i < rows; i++){
		for (let j = 0; j < columns; j++){
			removeRectBorders([i, j], "var(--main-blue)");
			id = i + " " + j;
			rect = document.getElementById(id);
			if (rect.style.backgroundColor != "var(--main-blue)"){
				rect.style.backgroundColor = "white";
			} else {
				addWall([i, j]);
			}
		}
	}
}
/*Clears the cosmetic grid of everything but the starting and finishing image*/
const clearCosmeticGrid = () => {
	for(let i = 0; i < rows; i++){
		for (let j = 0; j < columns; j++){
			removeRectBorders([i, j], "var(--main-blue)");
			id = i + " " + j;
			rect = document.getElementById(id);
			rect.style.backgroundColor = "white";
		}
	}
}

/*
------------------------------PROCESS GRID CHANGES------------------------------
*/

/*Changes color of rects that exist on best path*/
const showBestPath = nodeList => {
	timeout = [];
	for (let i = 0; i < nodeList.length;i++){
		timeout.push([]);
		timeout[timeout.length-1] = setTimeout(function(){
			if (finishedVisualization != true){
				id = nodeList[i].row + " " + nodeList[i].column;
				rect = document.getElementById(id);
				rect.style.backgroundColor = "var(--main-yellow)";
				removeRectBorders([nodeList[i].row, nodeList[i].column], "var(--yellow-dark)");
				if (i == nodeList.length - 1){
					finishedVisualization = true;
					document.getElementById('solveButton').innerHTML = "Solve";
				}
			} else {
				for (let j = 0; j < timeout.length; j++){
					clearTimeout(timeout[j]);
				}
			}
		}, (currentSpeed * 3) * (i + 1));	
	}
}
/*Changes color of rects that exist on algorithm path*/
const showAlgorithmPath = position => {
	id = position[0] + ' ' + position[1];
	rect = document.getElementById(id);

	if (rect.style.backgroundColor == "white"){
		rect.style.backgroundColor = "var(--main-grid-blue)";
		removeRectBorders(position, "var(--main-grid-dark-blue)");
	} else if (rect.style.backgroundColor == "var(--main-grid-blue)"){
		rect.style.backgroundColor = "var(--main-grid-red)";
		removeRectBorders(position, "var(--main-grid-dark-red)");
	}
}

const removeRectBorders = (position, color) => {

	borderStyle = "1px solid " + color;

	id = position[0] + ' ' + position[1];
	rect = document.getElementById(id);

	rect.style.borderRight = borderStyle;
	rect.style.borderBottom = borderStyle;

	if (position[0] != 0){
		newRow =  position[0] - 1
		newId = newRow + ' ' + position[1];
		newRect = document.getElementById(newId);

		newRect.style.borderBottom = borderStyle;
	} else {
		rect.style.borderTop = borderStyle;
	}

	if (position[1] != 0){
		newColumn =  position[1] - 1
		newId = position[0] + ' ' + newColumn;
		newRect = document.getElementById(newId);

		newRect.style.borderRight = borderStyle;
	} else {
		rect.style.borderLeft = borderStyle;
	}
}

/*First two functions - when the mouse is pressed within the grid, then mouse is 
down becomes true and vice versa.*/
/*return nothing*/
const mouseDown = e => {
	e.preventDefault();
	mouseIsDown = true;
}
const mouseUp = e => {
	e.preventDefault();
	if (mouseIsDown == true){
		mouseIsDown = false;
	}
	if (downOnStartPos == true){
		downOnStartPos = false;
		id = startPosition[0] + " " + startPosition[1];
		rect = document.getElementById(id);

		if(rect.style.backgroundColor == "var(--main-blue)"){
			rect.style.backgroundColor = "white";
			removeWall(startPosition);
		} else if (rect.style.backgroundColor != "white"){
			graph[startPosition[0]][startPosition[1]].subtractVisited();
			rect.style.backgroundColor = "white";
		}
	} else if (downOnFinishPos == true){
		downOnFinishPos = false;
		id = finishPosition[0] + " " + finishPosition[1];
		rect = document.getElementById(id);
		
		if(rect.style.backgroundColor == "var(--main-blue)"){
			rect.style.backgroundColor = "white";
			removeWall(finishPosition);
		} else if (rect.style.backgroundColor != "white"){
			graph[finishPosition[0]][finishPosition[1]].subtractVisited();
			rect.style.backgroundColor = "white";
		}
	}
}

/*Rect IDs are as follows: "ROW COLUMN" -- there is a space in between*/
/*Event triggered when mouse is pressed down on one of the rectangles - turns rectangle dark or light depending on current state*/
const processRectMouseDown = (e, id) => {
	e.preventDefault();
	position = id.split(" ");
	if (graph[position[0]][position[1]].start == true){
		downOnStartPos = true;
	} else if (graph[position[0]][position[1]].finish == true) {
		downOnFinishPos = true;
	} else {
		downOnStartPos = false;
		downOnFinishPos = false;
		processRectInteraction(id);
	}
}
/*Event triggered when cursor is dragged over on one of the rectangles - turns rectangle dark or light depending on current state*/
/*Something only happens thoug when mouseIsDown is true (refer above)*/
const processRectMouseOver = (e, id) => {
	e.preventDefault();
	if (mouseIsDown == true && downOnStartPos == false && downOnFinishPos == false){
		processRectInteraction(id);
	} else if ((downOnStartPos == true && finishedVisualization == true) || (downOnFinishPos == true && finishedVisualization == true)){
		processChangingKeyPosPosition(id);
	}
}

/*Processes a change in the state of the rect - whether or not it has a wall*/
const processRectInteraction = id => {
	position = id.split(' ');
	position[0] = parseInt(position[0]);
	position[1] = parseInt(position[1]);

	if (clickValid(position) == true){

		rect = document.getElementById(id);

		if (rect.style.backgroundColor == "white"){
			rect.style.backgroundColor = "var(--main-blue)"
			addWall(position);
		} else if (rect.style.backgroundColor == "var(--main-blue)"){
			rect.style.backgroundColor = "white";
			removeWall(position);
		}
	}
}

const processChangingKeyPosPosition = id => {
	newRect = document.getElementById(id);

	if (downOnStartPos == true){
		oldId = startPosition[0] + " " + startPosition[1];
		oldRect = document.getElementById(oldId);
		oldRect.style.backgroundImage = "";

		newRect.style.backgroundImage = "url(./images/start-128px.png)";
		newRect.style.backgroundSize = "100% 100%";

		startPosition = id.split(" ");
		setStart(oldId.split(" "), startPosition);

	} else if (downOnFinishPos == true){
		oldId = finishPosition[0] + " " + finishPosition[1];
		oldRect = document.getElementById(oldId);
		oldRect.style.backgroundImage = "";

		newRect.style.backgroundImage = "url(./images/finish-128px.png)";
		newRect.style.backgroundSize = "100% 100%";

		finishPosition = id.split(" ");
		setFinish(oldId.split(" "), finishPosition);
	}
}

const clickValid = position => {
	if (position[0] == startPosition[0] && position[1] == startPosition[1]){
		return false;
	} else if (position[0] == finishPosition[0] && position[1] == finishPosition[1]){
		return false;
	}

	return true;
}

/*accepts position ([row, column]) as input. returns nothing.*/
const setStartPos = position => {
	startPosition = position;

	rectId = position[0] + ' ' + position[1];
	rect = document.getElementById(rectId);
	rect.style.backgroundImage = "url(./images/start-128px.png)";
	rect.style.backgroundSize = "100% 100%";
}
const setFinishPos = position => {
	finishPosition = position;

	rectId = position[0] + ' ' + position[1];
	rect = document.getElementById(rectId);
	rect.style.backgroundImage = "url(./images/finish-128px.png)";
	rect.style.backgroundSize = "100% 100%";
}

/*
------------------------------DRAW GRID------------------------------
*/

/*draws all rectangles to the grid*/
const drawRects = rows => {

	/*the size of the div element containing the rectangles*/
	winWidth = document.getElementById("grid").clientWidth - 2;
	winHeight = document.getElementById("grid").clientHeight - 2;
	ratio = winWidth/winHeight;

	/*number of rectangles per column and row.*/
	//rows passed in
	columns = Math.floor(rows * ratio)
	numRects = rows * columns;

	/*width and height of each rectangle*/
	rectWidth = winWidth / columns - 1;
	rectHeight = winHeight / rows - 1;

	/*adds all the rectangles to the div*/

	content = "";
	for(let i = 0; i < rows; i++){
		for (let j = 0; j < columns; j++){
			id = i + ' ' + j;
			content += '<div class="rect" id="' + id + '" onmouseover="processRectMouseOver(event, this.id)" onmousedown="processRectMouseDown(event, this.id)"></div>';
		}
	}
	document.getElementById("grid").innerHTML = content;
		
	/*ADD BORDERS TO EACH RECTANGLE*/
	/*Since you want each border to be 1px, it gets complex
	because simply setting a border for each element would result
	in 2px borders between most elements - e.g. adding border bottom
	and border top for two adjacent rectangles. Thus, the following
	system:*/

	rectangles = document.getElementsByClassName("rect");
	border = "1px solid rgb(11,60,93)"

	/*Gives all the rectangles the proper width and height*/
	for(let i = 0; i < rectangles.length; i++){
		rectangles[i].style.width = rectWidth + "px";
		rectangles[i].style.height = rectHeight + "px";

		/*Gives each rectangle in the leftmost column a left border*/
		if (i % columns == 0){
			rectangles[i].style.borderLeft = border;
		}
	}

	/*Gives each rectangle in the topmost row a top border*/
	for(let i = 0; i < columns; i++){
		rectangles[i].style.borderTop = border;
	}

	/*Gives all rectangles a right and bottom border and white color*/
	for(let i = 0; i < rectangles.length; i++){
		rectangles[i].style.borderRight = border;
		rectangles[i].style.borderBottom = border;
		rectangles[i].style.backgroundColor = 'white';
	}

	return [rows, columns];
}

/*
------------------------------OTHER------------------------------
*/

/*Returns the number of rows depending on which size grid the user selects*/
const getNumRows = () => {
	if (sizeSelected == "small"){
		return sizeChart[0];
	} else if (sizeSelected == "large"){
		return sizeChart[2];
	} else if (sizeSelected == "massive"){
		return sizeChart[3];
	}
	return sizeChart[1];
}
const changeSpeed = () => {
	if (speedSelected == "slow"){
		currentSpeed = speedChart[0];
	} else if (speedSelected == "average"){
		currentSpeed = speedChart[1];
	} else if (speedSelected == "fast"){
		currentSpeed = speedChart[2];
	} else if (speedSelected == "ultra fast"){
		currentSpeed = speedChart[3];
	} else if (speedSelected == "lightning"){
		currentSpeed = speedChart[4];
	}
}