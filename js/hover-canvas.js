const { Tween } = require("../tween.js/dist/tween.umd");

window.TWEEN = require("/js/tween.umd.js");

class PathHelper {
  points = [];
  path = "";
  commands = [];
  constructor(pathString) {
    if (pathString) {
      this.path = pathString;
      this.processPath();
    }
  }

  processPath() {
    let pattern = /[a-z]|[A-Z]/g;
    let parts = this.path.split(pattern);
    if (parts && parts[0] == "") {
      parts.shift();
    }
    this.commands = this.path.match(pattern);

    if (parts.length == this.commands.length) {
      parts = this.partNormalize(parts);
      this.commands.forEach((element, index) => {
        this.points.push({ command: element, pos: parts[index] });
      });
    } else {
      console.log("somethings not right");
    }
  }

  partNormalize(parts) {
    let cleanParts = [];

    parts.forEach((element, index) => {
      let elemntTrim = element.trim();
      let tempPart = elemntTrim.replaceAll(",", " ");
      tempPart = tempPart.split(" ");
      let tempArr = [];
      for (let i = 0; i < tempPart.length; ) {
        if (tempPart[i] != "") {
          tempArr.push(this.addPoint(parseInt(tempPart[i]), parseInt(tempPart[i + 1])));
        }
        i = i + 2;
      }
      cleanParts[index] = tempArr;
    });

    return cleanParts;
  }

  addPoint(xpos, ypos) {
    return { x: xpos, y: ypos };
  }

  getPath() {
    return this.path;
  }

  buildPath() {
    let newPath = "";
    this.points.forEach((instruction) => {
      newPath += instruction.command;
      instruction.pos.forEach((position) => {
        newPath += position.x + " " + position.y + " ";
      });
    });
    this.path = newPath;
  }

  getRawNumbers() {
    let numberArray = [];
    this.points.forEach((instruction) => {
      instruction.pos.forEach((position) => {
        numberArray.push(position.x);
        numberArray.push(position.y);
      });
    });
    return numberArray;
  }

  getXYPairs() {
    let numbers = this.getRawNumbers();
    let pairs = [];
    for (let i = 0; i < numbers.length; ) {
      pairs.push({ x: numbers[i], y: numbers[i + 1] });
      i = i + 2;
    }
    return pairs;
  }

  resetPoints(pointArray) {
    let tempPoints = [];
    let currentIndex = 0;
    this.commands.forEach((instruction) => {
      let step = { command: instruction, pos: [] };
      if (instruction === "c" || instruction === "C") {
        step.pos.push({ x: pointArray[currentIndex], y: pointArray[currentIndex + 1] });
        currentIndex += 2;
        step.pos.push({ x: pointArray[currentIndex], y: pointArray[currentIndex + 1] });
        currentIndex += 2;
        step.pos.push({ x: pointArray[currentIndex], y: pointArray[currentIndex + 1] });
        currentIndex += 2;
      } else {
        if (currentIndex < pointArray.length) {
          step.pos.push({ x: pointArray[currentIndex], y: pointArray[currentIndex + 1] });
          currentIndex += 2;
        }
      }
      tempPoints.push(step);
    });
    this.points = tempPoints;
    this.buildPath();
  }

  getPoints() {
    return this.points;
  }
}

