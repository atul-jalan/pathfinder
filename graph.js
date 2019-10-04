/*
------------------------------DATA STRUCTURES------------------------------
*/

class node {
	constructor(visited, start, finish, row, column){
		this._visited = visited;
		this._start = start;
		this._finish = finish;
		this._row = row;
		this._column = column;
		this._neighbors = [];
		this._deletedNeighbors = [];
		this._g = undefined;
		this._h = undefined;
		this._f = undefined;
		this._startConnect = false;
		this._finishConnect = false;
		this._parent = undefined;
	}

	addNeighbor(node){
		this._neighbors.push(node);
		const index = this._deletedNeighbors.indexOf(node);
		if (index != -1){
			this._deletedNeighbors.splice(index, 1);
		}
	}
	subtractNeighbor(node){
		const index = this._neighbors.indexOf(node);
		if (index != -1){
			this._neighbors.splice(index, 1);
			this._deletedNeighbors.push(node);
		}
	}

	addVisited(){
		this._visited = true;
	}
	subtractVisited(){
		this._visited = false;
	}

	addStart(){
		this._start = true;
	}
	substractStart(){
		this._start = false;
	}

	addFinish(){
		this._finish = true;
	}
	substractFinish(){
		this._finish = false;
	}

	addG(g){
		this._g = g;
	}

	addF(f){
		this._f = f;
	}

	addH(h){
		this._h = h;
	}
	addParent(parent){
		this._parent = parent;
	}
	addStartConnect(){
		this._startConnect = true;
	}
	addFinishConnect(){
		this._finishConnect = true;
	}

	get visited(){
		return this._visited;
	}
	get start(){
		return this._start;
	}
	get finish(){
		return this._finish;
	}
	get row(){
		return this._row;
	}
	get column(){
		return this._column;
	}
	get neighbors(){
		return this._neighbors;
	}
	get deletedNeighbors(){
		return this._deletedNeighbors;
	}
	get g(){
		return this._g;
	}
	get f(){
		return this._f;
	}
	get h(){
		return this._h
	}
	get parent(){
		return this._parent;
	}
	get startConnect(){
		return this._startConnect;
	}
	get finishConnect(){
		return this._finishConnect;
	}
}

class simpleNode {
	constructor(node){
		this._node = node;
		this._next = null;
	}

	addNext(node){
		this._next = node;
	}

	removeNext(){
		this._next = null;
	}

	get node(){
		return this._node;
	}

	get next(){
		return this._next;
	}
}

class LinkedList {
	constructor(){
		this._head = null;
		this._last = this._head;
		this._size = 0;
	}
	addNode(node){
		this._size += 1;

		if (this._head == null){
			this._head = node;
			this._last = this._head;
		} else {
			this._last.addNext(node);
			this._last = node;
		}
	}

	removeLast(){
		if (this._head == null){
			this._last = this._head;
		} else {
			this._last = this._head;
			while(this._last.next.next != null){
				this._last = this._last.next;
			}
			this._last.removeNext();
		}
	}

	removeHead(){
		this._size -= 1;
		let returnNode = this._head;
		this._head = this._head.next;
		return returnNode;
	}

	get size(){
		return this._size;
	}
	get last(){
		return this._last;
	}
	get list(){
		if (this._head == null){
			return null;
		} else {
			let list = [];
			list.push(this._head.node);
			let searchNode = this._head;
			while(searchNode.next != null){
				searchNode = searchNode.next;
				list.push(searchNode.node);
			}
			list.push(searchNode.node);
			return list;
		}
	}
}

class Queue {
	constructor(){
		this._list = new LinkedList;
	}

	enQueue(node){
		this._list.addNode(new simpleNode(node));
	}

	deQueue(){
		return this._list.removeHead().node;
	}

	get size(){
		return this._list.size;
	}
}

