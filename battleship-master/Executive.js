/**
 * @class
 */
class Executive {
	/**
	 * @description Sets up the game with the user selected number of ships. Constructor create event listeners on the game setup menu
	 */
    constructor() {
		/*
		* @member numShips {number} The number of ships each player will have
 		* @member rows {number} The number of rows each board will have
 		* @member cols {number} The number of columns each board will have
 		*/
		this.numShips = document.getElementById("ship-slider").value;
		// Future enhancement: Allow the user to select the size of the board
		this.rows = 9;
		this.cols = 9;
		
		document.getElementById("ship-slider").addEventListener("input", e => {
			this.numShips = e.target.value
			document.getElementById("num-ships").innerHTML = this.numShips;
		});

		// Setting up the event for a click to change the menu for the board
		// document.getElementById("complete").addEventListener("click", e => this.initGame());
		// document.getElementById("complete").addEventListener("click", this.type=0);
		// document.getElementById("complete_AI1").addEventListener("click", e => this.initGame());
		// document.getElementById("complete_AI1").addEventListener("click", this.type=1);
    }
	// onclick_human()
	// {
	// 	document.getElementById("complete").addEventListener("click", e => this.initGame());
	// 	document.getElementById("complete").addEventListener("click", this.type=0);
	// }
	onclick_AI1()
	{
		document.getElementById("complete_AI1").addEventListener("click", e => this.initGame());
		document.getElementById("complete_AI1").addEventListener("click", this.type=0);
	}
	/**
	* @description Sets up the player names and number of ships, then begins the game.
	**/
	initGame() {
		for (let i = 0; i <= 1; i++) {
			let playerName = document.getElementById("player" + i + "-name-input").value;
			if (playerName == "") playerName = "Player " + (i+1);
			document.getElementById("player" + i + "-name").value = playerName;
		}
		document.getElementById("menu").style.display = "none";
		document.getElementById("controls").style.display = "";
		document.getElementById("both_boards").style.display = "";
		document.getElementById("switch-turn").style.display = "none";
		this.game = new Gameplay(this.rows, this.cols, this.numShips,this.type);
	}
}
