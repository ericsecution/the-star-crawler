/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\n\ncanvas.width = window.innerWidth;\ncanvas.height = window.innerHeight;\n\nlet particlesArray; // declare particles array\n\n// get mouse position \nconst mouse = {\n    x: null,\n    y: null,\n    radius: (canvas.height/80) * (canvas.width/80)\n}\n\n// create particle\nclass Particle {\n    constructor(x, y, directionX, directionY, size, color) {\n        this.x = x;\n        this.y = y;\n        this.directionX = directionX;\n        this.directionY = directionY;\n        this.size = size;\n        this.color = color;\n    }\n\n    // method to draw individual particle\n    draw() {\n        ctx.beginPath();\n        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);\n        ctx.fillStyle = 'rgba(255, 0, 255, 0.8)'; // neon pink color\n        ctx.fill();\n    }\n\n    // check particle position, check mouse position, move the particle, draw the particle\n    update() {\n        // check if particle is still within canvas\n        if (this.x > canvas.width || this.x < 0) {\n            this.directionX = -this.directionX;\n        }\n        if (this.y > canvas.height || this.y < 0) {\n            this.directionY = -this.directionY;\n        }\n\n        // check collision detection - mouse position / particle position\n        let dx = mouse.x - this.x;\n        let dy = mouse.y - this.y;\n        let distance = Math.sqrt(dx * dx + dy * dy);\n        if (distance < mouse.radius + this.size) {\n            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {\n                this.x += 10;\n            }\n            if (mouse.x > this.x && this.x > this.size * 10) {\n                this.x -= 10;\n            }\n            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {\n                this.y += 10;\n            }\n            if (mouse.y > this.y && this.y > this.size * 10) {\n                this.y -= 10;\n            }\n        }\n        // move particle\n        this.x += this.directionX;\n        this.y += this.directionY;\n        // draw particle\n        this.draw();\n    }\n}\n\n// create particle array\nfunction init() {\n    particlesArray = [];\n    let numberOfParticles = (canvas.height * canvas.width) / 9000;\n    for (let i = 0; i < numberOfParticles; i++) {\n        let size = (Math.random() * 5) + 1;\n        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);\n        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);\n        let directionX = (Math.random() * 5) - 2.5;\n        let directionY = (Math.random() * 5) - 2.5;\n        let color = 'rgba(0, 255, 0, 0.5)'; // neon green color\n\n        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));\n    }\n}\n\n// check if particles are close enough to draw line between them\nfunction connectParticles() {\n    let opacityValue = 1;\n    for (let a = 0; a < particlesArray.length; a++) {\n        for (let b = a; b < particlesArray.length; b++) {\n            let distance = (( particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))\n                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));\n            if (distance < (canvas.width/7) * (canvas.height/7)) {\n                opacityValue = 1 - (distance/20000);\n                ctx.strokeStyle='rgba(0, 255, 0, ' + opacityValue + ')'; // neon green color\n                ctx.lineWidth = 1;\n                ctx.beginPath();\n                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);\n                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);\n                ctx.stroke();\n            }\n        }\n    }\n}\n\n// animation loop\nfunction animate() {\n    requestAnimationFrame(animate);\n    ctx.clearRect(0, 0, innerWidth, innerHeight);\n\n    for (let i = 0; i < particlesArray.length; i++) {\n        particlesArray[i].update();\n    }\n    connectParticles();\n}\n\n// resize event\nwindow.addEventListener('resize', function() {\n    canvas.width = innerWidth;\n    canvas.height = innerHeight;\n    mouse.radius = ((canvas.height/80) * (canvas.width/80));\n    init();\n});\n\n// mouse out event\nwindow.addEventListener('mouseout', function() {\n    mouse.x = undefined;\n    mouse.y = undefined;\n});\n\nwindow.addEventListener('mousemove', function(event) {\n    mouse.x = event.x;\n    mouse.y = event.y;\n});\n\ninit();\nanimate();\n\n\n//# sourceURL=webpack://the-star-crawler/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;