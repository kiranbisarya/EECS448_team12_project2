/**
 * @class
 */
class Gameplay {
	/**
	* @description Manages the boards and user interaction during gameplay (ship placement and attacking)
	* @param rows {number} The number of rows the boards have
	* @param cols {number} The number of columns the boards have
	* @param numShips {number} The number of ships each player has
	* @param type 
	**/
	constructor(rows, cols, numShip, type) {
		/*
		 * @member turn {boolean} Which player's turn it is - false is playerOneBoard (left) and true is playerTwoBoard (right)
		 * @member isSetup {boolean} Whether the ship placement phase of gameplay has been completed
		 * @member playerOneBoard {Board} Player false's board
		 * @member playerTwoBoard {Board} Player true's board
		 * @member numShipsPlaced {number} How many ships the current player has placed so far during setup
		 * @member isVertical {boolean} Whether the ship is vertical or horizontal during ship placement
		 */
		// alert("type:"+type);
		this.type = type;
		this.rows = rows;
		this.cols = cols;
		this.numShips = numShip;
		this.aiPreviousHit = [];

		this.turn = false;
		this.isSetup = false;
		this.numShipsPlaced = 0;

		this.playerOneBoard = new Board(rows, cols, this.numShips);
		this.playerTwoBoard = new Board(rows, cols, this.numShips);
		this.renderBoards(false);

		this.isVertical = false;
		for (let radio of document.getElementsByName("dir")) {
			radio.addEventListener("change", e => {
				if (e.target.checked) this.isVertical = e.target.value == "true";
			});
		}

		this.msg(this.playerName(this.turn) + " place your " + this.numShips + " ship");

		document.getElementById("switch-turn").addEventListener("click", e => {
			if (this.isSetup) {
				this.msg("Switching turn...");
				this.blankBoards();
				document.getElementById("switch-turn").style.display = "none";
				let modal = document.getElementById("modal");
				modal.style.display = "block";
				let time = 5;
				document.getElementById("turn-switch-time").innerText = time;
				this.turnTimer = setInterval(() => {
					time--;
					document.getElementById("turn-switch-time").innerText = time;
					if (time <= 0) this.switchTurns();
				}, 1000);
			}
			else { // Switch to second player placing their ships
				this.numShipsPlaced = 0;
				this.turn = true;
				document.getElementById("switch-turn").style.display = "none";
				document.getElementById("dir-container").style.display = "";
				this.renderBoards(false);
				this.msg(this.playerName(this.turn) + " place your " + this.numShips + " ship");
			}
		});

		document.getElementById("switch-now").addEventListener("click", e => this.switchTurns());

		// Future enhancement: Reset the game properly so player names can be kept
		document.getElementById("play-again").addEventListener("click", e => window.location.reload());
	}

