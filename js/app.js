(function() {

	console.log("sudoku");

	var
	puzzles = [
		[5, 3, 4, 6, 7, 2, 1, 9, 8, 6, 7, 8, 1, 9, 5, 3, 4, 2, 9, 1, 2, 3, 4, 8, 5, 6, 7, 8, 5, 9, 2, 4, 6, 7, 1, 3, 7, 6, 1, 8, 5, 3, 9, 2, 4, 4, 2, 3, 7, 9, 1, 8, 5, 6, 9, 6, 1, 8, 2, 7, 3, 4, 5, 5, 3, 7, 4, 1, 9, 2, 8, 6, 2, 8, 4, 6, 3, 5, 1, 7, 9]
	];

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

			puzzleSquare.puzzle.item ++;

		},
		toHTML: function() {

			var
			node = document.createElement("div");

			node.classList.add("puzzle-square-square");
			node.setAttribute("data-value", this.value);
			node.innerHTML = this.value;

			return node;

		},
		min: 0,
		max: 8,
		value: 0
	});

	var
	examplePuzzle = new Puzzle(puzzles[0]);

	document.body.appendChild(examplePuzzle.toHTML());

})();