class Stack {
	constructor(){
		this._count = 0;
		this._list = new LinkedList;
	}
	push(node){
		this._list.addNode(new simpleNode(node));
		this._count += 1;
	}
	pop(){
		this._list.removeLast();
		this._count -= 1;
	}
	peek(){
		if (this._count != 0){
			return this._list.last.node;
		}
		return undefined;
	}
	get length(){
		return this._count;
	}
	get list(){

		return this._list.list;
	}
}

graph = [];

/*
------------------------------GRAPH CHANGES------------------------------
*/

const initializeGraph = (rows, columns) => {
	graph = [];
	setGraph(rows, columns);
	setStart([], createStartPos(rows, columns));
	setFinish([], createFinishPos(rows, columns));
}

const resetGraph = (rows, columns, startPos, endPos) => {
	graph = [];
	setGraph(rows, columns);
	setStart([], startPos);
	setFinish([], endPos);
}

/*creates the graph that holds all the nodes*/
/*position refers to the following array: [row, column]*/
const setGraph = (rows, columns) => {

	row = [];

	/*Creates first node in the top left corner*/
	row.push(new node(false, false, false, 0, 0));

	/*creates all the other nodes in the first row*/
	for (let i = 1; i < columns; i++){
		row.push(new node(false, false, false, 0, i));

		row[row.length-1].addNeighbor(row[row.length-2]);
		row[row.length-2].addNeighbor(row[row.length-1]);
	}

	graph.push(row);

	/*Creates nodes in all other rows*/
	for (let i = 1; i < rows; i++){

		row = [];

		/*Creates leftmost node in each row*/
		row.push(new node(false, false, false, i, 0));
		row[0].addNeighbor(graph[i-1][0]);	
		graph[i-1][0].addNeighbor(row[0]);

		/*Creates all other nodes in that row*/
		for (let j = 1; j < columns; j++){
			row.push(new node(false, false, false, i, j));

			row[j].addNeighbor(row[j-1]);
			row[j-1].addNeighbor(row[j]);

			row[j].addNeighbor(graph[i-1][j]);
			graph[i-1][j].addNeighbor(row[j]);
		}

		graph.push(row);
	}
}

/*Sets start node and updates currentStart. Takes a position array [row, column]*/
const setStart = (startPos, position) => {
	if (startPos.length != 0){
		graph[startPos[0]][startPos[1]].substractStart();
	}
	graph[position[0]][position[1]].addStart();
}
/*Sets finish node and updates currentFinish. Takes a position array [row, column]*/
const setFinish = (endPos, position) => {
	if (endPos.length != 0){
		graph[endPos[0]][endPos[1]].substractFinish();
	}
	graph[position[0]][position[1]].addFinish();
}

/*Removes node at given position from all neighbors*/
const addWall = position => {
	neighbors = graph[position[0]][position[1]].neighbors;
	deletedNeighbors = graph[position[0]][position[1]].deletedNeighbors;

	for(let i = 0; i < neighbors.length; i++){
		neighbors[i].subtractNeighbor(graph[position[0]][position[1]]);
	}
	for(let i = 0; i < deletedNeighbors.length; i++){
		deletedNeighbors[i].subtractNeighbor(graph[position[0]][position[1]]);
	}
}
/*Adds node at given position to all neighbors*/
const removeWall = position => {
	neighbors = graph[position[0]][position[1]].neighbors
	deletedNeighbors = graph[position[0]][position[1]].deletedNeighbors;

	for(let i = 0; i < neighbors.length; i++){
		neighbors[i].addNeighbor(graph[position[0]][position[1]]);
	}
	for(let i = 0; i < deletedNeighbors.length; i++){
		deletedNeighbors[i].addNeighbor(graph[position[0]][position[1]]);
	}
}

/*
------------------------------CREATE START/FINISH POSITION------------------------------
*/

