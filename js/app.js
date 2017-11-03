(function() {

	console.log("sudoku");

	var
	puzzles = [
		[5, 3, 4, 6, 7, 2, 1, 9, 8, 6, 7, 8, 1, 9, 5, 3, 4, 2, 9, 1, 2, 3, 4, 8, 5, 6, 7, 8, 5, 9, 4, 2, 6, 7, 1, 3, 7, 6, 1, 8, 5, 3, 9, 2, 4, 4, 2, 3, 7, 9, 1, 8, 5, 6, 9, 6, 1, 2, 8, 7, 3, 4, 5, 5, 3, 7, 4, 1, 9, 2, 8, 6, 2, 8, 4, 6, 3, 5, 1, 7, 9],
		[8, 2, 7, 9, 6, 5, 3, 4, 1, 1, 5, 4, 3, 2, 7, 6, 8, 9, 3, 9, 6, 1, 4, 8, 7, 5, 2, 5, 9, 3, 4, 7, 2, 6, 1, 8, 4, 6, 8, 5, 1, 3, 9, 7, 2, 2, 7, 1, 6, 8, 9, 4, 3, 5, 7, 8, 6, 1, 5, 4, 2, 3, 9, 2, 3, 5, 7, 9, 6, 8, 4, 1, 9, 1, 4, 8, 2, 3, 5, 6, 7],
		[5, 6, 2, 8, 1, 4, 7, 3, 9, 1, 8, 4, 3, 9, 7, 5, 6, 2, 9, 7, 3, 2, 5, 6, 1, 4, 8, 3, 4, 6, 2, 9, 8, 1, 5, 7, 9, 7, 8, 4, 5, 1, 2, 3, 6, 5, 2, 1, 6, 3, 7, 8, 9, 4, 9, 7, 1, 4, 2, 3, 6, 8, 5, 6, 4, 5, 8, 1, 9, 7, 2, 3, 3, 8, 2, 7, 6, 5, 4, 1, 9],
		[9, 5, 6, 7, 8, 2, 3, 1, 4, 7, 1, 2, 3, 4, 5, 8, 6, 9, 8, 4, 3, 6, 9, 1, 7, 2, 5, 5, 2, 7, 6, 3, 1, 4, 9, 8, 6, 9, 4, 2, 8, 7, 5, 3, 1, 3, 1, 8, 4, 5, 9, 2, 6, 7, 2, 6, 3, 1, 7, 9, 8, 4, 5, 1, 5, 8, 4, 2, 3, 9, 7, 6, 9, 7, 4, 5, 8, 6, 1, 3, 2]
	],
	clues = {
		TRICKY: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		MEDIUM: [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
		HARD: [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
		TOUGH: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		EASY: [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0]
	};

	var Puzzle = ROCK.Object.extend({
		constructor: function Puzzle(puzzle, clues) {

			this.squares = [];
			this.puzzle = puzzle;
			this.clues = clues;
			this.item = 0;

			var
			numberOfSquares = this.squareCount;

			while(numberOfSquares--) {

				this.squares.push(new PuzzleSquare(this));

			};

		},
		toHTML: function() {

			var
			node = document.createElement("div");

			node.classList.add("puzzle");

			this.squares.forEach(function(square) {

				node.appendChild(square.toHTML());

			});

			return node;

		},
		getData: function() {

			console.log("getData");

			var
			output = [];

			this.squares.forEach(function(square) {

				square.squares.forEach(function(squareSquare) {

					output.push(squareSquare.displayValue);

				});

			});

			return output;

		},
		setData: function(data) {

			console.log("setData");

			var
			inc = 0;

			this.squares.forEach(function(square) {

				square.squares.forEach(function(squareSquare) {

					squareSquare.displayValue = data[inc];
					squareSquare.updateDisplayValue();
					inc ++;

				});

			});

			return this;

		},
		validate: function() {

			var
			wrong = 0;

			this.squares.forEach(function(square) {

				square.squares.forEach(function(squareSquare) {

					if(!(squareSquare.displayValue===squareSquare.value)) {

						wrong ++;

					};

				});

			});

			// return wrong;
			return wrong===0;

		},
		squareCount: 9,
		item: 0
	});

	var PuzzleSquare = ROCK.Object.extend({
		constructor: function PuzzleSquare(puzzle) {

			this.squares = [];
			this.puzzle = puzzle;

			var
			numberOfSquares = this.squareCount;

			while(numberOfSquares--) {

				this.squares.push(new PuzzleSquareSquare(this));

			};

		},
		toHTML: function() {

			var
			node = document.createElement("div");

			node.classList.add("puzzle-square");

			this.squares.forEach(function(square) {

				node.appendChild(square.toHTML());

			});

			return node;

		},
		squareCount: 9
	});

	var PuzzleSquareSquare = ROCK.Object.extend({
		constructor: function PuzzleSquareSquare(puzzleSquare) {

			this.puzzleSquare = puzzleSquare;
			this.value = puzzles[puzzleSquare.puzzle.puzzle][puzzleSquare.puzzle.item];
			this.clue = !!clues[puzzleSquare.puzzle.clues][puzzleSquare.puzzle.item];
			this.node = document.createElement("div");

			this.node.classList.add("puzzle-square-square");
			this.node.setAttribute("data-clue", this.clue);

			if(this.clue) {

				this.displayValue = this.value;

			};

			this.updateDisplayValue();

			puzzleSquare.puzzle.item ++;

		},
		toHTML: function() {

			var
			square = this;

			this.node.addEventListener("mousedown", function(e) {

				e.preventDefault();

			});

			this.node.addEventListener("mouseup", function(e) {

				e.preventDefault();

				square.incrementDisplayValue();

			});

			return this.node;

		},
		incrementDisplayValue: function() {

			if(this.clue) {

				return this;

			};

			if(this.displayValue<this.max) {

				this.displayValue ++;

			}
			else {

				this.displayValue = this.min;

			};

			this.updateDisplayValue();

			saveGame();

			return this;

		},
		updateDisplayValue: function() {

			this.node.innerHTML = (this.displayValue>0?this.displayValue:"");
			this.node.setAttribute("data-value", this.displayValue);

			return this;

		},
		min: 0,
		max: 9,
		value: 0,
		displayValue: 0,
		clue: false
	});

	var
	namespace = "sudoku.jamesrock.me",
	savedGame = localStorage.getItem(namespace),
	savedObject,
	saveGame = function() {

		console.log("saveGame");

		var
		saveObject = {
			puzzle: examplePuzzle.puzzle,
			clues: examplePuzzle.clues,
			data: examplePuzzle.getData()
		};

		localStorage.setItem(namespace, JSON.stringify(saveObject));

		if(examplePuzzle.validate()) {

			alert("well done!");

		};

		return this;

	},
	startNewGame = function() {

		examplePuzzle = new Puzzle(ROCK.MATH.random(0, puzzles.length-1), "EASY");
		localStorage.removeItem(namespace);

	},
	openSavedGame = function() {

		savedObject = JSON.parse(savedGame);

		examplePuzzle = new Puzzle(savedObject.puzzle, savedObject.clues);
		examplePuzzle.setData(savedObject.data);

	};

	if(savedGame) {

		if(confirm("would you like to start a new game? press cancel to continue your saved game")) {

			startNewGame();

		}
		else {

			openSavedGame();

		};

	}
	else {

		startNewGame();

	};

	document.body.appendChild(examplePuzzle.toHTML());

	console.log("examplePuzzle", examplePuzzle);

})();
