(function() {

	var
	pixelRatio = window.devicePixelRatio||1,
	inflate = function(value) {
		return value*pixelRatio;
	},
	deflate = function(value) {
		return value/pixelRatio;
	},
	DisplayObject = ROCK.Object.extend({
		x: 0,
		y: 0,
		z: 0,
		width: 0,
		height: 0,
		rotation: 0,
		visible: true,
		opacity: 1,
		bind: function(event, handler) {

			var
			sprite = this,
			handlerProxy = function(e) {

				if(!sprite.visible) {
					return;
				};

				var
				touch,
				touchX,
				touchY;

				if(isTouch) {

					touch = e.changedTouches[0];
					touchX = touch.clientX-touch.target.offsetLeft;
					touchY = touch.clientY-touch.target.offsetTop;

				}
				else {

					touch = e;
					touchX = touch.offsetX;
					touchY = touch.offsetY;

				};

				touchX = inflate(touchX);
				touchY = inflate(touchY);

				if(new Circle('red', 3, touchX, touchY).hitTest(sprite)) {

					handler.call(sprite, e, touchX, touchY);

				};

				e.preventDefault();

			};

			renderer.node.addEventListener(event, handlerProxy);

			return this;

		},
		move: function(prop, value) {

			this[prop] += value;
			return this[prop];

		},
		scale: 1
	}),
	Circle = DisplayObject.extend({
		constructor: function Circle(fill, radius, x, y) {

			this.fill = fill;
			this.x = x;
			this.y = y;
			this.radius = radius;

		},
		render: function() {

			if(!this.visible) {
				return;
			};

			var
			renderer = this.scene.renderer,
			context = renderer.context;

			context.save();
			context.scale(this.scale, this.scale);
			context.translate(this.x, this.y);
			context.globalAlpha = this.opacity;
			context.fillStyle = this.fill;
			context.beginPath();
			context.arc(0, 0, this.radius, 0, 2*Math.PI);
			context.closePath();
			context.fill();
			context.restore();

		},
		hitTest: function(rect) {

			var
			deltax = (this.x - Math.max(rect.x, Math.min(this.x, (rect.x + rect.width)))),
			deltay = (this.y - Math.max(rect.y, Math.min(this.y, (rect.y + rect.height))));

			return ((deltax * deltax) + (deltay * deltay)) < (this.radius * this.radius);

		}
	}),
	Puzzle = DisplayObject.extend({
		constructor: function Puzzle(puzzle, sizes) {

			this.tiles = [];
			this.boxes = puzzle[0];
			this.numbers = puzzle[1];
			this.logic = puzzle[2];
			this.hints = puzzle[3];
			this.boxSize = sizes.box;
			this.offset = sizes.offset;
			this.text = sizes.text;

			var
			inc,
			tile,
			clue;

			for(var col=0;col<9;col++) {

				for(var row=0;row<9;row++) {

					inc = this.tiles.length;
					clue = this.logic[inc]<=this.hints;

					tile = new PuzzleTile([row, col].join(''), boxSize, boxSize, (row*boxSize)+offset, (col*boxSize)+offset, clue, this.numbers[inc]||0, this.logic[inc]||0);

					if(!clue&&(mode==='play')) {
						tile.bind(touchStartEvent, function() {

							this.cycle();
							renderer.render();
							saveGame();
							console.log(this);

						});
					};

					this.addTile(tile);

				};

			};

			this.tiles.sort(function(a, b) {
				return a.logic-b.logic;
			});

			console.log(this);

		},
		render: function() {

			var
			boxes = this.boxes,
			boxSize = this.boxSize,
			offset = this.offset,
			context = renderer.context,
			rowsAndCols = 8,
			box,
			point;

			context.lineCap = 'round';
			context.lineWidth = inflate(4);

			for(var boxCount=0; boxCount<boxes.length; boxCount++) {

				box = boxes[boxCount];

				for(var pointCount=0;pointCount<box.length;pointCount++) {

					point = box[pointCount];

					if(pointCount===0) {

						context.beginPath();
						context.moveTo((point[0]*boxSize)+offset, (point[1]*boxSize)+offset);
						context.fillStyle = 'rgb(' + colours[boxCount].join(', ') + ')';
						// console.log(box);

					}
					else {

						context.lineTo((point[0]*boxSize)+offset, (point[1]*boxSize)+offset);

					};

				};

				// console.log('bob', boxCount, pointCount);

				context.fill();
				context.stroke();
				context.closePath();

			};

			context.lineWidth = inflate(2);

			for(var row=1; row<=rowsAndCols; row++) {

				context.moveTo(offset, (row*boxSize)+offset);
				context.lineTo((boxSize*9)+offset, (row*boxSize)+offset);

			};

			for(var col=1; col<=rowsAndCols; col++) {

				context.moveTo((col*boxSize)+offset, offset);
				context.lineTo((col*boxSize)+offset, (boxSize*9)+offset);

			};

			context.stroke();

			for(var tile=0; tile<this.tiles.length; tile++) {

				this.tiles[tile].render();

			};

		},
		check: function() {

			var
			wrong = 0;

			this.tiles.forEach(function(tile) {

				if(!tile.check()) {

					wrong ++;

				};

			});

			return wrong===0;

		},
		addTile: function(tile) {

			tile.puzzle = tile.parent = this;

			this.tiles.push(tile);

		},
		getValues: function() {

			var
			output = [];

			this.tiles.forEach(function(item) {

				output.push(item.value);

			});

			return output;

		},
		setValues: function(values) {

			this.tiles.forEach(function(item, index) {

				item.value = values[index];

			});

		},
		showHint: function() {

			var
			tile;

			for(var tileIndex=0; tileIndex<this.tiles.length; tileIndex++) {

				tile = this.tiles[tileIndex];

				if(!tile.check()) {
					break;
				};

			};

			tile.showHint();

			console.log(tile);

		},
		count: function() {

			var
			correct = 0;

			this.tiles.forEach(function(tile) {

				if(tile.check()) {

					correct ++;

				};

			});

			return correct;

		},
		boxSize: 50,
		offset: 100
	}),
	PuzzleTile = DisplayObject.extend({
		constructor: function PuzzleTile(name, width, height, x, y, clue, correct, logic) {

			this.name = name;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.clue = clue;
			this.correct = correct;
			this.logic = logic;

			if(clue) {
				this.value = this.correct;
			};

		},
		render: function() {

			var
			boxSize = this.puzzle.boxSize,
			offset = this.puzzle.offset,
			text = this.puzzle.text,
			renderer = this.puzzle.scene.renderer,
			context = renderer.context,
			xAlign = ((boxSize/2)),
			yAlign = ((boxSize/2));

			context.save();
			context.scale(this.scale, this.scale);
			context.translate(this.x, this.y);
			if(this.rotation) {
				context.rotate(this.rotation*Math.PI/180);
			};
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.globalAlpha = this.opacity;

			if(mode==='logic') {
				context.font = `${text/2}px sans-serif`;
			}
			else {
				context.font = `${text}px sans-serif`;
			};

			if(mode==='preview') {
				if(this.clue) {
					context.fillStyle = 'rgb(200, 0, 0)';
				}
				else {
					context.fillStyle = 'rgb(0, 0, 0)';
				};
			}
			else if(mode==='logic') {
				context.fillStyle = 'rgb(0, 0, 0)';
			}
			else {
				if(this.clue) {
					context.fillStyle = 'rgb(0, 0, 0)';
				}
				else if(this.hint) {
					context.fillStyle = 'rgb(200, 0, 0)';
				}
				else {
					context.fillStyle = 'rgb(0, 80, 200)';
					// context.fillStyle = 'rgb(0, 110, 255)';
				};
			}

			if(mode==='logic') {
				context.fillText(this.logic, xAlign, yAlign);
			}
			else {
				if(this.clue||mode==='preview') {
					context.fillText(this.correct, xAlign, yAlign);
				}
				else if(this.hint) {
					context.fillText('?', xAlign, yAlign);
				}
				else {
					context.fillText(this.value===0?'':this.value, xAlign, yAlign);
				};
			};

			context.restore();

		},
		cycle: function() {

			this.hint = false;

			if(this.value<(this.maxValue)) {
				this.value ++;
			}
			else {
				this.value = 0;
			};

		},
		check: function() {

			var _return = false;

			if(this.value===this.correct) {

				_return = true;

			};

			return _return;

		},
		showHint: function() {

			this.hint = true;
			this.value = 0;

		},
		value: 0,
		maxValue: 9,
		clue: false,
		correct: 0,
		hint: false,
		logic: 0
	}),
	Scene = ROCK.Object.extend({
		constructor: function Scene() {

			this.children = [];

		},
		add: function(child) {

			this.children.push(child);
			child.scene = this;
			child.z = this.children.length;

		}
	}),
	Renderer = ROCK.Object.extend({
		constructor: function Renderer(width, height) {

			// console.log('new Renderer()', this, arguments);

			this.width = width;
			this.height = height;

			this.node = document.createElement('canvas');
			this.context = this.node.getContext(this.type);

			this.node.width = inflate(this.width);
			this.node.height = inflate(this.height);

			this.node.style.width = (this.width + 'px');
			this.node.style.height = (this.height + 'px');

		},
		render: function() {

			var
			childrenCount = this.scene.children.length;

			// clear
			this.node.width = inflate(this.width);

			for(var i=0;i<childrenCount;i++) {

				this.scene.children[i].render();

			};

			return this;

		},
		appendTo: function(replace) {

			document.body.replaceChild(this.node, replace);
			return this;

		},
		start: function() {

			var
			_this = this;

			this.frame = requestAnimationFrame(function() {

				_this.start();

			});

			this.render();

			if(this.paused) {

				return this;

			};

			return this;

		},
		stop: function() {

			cancelAnimationFrame(this.frame);
			return this;

		},
		setScene: function(scene) {

			scene.renderer = this;

			this.scene = scene;
			return this;

		},
		pause: function() {

			this.paused = !this.paused;
			return this;

		},
		type: '2d',
		scene: null,
		frame: 0,
		paused: false
	}),
	colours = [
		[199, 217, 140], [229, 205, 239], [192, 230, 250], [188, 223, 199], [212, 208, 241], [250, 216, 234], [247, 214, 193], [255, 251, 196], [197, 210, 244]
	],
	strings = {
		complete: 'well done!',
		continue: 'continue saved game?'
	},
	getSizes = function() {

		var
		boxSize = 50,
		offsetSize = 100,
		textSize = 46,
		screenWidth = window.innerWidth;

		if(screenWidth<=320) {
			offsetSize = 11;
		}
		else if(screenWidth<=375) {
			offsetSize = 11;
		}
		else if(screenWidth<=414) {
			offsetSize = 20;
		};

		if(screenWidth<=414) {
			boxSize = ((screenWidth - (offsetSize*2)) / 9);
		};

		boxSize = (boxSize|0);

		offsetSize = inflate(offsetSize);
		boxSize = inflate(boxSize);

		textSize = (boxSize-1);

		// console.log(boxSize, textSize);

		return {
			box: boxSize,
			offset: offsetSize,
			text: textSize
		};

	},
	isTouch = ('ontouchstart' in window),
	touchStartEvent = 'touchstart',
	touchEndEvent = 'touchend',
	namespace = 'sudoku.jamesrock.me',
	savedGame = localStorage.getItem(namespace),
	savedObject,
	sizes = getSizes(),
	boxSize = sizes.box,
	offset = sizes.offset,
	mode = 'play', // preview, logic, clues, play
	renderer,
	game,
	puzzle,
	puzzleIndex = puzzles.length-1,
	saveGame = function() {

		var
		saveObject = {
			puzzle: puzzleIndex,
			values: puzzle.getValues()
		};

		localStorage.setItem(namespace, JSON.stringify(saveObject));

		if(puzzle.check()) {

			alert(strings.complete);

		};

		return this;

	},
	startNewGame = function(restart) {

		renderer = new Renderer(window.innerWidth, window.innerHeight);

		if((mode==='play')&&!restart) {
			puzzleIndex = ROCK.MATH.random(0, puzzles.length-1);
		};

		puzzle = new Puzzle(puzzles[puzzleIndex], sizes);
		localStorage.removeItem(namespace);

		setup();

	},
	openSavedGame = function() {

		renderer = new Renderer(window.innerWidth, window.innerHeight);
		savedObject = JSON.parse(savedGame);
		puzzleIndex = savedObject.puzzle;
		puzzle = new Puzzle(puzzles[puzzleIndex], sizes);
		puzzle.setValues(savedObject.values);

		setup();

	},
	setup = function() {

		game = new Scene();

		renderer.setScene(game);

		game.add(puzzle);

		renderer.render();
		// renderer.start();

		renderer.appendTo(document.querySelector('canvas'));

	},
	hintButton = document.getElementById('hint'),
	restartButton = document.getElementById('restart'),
	newGameButton = document.getElementById('newgame');

	if(!isTouch) {

		touchStartEvent = 'mousedown';
		touchEndEvent = 'mouseup';

	};

	if(savedGame) {

		openSavedGame();

	}
	else {

		startNewGame();

	};

	hintButton.addEventListener('click', function() {

		puzzle.showHint();
		renderer.render();
		saveGame();

	});

	restartButton.addEventListener('click', function() {

		startNewGame(true);

	});

	newGameButton.addEventListener('click', function() {

		startNewGame();

	});

})();