/*Returns array [row, column] containing position of start*/
const createStartPos = (rows, columns) => {
	columns -= 1; //since index for the rows starts at 0. Need to subtract one from num of columns and rows
	rows -= 1;
	row = Math.round(rows/2);
	column = Math.round(columns/8);
	setStartPos([row, column]) //draws start position to the grid (function is in index.js)
	return [row, column];
}
/*Returns array [row, column] containing position of finish*/
const createFinishPos = (rows, columns) => {
	columns -= 1; //since index for the rows starts at 0. Need to subtract one from num of columns and rows
	rows -= 1;
	row = Math.round(rows/2);
	column = Math.round((columns * 7)/8);
	setFinishPos([row, column]) //draws finish position the grid (function is in index.js)
	return [row, column];
}

/*
------------------------------PATHFINDING ALGORITHMS------------------------------
*/

const DFS = (startPos, speed) => {
	DFSLoop(new Stack(), graph[startPos[0]][startPos[1]], speed, 0, []);
}
const DFSLoop = (stack, node, speed, count, timeout) => {
	count += 1;

	if (finishedVisualization == false){
			/*undefined when the stack is empty -- meaning there isn't a possible path*/
			if (node == undefined){
				alert("Oh no! There isn't a possible path!");
				finishedVisualization = true;
				document.getElementById('solveButton').innerHTML = "Solve";
				return;
			}
			/*push to the stack is the node is not visited*/
			if (node.visited != true){
				stack.push(node);
				node.addVisited();
			}
			/*Visualization stuff*/
			const delay = (node, delay) => {
				timeout.push([]);
				timeout[timeout.length-1] = setTimeout(function(){
					if (finishedVisualization != true){

						showAlgorithmPath([node.row, node.column])

						if (node.finish == true){
							showBestPath(stack.list);
						}

					} else {
						for (let j = 0; j < timeout.length; j++){
							clearTimeout(timeout[j]);
						}
						return;
					}
				}, delay);
			}

			delay(node, speed * count);

			if (node.finish != true) {

				neighbors = node.neighbors;
				nextNodeExists = false;

				for (let i = 0; i < neighbors.length; i++){
					if(neighbors[i].visited == false){
						DFSLoop(stack, neighbors[i], speed, count, timeout);
						nextNodeExists = true;
						break;
					}
				}

				if (nextNodeExists == false){
					stack.pop();
					DFSLoop(stack, stack.peek(), speed, count, timeout);
				}
			}

	} else {
		return;
	}
}

const BFS = (startPos, speed) => {
	queue = new Queue();
	graph[startPos[0]][startPos[1]].addVisited();
	queue.enQueue(graph[startPos[0]][startPos[1]]);
	BFSLoop(queue, speed, 0, []);
}
const BFSLoop = (queue, speed, count, timeout) => {
	count += 1;

	if (finishedVisualization == false){

		searchNode = queue.deQueue();

		const delay = (node, delay) => {
			timeout.push([]);
			timeout[timeout.length-1] = setTimeout(function(){
				if (finishedVisualization != true){

					showAlgorithmPath([node.row, node.column])

					if (node.finish == true){
						bestPath = [];
						while(searchNode.parent != undefined){
							bestPath.push(searchNode);
							searchNode = searchNode.parent;
						}
						bestPath.push(searchNode);
						showBestPath(bestPath);
					}

				} else {

					for (let j = 0; j < timeout.length; j++){
						clearTimeout(timeout[j]);
					}

					return;
				}
			}, delay);
		}

		delay(searchNode, speed * count);

		if (searchNode.finish != true){

			neighbors = searchNode.neighbors;

			for(let i = 0; i < neighbors.length; i++){
				if (neighbors[i].visited == false){
					neighbors[i].addParent(searchNode);
					queue.enQueue(neighbors[i]);
					neighbors[i].addVisited();
				}
			}

			if (queue.size == 0){
				alert("Oh no! There isn't a possible path!");
				finishedVisualization = true;
				document.getElementById('solveButton').innerHTML = "Solve";
				return;
			}

			BFSLoop(queue, speed, count, timeout);

		}
	} else {
		return;
	}
}