	/**
	* @description Sets up the next player's turn by hiding the turn switch modal and displaying their ships
	**/
	switchTurns() {
		modal.style.display = "none";
		// this.msg("this.turn FIRST " + this.turn);
		this.turn = !this.turn;
		this.renderBoards(false);
		clearInterval(this.turnTimer);

		this.msg(" It's " + this.playerName(this.turn) + "'s turn. Attack a space on " + this.playerName(!this.turn) + "'s board.");

		// Condition for AI Level 1
		if (this.type == 1 && this.turn == true) {
			// var flag=false;
			while (true) {
				var x = Math.floor((Math.random() * 9));
				var y = Math.floor((Math.random() * 9));
				if (this.playerOneBoard.cells[x][y].isHit == false) {
					this.playerOneBoard.cells[x][y].isHit = true;
					// flag=true;
					break;
				}
			}
			// this.turn = !this.turn;
		}

		// Condition for AI Level 2
		if (this.type == 2 && this.turn == true) {
			// var flag=false;
			while (true) {
				let x, y;

				if(this.aiPreviousHit.length == 0)
				{
					x = Math.floor((Math.random() * 9));
					y = Math.floor((Math.random() * 9));
				}
				else 
				{
					x = this.aiPreviousHit[0];
					y = this.aiPreviousHit[1];

					if(!this.isWithinBounds(x, y))
					{
						x = Math.floor((Math.random() * 9));
						y = Math.floor((Math.random() * 9));
					}
				}
				console.log('x,y: ', x,y)

				if (this.playerOneBoard.cells[x][y].isHit == false) {
					this.playerOneBoard.cells[x][y].isHit = true; //random guess
					// flag=true;

					if (this.playerOneBoard.cells[x][y].hasShip == true) //if random guess has ship
					{
						this.aiPreviousHit[0] = x;
						this.aiPreviousHit[1] = y;
					}
					
					break;
				}
				else
				{
					if(!this.isWithinBounds(x, y))
					{
						x = Math.floor((Math.random() * 9));
						y = Math.floor((Math.random() * 9));
					}
					if (!this.playerOneBoard.cells[x + 1][y].isHit) 
					{
						this.playerOneBoard.cells[x + 1][y].isHit = true;
						if(this.playerOneBoard.cells[x + 1][y].hasShip)
						{
							this.aiPreviousHit = [x + 1, y];
							break;
						}
					}
					else if (!this.playerOneBoard.cells[x - 1][y].isHit) 
					{
						this.playerOneBoard.cells[x - 1][y].isHit = true;
						if(this.playerOneBoard.cells[x - 1][y].hasShip)
						{
							this.aiPreviousHit = [x - 1, y];
							break;
						}

					}
					else if (!this.playerOneBoard.cells[x][y + 1].isHit) 
					{
						this.playerOneBoard.cells[x][y + 1].isHit = true;
						if(this.playerOneBoard.cells[x][y + 1].hasShip)
						{
							this.aiPreviousHit = [x, y + 1];
							break;
						}

					}
					else if (!this.playerOneBoard.cells[x][y - 1].isHit) 
					{
						this.playerOneBoard.cells[x][y - 1].isHit = true;
						if(this.playerOneBoard.cells[x][y - 1].hasShip)
						{
							this.aiPreviousHit = [x, y - 1];
							break;
						}
					}
					else
					{
						this.aiPreviousHit = [];
					}
					break;
				}
			}
			// this.turn = !this.turn;
		}

		// Condition for AI Level 3
		if (this.type == 3 && this.turn == true) {
			// var flag=false;
			while (true) {
				var x = Math.floor((Math.random() * 9));
				var y = Math.floor((Math.random() * 9));

				if (this.playerOneBoard.cells[x][y].isHit == false && this.playerOneBoard.cells[x][y].hasShip == true) {
					this.playerOneBoard.cells[x][y].isHit = true;
					this.playerOneBoard.shipSpaces--;
					// flag=true;
					if (this.playerOneBoard.checkWin()) {
						this.gameEnd();
					}
					break;
				}
			}
			// this.turn = !this.turn;
		}
	}

	/**
	* @description Render the boards, hides the ships on both boards, for use during turn switching
	**/
	blankBoards() {
		this.playerOneBoard.render(document.getElementById("playerOneBoard"), this, false, true);
		this.playerTwoBoard.render(document.getElementById("playerTwoBoard"), this, false, true);
	}

	/**
	* @description Render the boards, only showing ships on the current player's board
	* @parameter {boolean} preventClicking Whether to not setup the clickSpace listener on each cell
	**/
	renderBoards(preventClicking) {
		this.playerOneBoard.render(document.getElementById("playerOneBoard"), this, !this.turn, preventClicking);
		this.playerTwoBoard.render(document.getElementById("playerTwoBoard"), this, this.turn, preventClicking);
	}

	/**
	* @description Render the boards, showing ships on both boards, and display a victory message
	**/
	gameEnd() {
		this.msg(this.playerName(this.turn) + " wins!!!");
		this.playerOneBoard.render(document.getElementById("playerOneBoard"), this, true, true);
		this.playerTwoBoard.render(document.getElementById("playerTwoBoard"), this, true, true);
		document.getElementById("switch-turn").style.display = "none";
		document.getElementById("play-again").style.display = "";
	}

	clickSpace(cell, isCurrentPlayer) {
		console.log(this.isSetup, this.turn)
		let board = this.turn == false ? this.playerTwoBoard : this.playerOneBoard;
		if (this.isSetup) {
			if(this.turn == false || this.type == 0)
			{
				if (!isCurrentPlayer && !cell.isHit) {
					cell.isHit = true;
					if (cell.hasShip) {
						// var mp3 = "music/music.mp3";
						//  var mp3 = new Audio(mp3);
						//     mp3.play();
						// this.msg("Hit!" + "board.checkWin() " + board.checkWin() + "board.shipSpaces " + board.shipSpaces);
						this.msg("Hit!");
						var snd = new Audio("hit.mp3");
						snd.play();
						console.log('ai before', this.playerTwoBoard, this.playerTwoBoard.shipSpaces);
						board.shipSpaces = board.shipSpaces - 1;
						console.log('ai after', this.playerTwoBoard, this.playerTwoBoard.shipSpaces);

						if (board.checkWin()) {
							this.gameEnd();
						}
						else {
							this.renderBoards(true);
							document.getElementById("switch-turn").style.display = "";
						}
					}
					else {
						this.renderBoards(true);
						document.getElementById("switch-turn").style.display = "";
						this.msg("Miss.")
						var snd = new Audio("miss.mp3");
						snd.play();
					}
				}
			}
			else{
				this.renderBoards(true);
				document.getElementById("dir-container").style.display = "none";
				document.getElementById("switch-turn").style.display = "";
			}
		}
		else if (isCurrentPlayer && this.type == 0) { // During setup phase, you click your own board
			this.newShip(cell);
		}
		else {
			this.newShipAI(cell);
		}
	}

