(function() {

	console.log("sudoku");

	var
	puzzles = [
		[5, 3, 4, 6, 7, 2, 1, 9, 8, 6, 7, 8, 1, 9, 5, 3, 4, 2, 9, 1, 2, 3, 4, 8, 5, 6, 7, 8, 5, 9, 4, 2, 6, 7, 1, 3, 7, 6, 1, 8, 5, 3, 9, 2, 4, 4, 2, 3, 7, 9, 1, 8, 5, 6, 9, 6, 1, 2, 8, 7, 3, 4, 5, 5, 3, 7, 4, 1, 9, 2, 8, 6, 2, 8, 4, 6, 3, 5, 1, 7, 9],
		[8, 2, 7, 9, 6, 5, 3, 4, 1, 1, 5, 4, 3, 2, 7, 6, 8, 9, 3, 9, 6, 1, 4, 8, 7, 5, 2, 5, 9, 3, 4, 7, 2, 6, 1, 8, 4, 6, 8, 5, 1, 3, 9, 7, 2, 2, 7, 1, 6, 8, 9, 4, 3, 5, 7, 8, 6, 1, 5, 4, 2, 3, 9, 2, 3, 5, 7, 9, 6, 8, 4, 1, 9, 1, 4, 8, 2, 3, 5, 6, 7]
	],
	levels = {
		EASY: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		MEDIUM: [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
		HARD: [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
		TOUGH: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		TRICKY: [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1]
	},
	level = 'TRICKY';

	var Puzzle = ROCK.Object.extend({
		constructor: function Puzzle(data) {

			this.squares = [];
			this.data = data;
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
			this.value = puzzleSquare.puzzle.data[puzzleSquare.puzzle.item];
			this.clue = !!levels[level][puzzleSquare.puzzle.item];
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
				e.stopPropagation();

			});

			if(!this.clue) {

				this.node.addEventListener("mouseup", function(e) {

					e.preventDefault();
					e.stopPropagation();

					square.incrementDisplayValue();

				});

			};

			return this.node;

		},
		incrementDisplayValue: function() {

			if(this.displayValue<=this.max) {

				this.displayValue ++;

			}
			else {

				this.displayValue = 0;

			};

			this.updateDisplayValue();

			return this;

		},
		updateDisplayValue: function() {

			var
			value = "";

			if(this.displayValue>0) {

				value = this.displayValue;

			};

			this.node.innerHTML = value;
			this.node.setAttribute("data-value", this.displayValue);

			return this;

		},
		min: 0,
		max: 8,
		value: 0,
		displayValue: 0,
		clue: false
	});

	var
	examplePuzzle = new Puzzle(puzzles[0]);

	document.body.appendChild(examplePuzzle.toHTML());

	console.log("examplePuzzle", examplePuzzle);

})();