const aStar = (startPos, finishPos, speed) => {
	count = 0
	timeout = [];
	openList = [];
	closedList = [];

	graph[startPos[0]][startPos[1]].addG(0);
	const h = Math.pow(Math.abs(graph[startPos[0]][startPos[1]].row - graph[finishPos[0]][finishPos[1]].row), 2) + Math.pow(Math.abs(graph[startPos[0]][startPos[1]].column - graph[finishPos[0]][finishPos[1]].column), 2);
	graph[startPos[0]][startPos[1]].addH(h)
	graph[startPos[0]][startPos[1]].addF(h);

	openList.push(graph[startPos[0]][startPos[1]]);

	while (openList.length != 0){
		if (finishedVisualization != true){
			count += 1;

			lowestValue = openList[0].f;
			lowestValueIndex = 0;

			for(let i = 1; i < openList.length; i++){
				if(openList[i].f < lowestValue){
					lowestValue = openList[i].f;
					lowestValueIndex = i;
				}
			}

			currentNode = openList[lowestValueIndex];

			const delay = function(node, delay){
				timeout.push([]);
				timeout[timeout.length-1] = setTimeout(function(){
						if (finishedVisualization != true){

							position = [node.row, node.column];
							showAlgorithmPath(position);

							if (node.finish == true){
								bestPath = [];
								while(currentNode.parent != undefined){
									bestPath.push(currentNode);
									currentNode = currentNode.parent;
								}
								bestPath.push(currentNode);
								showBestPath(bestPath);
							}

						} else {
							for (let j = 0; j < timeout.length; j++){
								clearTimeout(timeout[j]);
							}
							return;
						}
				}, delay);
			}
			
			delay(currentNode, speed * count);

			openList.splice(lowestValueIndex, 1);
			closedList.push(currentNode);

			if (currentNode.finish == true){
				return;
			}

			neighbors = currentNode.neighbors;

			for(let i = 0; i < neighbors.length; i++){

				skipForLoop = false;
				for(let j = 0; j < closedList.length; j++){
					if(neighbors[i].row == closedList[j].row && neighbors[i].column == closedList[j].column){
						skipForLoop = true;
						continue;
					}
				}

				if (skipForLoop == true){
					continue;
				}

				const g = currentNode.g + 1;
				neighbors[i].addG(g);
				firstTime = true;

				for(let j = 0; j < openList.length; j++){
					if(neighbors[i].row == openList[j].row && neighbors[i].column == openList[j].column){
						firstTime = false;

						if(neighbors[i].g < openList[j].g){
							firstTime = true;;
						}

						continue;
					}
				}

				if (firstTime == true){
					const h = Math.pow(Math.abs(neighbors[i].row - graph[finishPos[0]][finishPos[1]].row), 2) + Math.pow(Math.abs(neighbors[i].column - graph[finishPos[0]][finishPos[1]].column), 2);
					neighbors[i].addH(h)
					openList.push(neighbors[i]);
					neighbors[i].addF(g+h);
					neighbors[i].addParent(currentNode);
				}			
			}
		} else {
			return;
		}
	}

	if(openList.length == 0){
		alert("Oh No! There isn't a possible path.")
		finishedVisualization = true;
		document.getElementById('solveButton').innerHTML = "Solve";
		return;
	}
}

