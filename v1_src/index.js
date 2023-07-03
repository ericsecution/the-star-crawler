// Working with Canvas to create a cool "star crawler" that follows the cursor around
// and...ok, I think that I finally got it to work! Lol, stardate: Mon July 3rd, 2023

window.requestAnimFrame = function () {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);
};

    /*  setup the canvas to create a 2D rendering of the canvas ('c'), so I can draw onto it, 
        and set its boundaries equal to the width and height of the user's browser window 
        (using 'w', and 'h')
    */
function init(elemid) {
	let canvas = document.getElementById(elemid);
	let c = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let w = canvas.width;
	let h = canvas.height;
	c.fillStyle = 'rgba(30,30,30,1)';
	c.fillRect(0, 0, w, h);
	return { c: c, canvas: canvas };
}

window.onload = function () {
	/* added in 'canvasData' to call 'init()' once, and will use its returned values
    // before, I had it setup with:
        let c = init("canvas").c,
        canvas = init("canvas").canvas
    // which was duplicating the resizing and unneccessarily overriding width and height
    */
	let canvasData = init('canvas');
	let c = canvasData.c,
		canvas = canvasData.canvas,
		w = canvas.width,
		h = canvas.height,
		// going to be tracking user's 'mouse' using x & y coordinates (i.e. current position)
		mouse = { x: false, y: false },
		// I'll use the 'last_mouse' object to track user's mouse's previous position
		last_mouse = {};

	// create a helper function to calc Euclidean distance using Math.sqrt & Math.pow
	function dist(p1x, p1y, p2x, p2y) {
		return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
	}

	class segment {
		// when a new instance of the segment class is created, the constructor's called
		// l = length of the segment; and a = angle of the segment
		constructor(parent, l, a, first) {
			this.first = first;
			// if first is true, this segment's the first segment, and pos is set to parent
			if (first) {
				this.pos = {
					x: parent.x,
					y: parent.y,
				};
				// otherwise, if first is false, pos is set to nextPos
			} else {
				this.pos = {
					x: parent.nextPos.x,
					y: parent.nextPos.y,
				};
			}

			// nextPos is calculated using trigonometric functions to determine x,y coordinates
			// it uses current position (pos), length (l) and angle (ang)
			this.l = l;
			this.ang = a;
			this.nextPos = {
				x: this.pos.x + this.l * Math.cos(this.ang),
				y: this.pos.y + this.l * Math.sin(this.ang),
			};
		}
		// then, I want to call the update(t) method here in the segment class
		// this will allow the Star Crawler to be repositioned, using the
		// position (pos) and angle (ang)of a segment, based on the target position
		update(t) {
			// calculate the angle the segment should move based off comparing the target (t)
			// to the segment's current position (this.pos), using the Math.atan2() function
			this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
			this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
			this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
			this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
			this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
		}
		// Then I'm going to call in the fallback(t) function to update the position
		// of an object based on a target(t) within a two-dimensional coordinate system
		// the goal here is to make the x,y coordinates accessible (this.pos.x & this.pos.y)
		// and bring the object closer to the target position, creating a smoother transition
		fallback(t) {
			this.pos.x = t.x;
			this.pos.y = t.y;
			this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
			this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
		}
		show() {
			c.lineTo(this.nextPos.x, this.nextPos.y);
		}
	}

	class crawler {
		constructor(x, y, l, n, a) {
			this.x = x;
			this.y = y;
			this.l = l;
			this.n = n; // number of segments
			this.t = {};
			this.rand = Math.random();

			// initialize the first segment (i.e. the lone 'this' creates the first instance
			// of the crawler, which is essentially its first leg), where angle = 0, to start
			// My for loop is used to fill out the segments array with each new segment instance
			// first segment is marked as such by the 'true' parameter, and new segments shown
			// !first by utilizing the 'false' parameter within the for loop & its push method
			this.segments = [new segment(this, this.l / this.n, 0, true)];
			for (let i = 1; i < this.n; i++) {
				this.segments.push(
					new segment(this.segments[i - 1], this.l / this.n, 0, false)
				);
			}
		} // close of constructor() for Crawler class
		move(last_target, target) {
			// using Math.atan2() again to calculate the angle (in radians) for my cralwer movements
			this.angle = Math.atan2(target.y - this.y, target.x - this.x);

			// calculate duration (dt) based on the Euclidean distance (dist function) of the
			// last target position and the current target position, then add 5 units in order
			// to gain a slight overlap between current position and the new target position
			this.dt = dist(last_target.x, last_target.y, target.x, target.y) + 5;

			// then subtract 80% (of the duration multiplied by the cosine and sine of the angle)
			// and create a temp target (t) position of the x, y coordinates, for smoother movements
			this.t = {
				x: target.x - 0.8 * this.dt * Math.cos(this.angle),
				y: target.y - 0.8 * this.dt * Math.sin(this.angle),
			};

			// recalculate the position of each segment, starting with the last (this.n -1)
			if (this.t.x) {
				this.segments[this.n - 1].update(this.t);
			} else {
				this.segments[this.n - 1].update(target);
			}
			// then iterate thru to the first segment starting with the next (2nd to last) one
			for (let i = this.n - 2; i >= 0; i--) {
				this.segments[i].update(this.segments[i + 1].pos);
			}
			/* Check to see if this object is close to / has reached the target position:
            // if the distance between the object's current position and the target position
            // are less than or equal to the sum of its (length + the distance between the 
            // last target and the current target), then the fallback() method is called
            // to ensure a more seamless transition by aligning the object's segments with
            // its current position.
            */
			if (
				dist(this.x, this.y, target.x, target.y) <=
				this.l + dist(last_target.x, last_target.y, target.x, target.y)
			) {
				this.segments[0].fallback({ x: this.x, y: this.y });
				for (let i = 1; i < this.n; i++) {
					this.segments[i].fallback(this.segments[i - 1].nextPos);
				}
			}
		} // close of move()
		show(target) {
			if (dist(this.x, this.y, target.x, target.y) <= this.l) {
				c.globalCompositeOperation = 'lighter';
				c.beginPath();
				c.lineTo(this.x, this.y);
				for (let i = 0; i < this.n; i++) {
					this.segments[i].show();
				}
				c.strokeStyle =
					'hsl(' +
					(this.rand * 60 + 180) +
					',100%,' +
					(this.rand * 60 + 25) +
					'%)';
				c.lineWidth = this.rand * 2;
				c.lineCap = 'round';
				c.lineJoin = 'round';
				c.stroke();
				c.globalCompositeOperation = 'source-over';
			}
		} // close of show()
		show2(target) {
			c.beginPath();
			if (dist(this.x, this.y, target.x, target.y) <= this.l) {
				c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
				c.fillStyle = 'white';
			} else {
				c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
				c.fillStyle = 'darkcyan';
			}
			c.fill();
		} // close of show2()
	} // close of Crawler class

	let maxl = 300,
		minl = 50,
		n = 33,
		numt = 500,
		tent = [],
		clicked = false,
		target = { x: 0, y: 0 },
		last_target = {},
		t = 0,
		q = 10;

	for (let i = 0; i < numt; i++) {
		tent.push(
			new crawler(
				Math.random() * w,
				Math.random() * h,
				Math.random() * (maxl - minl) + minl,
				n,
				Math.random() * 2 * Math.PI
			)
		);
	}
	function draw() {
		if (mouse.x) {
			target.errx = mouse.x - target.x;
			target.erry = mouse.y - target.y;
		} else {
			target.errx =
				w / 2 +
				((h / 2 - q) *
					Math.sqrt(2) *
					Math.cos((t / 1000) * 2 * Math.PI) *
					Math.sin((t / 1000) * 2 * Math.PI)) /
					(Math.pow(Math.sin((t / 1000) * 2 * Math.PI), 2) + 1) -
				target.x;
			target.erry =
				h / 2 +
				((h / 2 - q) *
					Math.sqrt(2) *
					Math.cos((t / 1000) * 2 * Math.PI) *
					Math.sin((t / 1000) * 2 * Math.PI)) /
					(Math.pow(Math.sin((t / 1000) * 2 * Math.PI), 2) + 1) -
				target.y;
		}

		target.x += target.errx / 10;
		target.y += target.erry / 10;

		t += 0.01;

		c.beginPath();
		c.arc(
			target.x,
			target.y,
			dist(last_target.x, last_target.y, target.x, target.y) + 5,
			0,
			2 * Math.PI
		);
		c.fillStyle = 'hsl(210,100%,80%)';
		c.fill();

		for (i = 0; i < numt; i++) {
			tent[i].move(last_target, target);
			tent[i].show2(target);
		}
		for (i = 0; i < numt; i++) {
			tent[i].show(target);
		}
		last_target.x = target.x;
		last_target.y = target.y;
	}

	canvas.addEventListener(
		'mousemove',
		function (e) {
			last_mouse.x = mouse.x;
			last_mouse.y = mouse.y;

			mouse.x = e.pageX - this.offsetLeft;
			mouse.y = e.pageY - this.offsetTop;
		},
		false
	);

	canvas.addEventListener('mouseleave', function (e) {
		mouse.x = false;
		mouse.y = false;
	});

	canvas.addEventListener(
		'mousedown',
		function (e) {
			clicked = true;
		},
		false
	);

	canvas.addEventListener(
		'mouseup',
		function (e) {
			clicked = false;
		},
		false
	);

	function loop() {
		window.requestAnimFrame(loop);
		c.clearRect(0, 0, w, h);
		draw();
	}

	window.addEventListener('resize', function () {
		(w = canvas.width = window.innerWidth),
			(h = canvas.height = window.innerHeight);
		loop();
	});

	loop();
	setInterval(loop, 1000 / 60);
};
