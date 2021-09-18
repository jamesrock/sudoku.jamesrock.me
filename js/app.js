(function() {

	var
	puzzles = [
		[
			[
				[[0, 0], [3, 0], [3, 1], [4, 1], [4, 3], [1, 3], [1, 1], [0, 1], [0, 0]],
				[[3, 0], [9, 0], [9, 2], [6, 2], [6, 1], [3, 1], [3, 0]],
				[[4, 1], [6, 1], [6, 2], [8, 2], [8, 4], [7, 4], [7, 3], [6, 3], [6, 4], [4, 4], [4, 1]],
				[[0, 1], [1, 1], [1, 4], [3, 4], [3, 5], [1, 5], [1, 8], [0, 8], [0, 1]],
				[[1, 3], [4, 3], [4, 4], [6, 4], [6, 5], [4, 5], [4, 6], [1, 6], [1, 5], [3, 5], [3, 4], [1, 4], [1, 3]],
				[[6, 3], [7, 3], [7, 4], [8, 4], [8, 2], [9, 2], [9, 7], [8, 7], [8, 5], [7, 5], [7, 6], [6, 6], [6, 3]],
				[[4, 5], [6, 5], [6, 6], [7, 6], [7, 5], [8, 5], [8, 7], [6, 7], [6, 8], [4, 8], [4, 5]],
				[[1, 6], [4, 6], [4, 8], [3, 8], [3, 9], [0, 9], [0, 8], [1, 8], [1, 6]],
				[[3, 8], [6, 8], [6, 7], [9, 7], [9, 9], [3, 9], [3, 8]]
			], // boxes
			[], // numbers
			[]  // clues
		]
	],
	colours = [
		[199, 217, 140], [229, 205, 239], [192, 230, 250], [188, 223, 199], [212, 208, 241], [250, 216, 234], [247, 214, 193], [255, 251, 196], [197, 210, 244]
	],
	strings = {
		complete: 'well done!',
		newgame: 'start a new game?'
	};

	var Puzzle = ROCK.Object.extend({
		constructor: function Puzzle(puzzle) {

			this.squares = [];
			this.boxes = puzzle[0];
			this.numbers = puzzle[1];
			this.clues = puzzle[2];

		},
		render: function(renderer) {

			var
			boxes = this.boxes,
			boxCount = 0,
			box = boxes[boxCount],
			boxPoints = 0,
			boxPoint,
			boxSize = 50,
			offset = 100,
			context = renderer.context;

			context.lineWidth = 2;
			context.lineCap = 'round';

			// renderer.node.addEventListener('click', function() {
			setInterval(function() {

				if(boxCount===boxes.length) {

					return;

				};

				boxPoint = box[boxPoints];

				if(boxPoints===0) {

					context.beginPath();
					context.moveTo((boxPoint[0]*boxSize)+offset, (boxPoint[1]*boxSize)+offset);
					context.fillStyle = 'rgb(' + colours[boxCount].join(', ') + ')';
					console.log(box);

				}
				else {

					context.lineTo((boxPoint[0]*boxSize)+offset, (boxPoint[1]*boxSize)+offset);

				};

				console.log(boxPoint);

				boxPoints ++;

				if(boxPoints===box.length) {

					boxCount ++;
					box = boxes[boxCount];
					boxPoints = 0;

					context.fill();
					context.stroke();
					context.closePath();

				};

			}, 50);

			// });

		},
		validate: function() {

			var
			wrong = 0;

			this.forEachSquare(function(square) {

				if(!(square.displayValue===square.value)) {

					wrong ++;

				};

			});

			// return wrong;
			return wrong===0;

		},
		forEachSquare: function(callback) {

			this.squares.forEach(function(square) {

				square.squares.forEach(function(squareSquare) {

					callback(squareSquare);

				});

			});

			return this;

		},
		squareCount: 9,
		item: 0
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
			this.scale = scale;

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
		scale: 1,
		frame: 0,
		paused: false
	});

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
			sprite = this;

			if(this.scene.renderer) {

				var
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

					if(new Circle('red', 6, deflate(touchX), deflate(touchY)).hitTest(sprite)) {

						handler.call(sprite, e, touchX, touchY);

					};

					e.preventDefault();

				};

				this.scene.renderer.node.addEventListener(event, handlerProxy);

				events[this.name] = events[this.name]||[];
				events[this.name].push({
					type: event,
					handler: handler,
					handlerProxy: handlerProxy
				});

			};

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

		}
	});

	var
	difficulty = 'MEDIUM',
	namespace = 'sudoku.jamesrock.me',
	savedGame = localStorage.getItem(namespace),
	savedObject,
	width = 500,
	height = 500,
	scale = 10,
	game = new Scene(),
	renderer = new Renderer(1000, 1000, scale),
	puzzle,
	saveGame = function() {

		var
		saveObject = {
			puzzle: puzzle.puzzle,
			clues: puzzle.clues,
			data: puzzle.getData()
		};

		localStorage.setItem(namespace, JSON.stringify(saveObject));

		if(puzzle.validate()) {

			alert(strings.complete);

		};

		return this;

	},
	startNewGame = function() {

		puzzle = new Puzzle(puzzles[ROCK.MATH.random(0, puzzles.length-1)], difficulty);
		localStorage.removeItem(namespace);

	},
	openSavedGame = function() {

		savedObject = JSON.parse(savedGame);

		puzzle = new Puzzle(savedObject.puzzle, savedObject.clues);
		puzzle.setData(savedObject.data);

	};

	if(savedGame) {

		if(confirm(strings.newgame)) {

			startNewGame();

		}
		else {

			openSavedGame();

		};

	}
	else {

		startNewGame();

	};

	game.add(puzzle);

	renderer.setScene(game);

	renderer.onFrameChange = function() {



	};

	// renderer.start();
	renderer.render();

	renderer.appendTo(document.body);

})();