const greedyBestFirst = (startPos, finishPos, speed) => {
	count = 0
	timeout = [];
	openList = [];
	closedList = [];

	const h = Math.pow(Math.abs(graph[startPos[0]][startPos[1]].row - graph[finishPos[0]][finishPos[1]].row), 2) + Math.pow(Math.abs(graph[startPos[0]][startPos[1]].column - graph[finishPos[0]][finishPos[1]].column), 2);
	graph[startPos[0]][startPos[1]].addF(h);

	openList.push(graph[startPos[0]][startPos[1]]);

	while (openList.length != 0){
		if (finishedVisualization != true){
			count += 1;
			lowestValue = openList[0].f;
			lowestValueIndex = 0;

			for(let i = 1; i < openList.length; i++){
				if(openList[i].f < lowestValue){
					lowestValue = openList[i].f;
					lowestValueIndex = i;
				}
			}

			currentNode = openList[lowestValueIndex];

			const delay = function(node, delay){
				timeout.push([]);
				timeout[timeout.length-1] = setTimeout(function(){
						if (finishedVisualization != true){
							position = [node.row, node.column];
							showAlgorithmPath(position);

							if (node.finish == true){
								bestPath = [];
								while(currentNode.parent != undefined){
									bestPath.push(currentNode);
									currentNode = currentNode.parent;
								}
								bestPath.push(currentNode);
								showBestPath(bestPath);
							}

						} else {
							for (let j = 0; j < timeout.length; j++){
								clearTimeout(timeout[j]);
							}
							return;
						}
				}, delay);
			}
			
			delay(currentNode, speed * count);

			openList.splice(lowestValueIndex, 1);
			closedList.push(currentNode);

			if (currentNode.finish == true){
				return;
			}

			neighbors = currentNode.neighbors;
			for(let i = 0; i < neighbors.length; i++){

				skipForLoop = false;
				for(let j = 0; j < closedList.length; j++){
					if(neighbors[i].row == closedList[j].row && neighbors[i].column == closedList[j].column){
						skipForLoop = true;
						continue;
					}
				}

				if (skipForLoop == true){
					continue;
				}

				firstTime = true;

				for(let j = 0; j < openList.length; j++){
					if(neighbors[i].row == openList[j].row && neighbors[i].column == openList[j].column){
						firstTime = false;

						continue;
					}
				}

				if (firstTime == true){
					const h = Math.pow(Math.abs(neighbors[i].row - graph[finishPos[0]][finishPos[1]].row), 2) + Math.pow(Math.abs(neighbors[i].column - graph[finishPos[0]][finishPos[1]].column), 2);
					openList.push(neighbors[i]);
					neighbors[i].addF(h);
					neighbors[i].addParent(currentNode);
				}			
			}
		} else {
			return;
		}
	}

	if(openList.length == 0){
		alert("Oh No! There isn't a possible path.")
		finishedVisualization = true;
		document.getElementById('solveButton').innerHTML = "Solve";
		return;
	}
}

/*
-----------------------------GENERATE MAZE------------------------------
*/