	/**
	* @description Places a new ship on the current player's board
	* @param cell {Space} The space the user clicked on, which will be the top/left end of the new ship
	**/
	newShip(cell) {
		let board = this.turn ? this.playerTwoBoard : this.playerOneBoard;
		let shipLength = this.numShips - this.numShipsPlaced;
		let placedShip = board.placeShip(shipLength, cell.row, cell.col, this.isVertical);
		if (placedShip !== true) { // Failed to place ship in a valid location
			this.msg(placedShip);
			this.renderBoards(false);
		}
		else if (++this.numShipsPlaced < this.numShips) { // Placed successfully and still more ships to place
			this.msg(this.playerName(this.turn) + " place your " + (shipLength - 1) + " ship");
			this.renderBoards(false);
		}
		else { // Last ship placed
			this.msg("Ship placement complete");
			this.renderBoards(true);
			document.getElementById("dir-container").style.display = "none";
			document.getElementById("switch-turn").style.display = "";
			if (this.playerOneBoard.ships.length == this.playerTwoBoard.ships.length) { // Both players have placed their ships
				this.isSetup = true;
			}
		}
	}

	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	newShipAI(cell) {
		let board = this.turn ? this.playerTwoBoard : this.playerOneBoard;
		// if(this.isSetup)
		// {
		// 	return
		// }
		if (board == this.playerTwoBoard) { //Computer Board randomly places ships
			this.msg("Computer turn: " + this.getRandomInt(9));
			let shipLength = this.numShips - this.numShipsPlaced;
			let placedShip = board.placeShip(shipLength, this.getRandomInt(9), this.getRandomInt(9), this.isVertical);
			if (placedShip !== true) { // Failed to place ship in a valid location
				this.msg(placedShip);
				//this.renderBoards(false);
			}
			else if (++this.numShipsPlaced < this.numShips) { // Placed successfully and still more ships to place
				this.msg("Click anywhere on the right board for the AI to randomly place its " + (shipLength - 1) + " ship");
				//this.renderBoards(false);
			}
			else { // Last ship placed
				this.msg("Ship placement complete");
				//this.renderBoards(true);
				document.getElementById("dir-container").style.display = "none";
				document.getElementById("switch-turn").style.display = "";
				if (this.playerOneBoard.ships.length == this.playerTwoBoard.ships.length) { // Both players have placed their ships
					console.log(this.isSetup)
					this.isSetup = true;
					console.log(this.isSetup)

				}
			}
		}
		else if (board == this.playerOneBoard) { //user manually places ship
			let shipLength = this.numShips - this.numShipsPlaced;
			let placedShip = board.placeShip(shipLength, cell.row, cell.col, this.isVertical);
			if (placedShip !== true) { // Failed to place ship in a valid location
				this.msg(placedShip);
				this.renderBoards(false);
			}
			else if (++this.numShipsPlaced < this.numShips) { // Placed successfully and still more ships to place
				this.msg(this.playerName(this.turn) + " place your " + (shipLength - 1) + " ship");
				this.renderBoards(false);
			}
			else { // Last ship placed
				this.msg("Ship placement complete");
				this.renderBoards(true);
				document.getElementById("dir-container").style.display = "none";
				document.getElementById("switch-turn").style.display = "";
				if (this.playerOneBoard.ships.length == this.playerTwoBoard.ships.length) { // Both players have placed their ships
					this.isSetup = true;
				}
			}
		}
	}

	/**
	* @description Display a message to the current player
	**/
	msg(message) {
		document.getElementById("message").innerHTML = message;
	}

	/**
	* @param player {boolean} Which player to get the name of
	* @return {string} The name of the specified player
	**/
	playerName(player) {
		return document.getElementById("player" + (player ? "1" : "0") + "-name").value;
	}

	isWithinBounds(x, y)
	{
		return x < 8 && x > 0 && y < 8 && y > 0; 
	}
}
