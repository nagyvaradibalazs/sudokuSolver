//variables and consts
const slider = document.getElementsByClassName("slider")[0];
const cells = document.getElementsByClassName("cell");
const popup = document.getElementsByClassName("popup")[0];
const editSelector = document.getElementsByClassName("edit-type")[0];
var difficultyLevel = 42;
var board = [];
var editType = "write";
var xPos;
var yPos;
var selectedCell;
var popupActive = false;
var newSelected = true;
let solution = [];

//initialize
window.onload = function() {
	for(let i = 0; i < 81; i++) {
		let name = cells[i].id;
		cells[i].setAttribute("onclick", `changeCell(${name});`);
	}
	//reset the board
	newBoard();
	//updating the difficulty
	slider.oninput = function() {
		difficultyLevel = -this.value;
	}
	//write by default
	changeEdit("write");
}

//shuffle array
function shuffleArray(a) {
    for(let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a;
}

//shifting the array
function shiftArray(a, k) {
	let result = [0,0,0,0,0,0,0,0,0];
	for(let i = 0; i < a.length; i++) {
		result[(i + k) % a.length] = a[i];
	}
	return result;
}

//generating new board
function newBoard() {
	resetBoard();
	//reset board to initial
	for(let i = 0; i < 81; i++) {
		let row = cells[i].id[1];
		let column = cells[i].id[3];
		cells[i].innerHTML = "";
		board[row][column] = null;
		cells[i].style.setProperty("color", "black");
		cells[i].className = cells[i].classList[0];
	}

	let startingArray = shuffleArray([1,2,3,4,5,6,7,8,9]);
	board[0] = startingArray;

	board[1] = shiftArray(startingArray, 6);
	board[2] = shiftArray(startingArray, 3);
	board[3] = shiftArray(startingArray, 8);
	board[4] = shiftArray(startingArray, 5);
	board[5] = shiftArray(startingArray, 2);
	board[6] = shiftArray(startingArray, 7);
	board[7] = shiftArray(startingArray, 4);
	board[8] = shiftArray(startingArray, 1);
	
	for(let i = 0; i < 3; i++) {
		let a = Math.floor(Math.random() * 3) + i * 3;
		let b = Math.floor(Math.random() * 3) + i * 3;;
		let temp;
		for(let j = 0; j < 9; j++) {
			temp = board[j][a];
			board[j][a] = board[j][b];
			board[j][b] = temp;
		}
	}

	for(let i = 0; i < 3; i++) {
		let a = Math.floor(Math.random() * 3) + i * 3;
		let b = Math.floor(Math.random() * 3) + i * 3;;
		let temp;
		for(let j = 0; j < 9; j++) {
			temp = board[a][j];
			board[a][j] = board[b][j];
			board[b][j] = temp;
		}
	}

	for(let i = 0; i < 81-(difficultyLevel); i++) {
		let x = Math.floor(Math.random() * 9);
		let y = Math.floor(Math.random() * 9);;
		while(board[x][y] == null) {
			//new random
			x = Math.floor(Math.random() * 9);
			y = Math.floor(Math.random() * 9);
		}
		board[x][y] = null;
	}

	preFill();

	//copy solution array to const solution
	let tempSol = solve(board);
	for(let i = 0; i < 9; i++) {
		for(let j = 0; j < 9; j++) {
			let temp = tempSol[i][j];
			solution[i][j] = temp;
		}
	}
}

//declare given cell
function preFill() {
	for(let i = 0; i < 9; i++) {
		for(let j = 0; j < 9; j++) {
			if(board[i][j] != null) {
				document.getElementById(`r${i}c${j}`).innerHTML = board[i][j];
				document.getElementById(`r${i}c${j}`).className += " protected";
			}
		}
	}
}

//change cell content
function changeCell(cellName) {
	if(cellName.classList[1] != "protected") {
		let cellPos = cellName.getBoundingClientRect();
		if(newSelected) {
			highlight(cellName);
		}

		if(editType == "write") {
			selectedCell = cellName;
			if(!popupActive) {
				newSelected = false;
				popUpNumbers(cellPos.left, cellPos.top);
			}
			else {
				popup.style.setProperty("display", "none");
				popupActive = false;
				newSelected = true;
			}
		}
		else if(editType == "erase") {
			newSelected = true;
			cellName.innerHTML = "";		
			//update the board
			let i = cellName.id[1];
			let j = cellName.id[3];
			board[i][j] = null;
		}
	}
}

//reset board and solution
function resetBoard() {
	board = [];
	for(var i = 0; i < 9; i++) {
		board.push([]);
		board[i].push(new Array(9));
		for(var j = 0; j < 9; j++) {
			board[i][j] = null;
		}
	}

	solution = [];
	for(var i = 0; i < 9; i++) {
		solution.push([]);
		solution[i].push(new Array(9));
		for(var j = 0; j < 9; j++) {
			solution[i][j] = null;
		}
	}

	//reset prev highlighted colors
	for(let i = 0; i < 81; i++) {
		cells[i].style.setProperty("background", "white");
	}

	popup.style.setProperty("display", "none");
	newSelected = true;
}

//popup for selecting numbers
function popUpNumbers(x, y) {
	popupActive = true;
	popup.style.setProperty("display", "grid");
	popup.style.setProperty("left", `${x - 10}px`);
	popup.style.setProperty("top", `${y - 85}px`);
}

//select number form popup
function selectedNumber(n) {
	popup.style.setProperty("display", "none");
	popupActive = false;
	newSelected = true;
	selectedCell.innerHTML = n;

	let i = selectedCell.id[1];
	let j = selectedCell.id[3];

	//check if inserted number is correct
	if(n != solution[i][j])
		selectedCell.style.setProperty("color", "tomato");
	else
		selectedCell.style.setProperty("color", "green");

	//update the board
	board[i][j] = n;
}

//change edit type
function changeEdit(s) {
	editType = s;
	if(editType == "erase") {
		popup.style.setProperty("display", "none");
		newSelected = true;
	}

	//reset prev highlighted colors
	for(let i = 0; i < 81; i++) {
		cells[i].style.setProperty("background", "white");
	}

	//update selector
	const active = document.getElementById(s);
	const coords = active.getBoundingClientRect();
	const directions = {
		height: coords.height,
		width: coords.width,
		top: coords.top,
		left: coords.left
	};

	editSelector.style.setProperty("left", `${directions.left}px`);
	editSelector.style.setProperty("width", `${directions.width}px`);
	editSelector.style.setProperty("height", `${directions.height}px`);
	editSelector.style.setProperty("top", `${directions.top}px`);
}

//highlight related cells of selected
function highlight(cell) {
	//reset prev highlighted colors
	for(let i = 0; i < 81; i++) {
		cells[i].style.setProperty("background", "white");
	}

	let box = cell.parentElement.children;
	let row = cell.id[1];
	let column = cell.id[3];

	//highlight box
	for(let i = 0; i < 9; i++) {
		box[i].style.setProperty("background", "darkgrey");
	}
	//highlight column
	for(let i = 0; i < 9; i++) {
		document.getElementById(`r${row}c${i}`).style.setProperty("background", "darkgrey");
	}
	//highlight box
	for(let i = 0; i < 9; i++) {
		document.getElementById(`r${i}c${column}`).style.setProperty("background", "darkgrey");
	}
}

function driver() {
	//reset prev highlighted colors
	for(let i = 0; i < 81; i++) {
		cells[i].style.setProperty("background", "white");
	}

	popup.style.setProperty("display", "none");
	newSelected = true;

	//reset board to initial
	for(let i = 0; i < 81; i++) {
		let row = cells[i].id[1];
		let column = cells[i].id[3];
		if(cells[i].classList[1] != "protected") {
			cells[i].innerHTML = "";
			board[row][column] = null;
		}
	}
	solveA(board);
}

//solve with animation
async function solveA(bd) {
	if(!correctBoard(bd)) {
		return null;
	}
	let next = nextCell(bd);
	if(!next.cellFound) {
		return bd;
	}


	for(p of Array.from(next.minP)) {
		document.getElementById(`r${next.maxi}c${next.maxj}`).innerHTML = p;

		document.getElementById(`r${next.maxi}c${next.maxj}`).style.setProperty("color", "orange");
		await new Promise(resolve =>
			setTimeout(() => {
				resolve();
			}, 200)
		);
		document.getElementById(`r${next.maxi}c${next.maxj}`).style.setProperty("color", "orange");

		let newBd = bd;
		newBd[next.maxi][next.maxj] = p;
		let tempSolution = await solveA(newBd);
		if(tempSolution != null) {
			document.getElementById(`r${next.maxi}c${next.maxj}`).style.setProperty("color", "green");
			return tempSolution;
		}
		else {
			bd[next.maxi][next.maxj] = null;
			document.getElementById(`r${next.maxi}c${next.maxj}`).style.setProperty("color", "tomato");
			await new Promise(resolve =>
				setTimeout(() => {
					resolve();
				}, 500)
			);
			document.getElementById(`r${next.maxi}c${next.maxj}`).innerHTML = "";
		}
	}
	return null;
}

//solve the given board
function solve(bd) {
	if(!correctBoard(bd)) {
		return null;
	}
	let next = nextCell(bd);
	//console.log(next);
	if(!next.cellFound) {
		return bd;
	}
	for(p of Array.from(next.minP)) {
		let newBd = bd;
		newBd[next.maxi][next.maxj] = p;
		let tempSolution = solve(newBd);
		if(tempSolution != null) {
			return tempSolution;
		}
		else {
			bd[next.maxi][next.maxj] = null;
		}
	}
	return null;
}

//selecting the next cell (least possibilities)
function nextCell(bd) {
	let maxi = null;
	let maxj = null;
	let minP = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	let cellFound = false;

	for(let i = 0; i < 9; i++) {
		for(let j = 0; j < 9; j++) {
			if(bd[i][j] == null) {
				let possibilities = getP(bd, i, j);
				if(possibilities.size < minP.size) {
					minP = possibilities;
					maxi = i;
					maxj = j;
					cellFound = true;
				}
			}
		}
	}

	return {cellFound, maxi, maxj, minP};
}

//determining the possibilities of cell
function getP(bd, x, y) {
	let orig = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	//deleting occuring elements
	for(let i = 0; i < 9; i++) {
		orig.delete(bd[x][i]);
	}
	for(let i = 0; i < 9; i++) {
		orig.delete(bd[i][y]);
	}
	let firstI = parseInt(x / 3) * 3;
	let firstJ = parseInt(y / 3) * 3;
	for(let i = firstI; i < firstI + 3; i++) {
		for(let j = firstJ; j < firstJ + 3; j++) {
			orig.delete(bd[i][j]);
		}
	}
	return orig;
}

//check if a board is correct
function correctBoard(bd) {
	for(let i = 0; i < 9; i++) {
		for(let j = 0; j < 9; j++) {
			let temp = bd[i][j];
			if(temp != null && !correctCell(bd, i, j, temp)) {
				return false;
			}
		}
	}
	return true;
}

//check if selected cell contraticts with others
function correctCell(bd, x, y, val) {
	for(let i = 0; i < 9; i++) {
		if(bd[x][i] == val && i != y)
			return false;
	}
	for(let i = 0; i < 9; i++) {
		if(bd[i][y] == val && i != x)
			return false;
	}
	let firstI = parseInt(x / 3) * 3;
	let firstJ = parseInt(y / 3) * 3;
	for(let i = firstI; i < firstI + 3; i++) {
		for(let j = firstJ; j < firstJ + 3; j++) {
			if(bd[i][j] == val && (i != x && j != y))
				return false;
		}
	}
	return true;
}