/*RECURSIVE DIVISION ---
**VARIABLES -
**row1 - topmost row that is white (i.e not a wall row)
**row2 - bottommost row "                             "
**column1 - leftmost column "                            "
**column2 - rightmost column "                           "
**speed - speed at which to complete each loop
**lastRowIndex - index of leftmost row of entire grid
**lastColumnIndex - index of bottommost column "    "
*/
/*recursiveDivisionTimeout = [];*/
const recursiveDivision = (row1, row2, column1, column2, speed, lastRowIndex, lastColumnIndex) => {

	setTimeout(function(){

		const rows = row2 - row1 + 1;
		const columns = column2 - column1 + 1;

		if (rows > columns && rows >= 3 && columns >= 2){ //draw horizontal lines (rows)

			rowIndex = Math.floor(Math.random() * (rows-2)) + 1 + row1; //row at which the line will be drawn
			openSpace = Math.floor(Math.random() * columns) + column1; //open space in that row for search algo to pass through

			for (let i = column1; i < column1 + columns; i++){
				if(i != openSpace && clickValid([rowIndex, i])){

					goThrough = true;

					/*if this is the first square in the row being drawn and that square is not at the edge of the grid*/
					if (i == column1 && column1 != 0){
						id = rowIndex + " " + (i-1);
						rect = document.getElementById(id);

						/*if the square above the one being drawn is white, don't draw this square (or else the pass through will be blocked)*/
						if(rect.style.backgroundColor == "white"){
							goThrough = false;
						}

					/*last square in the row being drawn and square not at edge of the grid*/
					} else if (i == (column1 + columns - 1) && (column1 + columns - 1) != lastColumnIndex){
						id = rowIndex + " " + (i+1);
						rect = document.getElementById(id);

						/*if the square below the one below the one being drawn is white, don't draw this square (or else the pass through will be blocked)*/
						if(rect.style.backgroundColor == "white"){
							goThrough = false;
						}
					}

					if (goThrough == true){
						position = [rowIndex, i];
						id = rowIndex + " " + i;
						rect = document.getElementById(id);
						rect.style.backgroundColor = "var(--main-blue)";
						addWall(position);
					}
				}
			}

			recursiveDivision(row1, rowIndex-1, column1, column2, speed, lastRowIndex, lastColumnIndex); //do this again for all space above
			recursiveDivision(rowIndex+1, row2, column1, column2, speed, lastRowIndex, lastColumnIndex); //do this again for all space below

		} else if (columns >= 3 && rows >= 2) { //draw vertical lines (columns)

			columnIndex = Math.floor(Math.random() * (columns-2)) + 1 + column1; //column at which the line will be drawn
			openSpace = Math.floor(Math.random() * rows) + row1; //open space in that column for search algo to pass through

			for (let i = row1; i < row1 + rows; i++){
				if(i != openSpace && clickValid([i, columnIndex])){

					goThrough = true;

					/*if this is the first square in the column being drawn and that square is not at the edge of the grid*/
					if (i == row1 && row1 != 0){
						id = (i-1) + " " + columnIndex;
						rect = document.getElementById(id);

						/*if the square to the left the one being drawn is white, don't draw this square (or else the pass through will be blocked)*/
						if(rect.style.backgroundColor == "white"){
							goThrough = false;
						}

					/*last square in the column being drawn and square not at edge of the grid*/
					} else if (i == (row1 + rows - 1) && (row1 + rows - 1) != lastRowIndex){
						id = (i+1) + " " + columnIndex;
						rect = document.getElementById(id);

						/*if the square to the right of the one being drawn is white, don't draw this square (or else the pass through will be blocked)*/
						if(rect.style.backgroundColor == "white"){
							goThrough = false;
						}
					}

					if (goThrough == true){
						position = [i, columnIndex];
						id = i + " " + columnIndex;
						rect = document.getElementById(id);
						rect.style.backgroundColor = "var(--main-blue)";
						addWall(position);
					}
				}
			}

			recursiveDivision(row1, row2, column1, columnIndex-1, speed, lastRowIndex, lastColumnIndex); //do this again for all space to the left
			recursiveDivision(row1, row2, columnIndex+1, column2, speed, lastRowIndex, lastColumnIndex); //do this again for all space to the right

		} else {
			return;
		}

	}, speed);
}

const basicColumns = (rows, columns, speed) => {
	for(let i = 1; i < columns; i+=2){
		setTimeout(function(){

			openSpace = Math.floor(Math.random() * rows);

			for(let j = 0; j < rows; j++){
				position = [j, i];
				id = j + " " + i;
				if (clickValid(position) == true && j != openSpace){
					rect = document.getElementById(id);
					rect.style.backgroundColor = "var(--main-blue)";
					addWall(position);
				}
			}

		}, speed*i);
	}
}

const basicRows = (rows, columns, speed) => {

	for(let i = 1; i < rows; i+=2){
		setTimeout(function(){

			openSpace = Math.floor(Math.random() * ((columns/2)-1));
			openSpace2 = Math.floor(Math.floor(Math.random() * columns/2) + ((columns/2) + 1));

			for(let j = 0; j < columns; j++){
				position = [i, j];
				id = i + " " + j;
				if (clickValid(position) == true && j != openSpace && j != openSpace2){
					rect = document.getElementById(id);
					rect.style.backgroundColor = "var(--main-blue)";
					addWall(position);
				}
			}

		}, speed*i);
	}

	column = Math.floor(columns/2);
	for(let i = 0; i < rows; i+=2){
		position = [i, column];
		id = i + " " + column;
		if (clickValid(position) == true && i != 0 && i != rows-2 && i!= rows-1){
			rect = document.getElementById(id);
			rect.style.backgroundColor = "var(--main-blue)";
			addWall(position);
		}
	}
}

