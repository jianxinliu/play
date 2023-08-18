const setting = {
  w: 30,
  h: 40,
  initSnakeLen: 4,
};

class Food {
  pos = [];
  score = 1;
  constructor(pos = [], score = 1) {
    this.pos = pos;
    this.score = score;
  }
}

class BoardElement {
  create() {
    const board = document.getElementById("board");
    board.style = `grid-template-columns: ${"auto ".repeat(
      setting.w
    )}; width: ${setting.w * 10}px`;
    for (let index = 0; index < setting.w * setting.h; index++) {
      const grid = document.createElement("div");
      grid.setAttribute("class", "grid");
      grid.setAttribute("id", "id_" + (index + 1));
      board.appendChild(grid);
    }
  }

  createSnakeBody() {
    let body = [];
    for (let index = 0; index < setting.initSnakeLen; index++) {
      const grid = document.getElementById("id_" + (index + 1));
      grid.setAttribute("class", "snake");
      body.push(toBoardIndex(index + 1));
    }
    body = body.reverse();

    this.createFood(body);

    return body;
  }

  getNodeByPosition(pos = []) {
    return document.getElementById("id_" + toArrayIndex(pos));
  }

  paintNode(pos = [], nodeClassName = "snake") {
    const ele = this.getNodeByPosition(pos);
    ele.setAttribute("class", nodeClassName);
  }

  eraseNode(pos = []) {
    const ele = this.getNodeByPosition(pos);
    ele.setAttribute("class", "grid");
  }

  hasFood(pos = []) {
    const ele = this.getNodeByPosition(pos);
    return ele.classList.contains("food");
  }

  createFood(body = []) {
    const r = randomPositionExcludes(body.map((v) => toArrayIndex(v)));
    const foodEle = document.getElementById("id_" + r);
    foodEle.setAttribute("class", "food");
    const food = new Food(toBoardIndex(r));
    console.log(food);
  }
}

function samePosition(aP = [], bP = []) {
  return aP[0] === bP[0] && aP[1] === bP[1];
}

class Snake {
  // every node's coordinate on body [[x, y]]
  body = [];
  board = new BoardElement();
  lastDir = [];

  constructor(body, board) {
    this.board = board;
    this.body = body;
  }

  move(next = []) {
    if (!next.length) {
      next = this.lastDir;
    }
    const turnNode = this.body[0];
    let nextPos = [turnNode[0] + next[0], turnNode[1] + next[1]];

    // backwards check
    if (samePosition(nextPos, this.body[1])) {
      return;
    }
    
    // body check
    if (this.body.some((b) => samePosition(b, nextPos))) {
      throw Error("break");
    }

    this.lastDir = [...next];

    let nextNode = nextPos;
    const ate = this.board.hasFood(nextPos);

    // paint new
    this.board.paintNode(nextNode);

    // move body
    let tempNode = [];
    for (let i = 0; i < this.body.length; i++) {
      let curr = this.body[i];
      tempNode = curr;
      this.body[i] = nextPos;
      nextPos = tempNode;
    }
    if (ate) {
      this.body.push(tempNode);
      this.board.createFood(this.body);
      return true
    } else {
      this.board.eraseNode(tempNode);
    }
  }
}

function toArrayIndex([x, y]) {
  if (x < 1 || x > setting.w || y < 1 || y > setting.h) {
    throw Error("wrong position");
  }
  return (y - 1) * setting.w + x;
}
function toBoardIndex(s) {
  if (s < 1 || s > setting.w * setting.h) {
    throw Error("wrong position");
  }
  const row = Math.floor(s / setting.w);
  const r = s % setting.w;
  if (r > 0) {
    return [r, row + 1];
  } else {
    return [setting.w, row];
  }
}

function randomPosition() {
  return Math.floor(Math.random() * (setting.w * setting.h)) + 1;
}

function randomPositionExcludes(pos = []) {
  for (let i = 0; i < 100; i++) {
    const r = randomPosition();
    if (pos.includes(r)) {
      continue;
    }
    return r;
  }
  return 1;
}

const keyCtrls = [
  "w",
  "a",
  "s",
  "d",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];
function registerKeyListener() {
  document.addEventListener("keydown", (e) => {
    let dir = "";
    if (keyCtrls.includes(e.key)) {
      e.preventDefault();
    }
    switch (e.key) {
      case "w":
      case "ArrowUp":
        // up
        dir = "up";
        break;
      case "a":
      case "ArrowLeft":
        // left
        dir = "left";
        break;
      case "s":
      case "ArrowDown":
        // down
        dir = "down";
        break;
      case "d":
      case "ArrowRight":
        // right
        dir = "right";
        break;
      default:
      // unsupported
    }
    if (dir) {
      eventHandlerMap[dir]();
    }
  });
}
