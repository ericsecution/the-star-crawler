window.onload = function initAnimation() {
    /*  setup the canvas JS variable here to contain the-star-crawler element from my HTML
        create a 2D rendering of the canvas ('c'), so I can draw onto it, and set it bounds
        equal to the width and height of the user's browser window (using 'w', and 'h')
    */
    let canvas = document.getElementById("the-star-crawler"),
    c = canvas.getContext("2d"),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight),
    // going to be tracking user's 'mouse' using x & y coordinates (i.e. current position)
    mouse = { x: false, y: false },
    // I'll use the 'last_mouse' object to track user's mouse's previous position
    last_mouse = {};

    // create a helper function to calc Euclidean distance using Math.sqrt & Math.pow
    function dist(p1x, p1y, p2x, p2y) {
        return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
    }

class segment{
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
            this.n = n;
            this.t = {};
            this.rand = Math.random();
            this.segments = [new segment(this, this.l / this.n, 0, true)];
            for (let i = 1; i < this.n; i++) {
                this.segments.push(
                    new segment(this.segments[i - 1], this.l / this.n, 0, false)
                );
            }
        }
        move(last_target, target) {
            this.angle = Math.atan2(target.y - this.y, target.x - this.x);
            this.dt = dist(last_target.x, last_target.y, target.x, target.y) + 5;
            this.t = {
                x: target.x - 0.8 * this.dt * Math.cos(this.angle),
                y: target.y - 0.8 * this.dt * Math.sin(this.angle),
            };
            if (this.t.x) {
                this.segments[this.n - 1].update(this.t);
            } else {
                this.segments[this.n - 1].update(target);
            }
            for (let i = this.n - 2; i >= 0; i--) {

                this.segments[i].update(this.segments[i + 1].pos);
            }
            if (
                dist(this.x, this.y, target.x, target.y) <=
                this.l + dist(last_target.x, last_target.y, target.x, target.y)
            ) {
                this.segments[0].fallback({x: this.x, y: this.y});
                for (let i = 1; i < this.n; i++) {
                    this.segments[i].fallback(this.segments[i - 1].nextPos);
                }
            }
        }
       
    }

}
























