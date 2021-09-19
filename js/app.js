(function() {

	var
	colours = [
		[199, 217, 140], [229, 205, 239], [192, 230, 250], [188, 223, 199], [212, 208, 241], [250, 216, 234], [247, 214, 193], [255, 251, 196], [197, 210, 244]
	],
	strings = {
		complete: 'well done!',
		continue: 'continue saved game?'
	},
	events = {},
	isTouch = ('ontouchstart' in window);

	var DisplayObject = ROCK.Object.extend({
		x: 0,
		y: 0,
		z: 0,
		width: 0,
		height: 0,
		rotation: 0,
		visible: true,
		xOffset: 0,
		yOffset: 0,
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

				if(new Circle('red', 2, touchX, touchY).hitTest(sprite)) {

					handler.call(sprite, e, touchX, touchY);

				};

				e.preventDefault();

			};

			renderer.node.addEventListener(event, handlerProxy);

			events[this.name] = events[this.name]||[];
			events[this.name].push({
				type: event,
				handler: handler,
				handlerProxy: handlerProxy
			});

			return this;

		},
		unbind: function(event, handler) {

			// console.log('unbind()', events[this.name]);

			var
			obj = events[this.name].filter(function(e) {
				return e.type===event&&e.handler===handler;
			})[0];

			events[this.name].splice(events[this.name].indexOf(obj), 1);

			this.scene.renderer.node.removeEventListener(event, obj.handlerProxy);

		},
		move: function(prop, value) {

			this[prop] += value;
			return this[prop];

		},
		scale: 1
	});

	var Circle = DisplayObject.extend({
		constructor: function Circle(fill, radius, x, y) {

			this.fill = fill;
			this.x = x;
			this.y = y;
			this.radius = radius;

		},
		render: function(renderer) {

			if(!this.visible) {
				return;
			};

			renderer.context.save();
			renderer.context.scale(this.scale, this.scale);
			renderer.context.translate(this.x, this.y);
			renderer.context.globalAlpha = this.opacity;
			renderer.context.fillStyle = this.fill;
			renderer.context.beginPath();
			renderer.context.arc(0, 0, this.radius, 0, 2*Math.PI);
			renderer.context.closePath();
			renderer.context.fill();
			renderer.context.restore();

			this.renderer = renderer;

		},
		hitTest: function(rect) {

			var
			deltax = (this.x - Math.max(rect.x, Math.min(this.x, (rect.x + rect.width)))),
			deltay = (this.y - Math.max(rect.y, Math.min(this.y, (rect.y + rect.height))));

			return ((deltax * deltax) + (deltay * deltay)) < (this.radius * this.radius);

		}
	});

	var PuzzleTile = DisplayObject.extend({
		constructor: function PuzzleTile(name, width, height, x, y, clue, correct) {

			this.name = name;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.clue = clue;
			this.correct = correct;

			if(clue) {
				this.value = this.correct;
			};

		},
		render: function(renderer) {

			var
			boxSize = this.puzzle.boxSize,
			offset = this.puzzle.offset,
			context = renderer.context;

			context.imageSmoothingEnabled = false;
			context.save();
			context.scale(this.scale, this.scale);
			context.translate(this.x, this.y);
			if(this.rotation) {
				context.rotate(this.rotation*Math.PI/180);
			};
			context.globalAlpha = this.opacity;
			context.font = '34px Helvetica';
			context.fillStyle = 'rgb(0, 0, 0)';

			var xAlign = (boxSize/2)-10;
			var yAlign = (boxSize/2)+11;

			if(this.clue) {
				context.fillText(this.correct, xAlign, yAlign);
			}
			else {
				context.fillText(this.value===0?'':this.value, xAlign, yAlign);
			};

			context.restore();

		},
		cycle: function() {

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
		value: 0,
		maxValue: 9,
		clue: false,
		correct: 9
	});

	var Puzzle = ROCK.Object.extend({
		constructor: function Puzzle(puzzle) {

			this.tiles = [];
			this.boxes = puzzle[0];
			this.numbers = puzzle[1];
			this.clues = puzzle[2];

			var
			inc,
			tile,
			boxSize = this.boxSize,
			offset = this.offset;

			for(var col=0;col<9;col++) {

				for(var row=0;row<9;row++) {

					// console.log(row, col);

					inc = this.tiles.length;

					tile = new PuzzleTile([row, col].join(''), 50, 50, (row*boxSize)+offset, (col*boxSize)+offset, !!this.clues[inc], this.numbers[inc]);

					if(!this.clues[inc]) {
						tile.bind('click', function() {

							this.cycle();
							saveGame();
							console.log(this);

						});
					};

					this.addTile(tile);

				};

			};

			console.log(this.tiles);

		},
		render: function(renderer) {

			var
			_this = this,
			boxes = this.boxes,
			box,
			point,
			boxSize = this.boxSize,
			offset = this.offset,
			context = renderer.context,
			rowsAndCols = 8;

			context.lineCap = 'round';
			context.lineWidth = 3;

			for(var boxCount=0;boxCount<boxes.length;boxCount++) {

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

			context.lineWidth = 1;

			for(var row=1; row<=rowsAndCols; row++) {

				context.moveTo(offset, (row*boxSize)+offset);
				context.lineTo((boxSize*9)+offset, (row*boxSize)+offset);

			};

			for(var col=1; col<=rowsAndCols; col++) {

				context.moveTo((col*boxSize)+offset, offset);
				context.lineTo((col*boxSize)+offset, (boxSize*9)+offset);

			};

			context.stroke();

			for(var tile=0; tile<_this.tiles.length; tile++) {

				_this.tiles[tile].render(renderer);

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

			tile.puzzle = this;
			this.tiles.push(tile);

		},
		boxSize: 50,
		offset: 100
	});

	var Scene = ROCK.Object.extend({
		constructor: function Scene() {

			this.children = [];

		},
		add: function(child) {

			this.children.push(child);
			child.scene = this;
			child.z = this.children.length;

		}
	});

	var Renderer = ROCK.Object.extend({
		constructor: function Renderer(width, height, scale) {

			this.width = width;
			this.height = height;

			// console.log('new Renderer()', this, arguments);

			this.node = document.createElement('canvas');
			this.context = this.node.getContext(this.type);

			this.node.width = (this.width);
			this.node.height = (this.height);

			this.node.style.width = (this.width + 'px');
			this.node.style.height = (this.height + 'px');

		},
		render: function() {

			var
			childrenCount = this.scene.children.length,
			_this = this;

			this.scene.renderer = this;

			// clear
			this.node.width = this.width;

			for(var i=0;i<childrenCount;i++) {

				this.scene.children[i].render(_this);

			};

			return this;

		},
		appendTo: function(child) {

			child.appendChild(this.node);
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

			this.onFrameChange.call(this);

			return this;

		},
		stop: function() {

			cancelAnimationFrame(this.frame);
			return this;

		},
		setScene: function(scene) {

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
	});

	var
	namespace = 'sudoku.jamesrock.me',
	savedGame = localStorage.getItem(namespace),
	savedObject,
	width = 500,
	height = 500,
	scale = 1,
	game = new Scene(),
	renderer = new Renderer(1000, 1000, scale),
	puzzle,
	saveGame = function() {

		console.log('saveGame');

		// var
		// saveObject = {
		// 	puzzle: puzzle.puzzle,
		// 	data: puzzle.getData()
		// };
		//
		// localStorage.setItem(namespace, JSON.stringify(saveObject));

		if(puzzle.check()) {

			alert(strings.complete);

		};

		return this;

	},
	startNewGame = function() {

		var puzzleIndex = ROCK.MATH.random(0, puzzles.length-1);

		puzzleIndex = 2;

		puzzle = new Puzzle(puzzles[puzzleIndex]);
		localStorage.removeItem(namespace);

	},
	openSavedGame = function() {

		savedObject = JSON.parse(savedGame);

		puzzle = new Puzzle(savedObject.puzzle, savedObject.clues);
		puzzle.setData(savedObject.data);

	};

	if(savedGame) {

		if(confirm(strings.continue)) {

			openSavedGame();

		}
		else {

			startNewGame();

		};

	}
	else {

		startNewGame();

	};

	game.add(puzzle);

	renderer.setScene(game);

	renderer.onFrameChange = function() {



	};

	renderer.start();
	// renderer.render();

	renderer.appendTo(document.body);

})();