const atulAlgorithm = (startPos, finishPos, rows, columns, speed) => {

	finishedVisualization = false;
	document.getElementById('solveButton').innerHTML = "Loading";

	graph[startPos[0]][startPos[1]].addStartConnect();
	graph[finishPos[0]][finishPos[1]].addFinishConnect();

	algorithmGraph = [];

	for(let i = 0; i < graph.length; i++){
		algorithmGraph.push([]);
		for(let j = 0; j < graph[i].length; j++){
			algorithmGraph[i].push([i, j]);
		}
	}

	algorithmGraph[startPos[0]].splice(startPos[1], 1);
	if (startPos[0] == finishPos[0] && startPos[1] < finishPos[1]){
		algorithmGraph[finishPos[0]].splice(finishPos[1]-1, 1);
	} else {
		algorithmGraph[finishPos[0]].splice(finishPos[1], 1);
	}

	for(let i = 0; i < algorithmGraph.length; i++){
		for(let j = 0; j < algorithmGraph[i].length; j++){
			addWall(algorithmGraph[i][j]);
			id = algorithmGraph[i][j][0] + " " + algorithmGraph[i][j][1]
			rect = document.getElementById(id);
			rect.style.backgroundColor = "var(--main-blue)";
		}
	}

	size = algorithmGraph.length * algorithmGraph[0].length;
	whiteSpaces = 0;
	connectionFound = false;

	while (!(whiteSpaces > size/2 && connectionFound == true)){

		rows = algorithmGraph.length;
		randRow = -1;
		while (randRow == -1){
			randRow = Math.floor(Math.random() * rows);
			if(algorithmGraph[randRow].length == 0){
				randRow = -1;
			}
		}

		columns = algorithmGraph[randRow].length;
		randColumn = Math.floor(Math.random() * columns);

		removeWall(algorithmGraph[randRow][randColumn]);

		const delay = function(position, delay){
			setTimeout(function(){
				id = position[0] + " " + position[1]
				rect = document.getElementById(id);
				rect.style.backgroundColor = "white";
			}, delay);
		}

		delay(algorithmGraph[randRow][randColumn], 0);

		whiteSpaces+=1;

		selectedRow = algorithmGraph[randRow][randColumn][0];
		selectedColumn = algorithmGraph[randRow][randColumn][1];
		neighbors = graph[selectedRow][selectedColumn].neighbors;

		for(let i = 0; i < neighbors.length; i++){
			if(neighbors[i].startConnect == true){
				graph[selectedRow][selectedColumn].addStartConnect();
			}
			if(neighbors[i].finishConnect == true){
				graph[selectedRow][selectedColumn].addFinishConnect();
			}
		}

		if (graph[selectedRow][selectedColumn].startConnect == true){
			queue = new Queue();
			queue.enQueue(graph[selectedRow][selectedColumn]);

			while (queue.size != 0){
				workingNode = queue.deQueue();
				neighbors = workingNode.neighbors;

				if (workingNode.startConnect == true && workingNode.finishConnect == true){
					connectionFound = true;
					break;
				}

				if (neighbors != undefined){
					for(let i = 0; i < neighbors.length; i++){
						if(neighbors[i].startConnect == false){
							neighbors[i].addStartConnect();
							queue.enQueue(neighbors[i]);
						}
					}	
				}		
			}
		}

		if (graph[selectedRow][selectedColumn].finishConnect == true){
			queue = new Queue();
			queue.enQueue(graph[selectedRow][selectedColumn]);

			while (queue.size != 0){
				workingNode = queue.deQueue();
				neighbors = workingNode.neighbors;

				if (workingNode.startConnect == true && workingNode.finishConnect == true){
					connectionFound = true;
					break;
				}

				if (neighbors != undefined){
					for(let i = 0; i < neighbors.length; i++){
						if(neighbors[i].finishConnect == false){
							neighbors[i].addFinishConnect();
							queue.enQueue(neighbors[i])
						}
					}
				}			
			}
		}

		algorithmGraph[randRow].splice(randColumn, 1);
	}

	finishedVisualization = true;
	document.getElementById('solveButton').innerHTML = "Solve";
	return;
}