HoverCanvas = class {
  topElement = null;
  imgElement = null;
  canvasElement = null;
  aspect = null;
  ctx = null;
  width = null;
  height = null;
  startPath = null;
  endPath = null;
  currentPath = null;
  currentPathBuilder = null;
  loop = true;
  durration = 300;
  tweens = {};

  constructor(element) {
    if (element) {
      this.topElement = element;
      this.imgElement = element.querySelector("img");
      this.canvasElement = this.buildCanvas();

      this.addPath();

      this.canvasElement.addEventListener("mouseover", () => {
        this.loop = true;
        //TWEEN.removeAll();
        let startPoints = this.currentPathBuilder.getRawNumbers();
        let endPoints = this.endPath.getRawNumbers();
        this.setupTween(startPoints, endPoints);
        this.forwarAnimate();
      });
      this.canvasElement.addEventListener("mouseleave", () => {
        this.loop = true;
        //TWEEN.removeAll();
        let startPoints = this.currentPathBuilder.getRawNumbers();
        let endPoints = this.startPath.getRawNumbers();
        this.setupTween(startPoints, endPoints);
        this.reverseAnimate();
        setTimeout(() => {
          this.loop = false;
        }, this.durration * 1.5);
      });

      this.start();
    } else {
      return null;
    }
  }

  buildCanvas() {
    let canvasElement = document.createElement("canvas");
    let parent = this.imgElement.parentElement;
    this.width = parent.getBoundingClientRect().width;
    this.height = parent.getBoundingClientRect().height;
    this.aspect = this.height / this.width;
    canvasElement.classList.add("hover-canvas");
    canvasElement.setAttribute("width", this.width);
    canvasElement.setAttribute("height", this.height);
    canvasElement.style = "width: 100%;  height: 100%; display: block;";
    this.imgElement.style = "display: none";
    this.imgElement.parentElement.appendChild(canvasElement);
    this.ctx = canvasElement.getContext("2d");

    return canvasElement;
  }

  testDraw() {
    this.ctx.strokeStyle = "#f00";
    this.ctx.lineWidth = 5;
    this.ctx.fillStyle = "#f00";
    this.ctx.drawImage(this.imgElement, 0, 0, this.width, this.height);
    let newPath = new Path2D("M 0,0 C 0,0 340,0 340,0 C 340,0 340,240 340,240 C 340,240 0,240 0,240 C 0,240 0,0 0,0 Z");
    this.ctx.stroke(newPath);
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  addPath() {
    this.startPath = new PathHelper("M 0,0 c 0,0 340,0 340,0 c 0,0 0,0 0,240 c 0,0 0,0 -340,0 c 0,0 0,0 0,-240 Z");

    if (this.getRandomInt(2) > 0) {
      this.endPath = new PathHelper(
        "M20 20 c20 20 280 -20 300 0 c-20 20 20 180 0 200 c-20 -20 -280 20 -300 0 c20 -20 -20 -180 0 -200 Z"
      );
    } else {
      //normal
      this.endPath = new PathHelper(
        "M20 20 c20 -20 280 -20 300 0 c20 20 20 180 0 200 c-20 20 -280 20 -300 0 c-20 -20 -20 -180 0 -200 Z"
      );
    }

    this.currentPathBuilder = new PathHelper(this.startPath.getPath());
    this.currentPath = new Path2D(this.currentPathBuilder.getPath());
  }

  getImageSrc() {}

  draw() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.clip(this.currentPath);
    this.ctx.drawImage(this.imgElement, 0, 0, this.width, this.height);
    this.ctx.restore();
  }

  animate(time) {
    if (this.loop) {
      requestAnimationFrame(this.animate.bind(this));
    }
    TWEEN.update(time);
    this.draw();
  }

  start() {
    this.ctx.strokeStyle = "#f00";
    this.ctx.lineWidth = 5;
    this.ctx.fillStyle = "#f00";
    this.ctx.globalCompositeOperation = "copy";
    setTimeout(() => {
      this.draw();
    }, 500);
    //this.draw();
  }
  forwarAnimate() {
    requestAnimationFrame(this.animate.bind(this));
  }

  reverseAnimate() {
    requestAnimationFrame(this.animate.bind(this));
  }

  setupTween(start, end) {
    if (start.length === end.length) {
      this.tweens = new TWEEN.Tween(start).to(end, this.durration).start();
      this.tweens.onUpdate((tweenObject) => {
        this.currentPathBuilder.resetPoints(tweenObject);
        let path = this.currentPathBuilder.getPath();
        this.currentPath = new Path2D(path);
      });
      this.tweens.onComplete((tweenObject) => {
        //this.loop = false;
      });
      this.tweens.easing(TWEEN.Easing.Quadratic.InOut);
    }
  }
};

window.HoverBuilder = {
  hoverElements: [],
  hoverCanvasItems: [],

  init: function () {
    this.hoverElements = document.querySelectorAll(".js-hover-canvas");
    this.hoverElements.forEach((element) => {
      this.hoverCanvasItems.push(new HoverCanvas(element));
    });
  },
};
(function () {
  HoverBuilder.init();
})();
