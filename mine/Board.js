let board = [[]]

const config = {
  genMineProb: 0.9
}

class Board {
  constructor(container, width, height, cb) {
    this.container = container
    this.cb = cb
    this.boardHeight = height
    this.boardWidth = width
    this.init()
  }

  init() {
    const children = document.querySelector(this.container).children
    Array.from(children).forEach(child => child.remove())
    board = new Array(this.boardHeight).fill([])
    board.forEach((row, index) => {
      board[index] = new Array(this.boardWidth).fill(0)
    })
    this.genMine()
    this.genTips()
    this.drawGrid(this.cb)
    if (this.timer) {
      this.timer.end()
      this.timer.destoryIf()
    }
    this.timer = new LEDTimer(this.container)
  }

  drawGrid(cb) {
    const container = document.querySelector(this.container)
    for (let i = 0; i < board.length; i++) {
      const row = document.createElement('div')
      row.setAttribute('style', 'margin-top:0px; margin-bottom:-5px')
      for (let j = 0; j < board[i].length; j++) {
        const value = board[i][j]
        const grid = this.draw(45, 45, {value, x: i, y: j}, cb)
        row.appendChild(grid)
      }
      container.appendChild(row)
    }
  }

  isSuccess() {
    const boardEle = document.querySelector(this.container)
    return !Array.from(boardEle.children).some(grid => grid.dataset.opened === 'true' && grid.dataset.value === 0)
  }

  draw(width = 20, height = 20, values = {}, isMine = () => {}) {
    const {value, x, y} = values;
    const grid = document.createElement('div')
    grid.setAttribute('data-value', value)
    grid.setAttribute('data-opened', 'false')
    grid.setAttribute('data-x', x)
    grid.setAttribute('data-y', y)
    grid.setAttribute('style',
      `width: ${width}px; height: ${height}px; background-color: grey;
        display: inline-block; border: 1px green solid; margin: 0px;`)
    grid.setAttribute('class', 'grid')
    grid.addEventListener('click', (e) => {
      e.target.setAttribute('data-opened', 'true')
      const value = e.target.dataset.value - 0
      let color = 'white';
      let boom = false;
      if (value === -1) {
        color = 'red';
        boom = true;
      } else if (value > 0) {
        const tip = document.createElement('div');
        tip.setAttribute('style', 'font-weight: bold; margin: 0 15px; ' +
          'position: absolute; font-size: 35px;')
        tip.innerText = value
        e.target.appendChild(tip)
      } else if (value === 0) {
        this.lookEmpty(e.target)
      }
      e.target.style['background-color'] = color
      setTimeout(() => {
        isMine(boom)
        if (boom) {
          this.init()
        }
      }, 100)
    })
    return grid
  }

  genMine() {
    board.forEach(row => {
      row.forEach((col, index) => {
        const lay = Math.random() > config.genMineProb
        if (lay) {
          row[index] = -1;
        }
      })
    })
  }

  genTips() {
    board.forEach((row, x) => {
      row.forEach((col, y) => {
        if (col >= 0) {
          row[y] = this.lookAround(board, x, y)
        }
      })
    })
  }

  /**
   * 点击到空时，将其周围的空全展示
   * @param target
   */
  lookEmpty(target) {
    const {x, y} = target.dataset
    console.log(x, y)

  }

  /**
   * wn   n    en
   * w    X    e
   * ws   s    es
   * @param board
   * @param x 行坐标（y 轴）
   * @param y 列坐标（x 轴）
   * @return {*}
   */
  lookAround(board = [[]], x, y) {
    const wrapper = (x, y) => this.getPosValue(board, x, y) === -1 ? 1 : 0
    let wn = wrapper(x - 1,y - 1)
    let w =  wrapper(x, y - 1)
    let ws = wrapper(x + 1, y - 1)
    let s =  wrapper(x + 1, y)
    let es = wrapper(x + 1, y + 1)
    let e =  wrapper(x, y + 1)
    let en = wrapper(x - 1, y + 1) || 0
    let n =  wrapper(x - 1, y) || 0
    return wn + w + ws + s + es + e + en + n;
  }

  getPosValue(board, x, y) {
    let ret = 0
    try {
      ret = board[x][y]
    } catch (e) {
    }
    return ret
  }
}

class Timer {
  constructor(container) {
    this.end()
    this.destoryIf()
    this.drawTimer(container)
    this.start()
  }

  drawTimer(container) {
    const parent = document.querySelector(container).parentNode
    const timer = document.createElement('div')
    // parent.getAttribute('style')
    timer.setAttribute('style', 'width: 100px; height: 40px; font-weight:bold; font-size: 25px; ' +
      'color: green; background-color: black; line-height: 40px; text-align: center; position: absolute; margin: 60px 0 0 100px')
    timer.setAttribute('class', 'timer')

    parent.prepend(timer)
  }

  start() {
    const self = document.querySelector('.timer')
    this.cost = 0;
    this.timerInterval = setInterval(() => {
      this.cost++;
      self.innerHTML = this.cost;
    }, 1000)
  }

  end() {
    clearInterval(this.timerInterval)
  }

  destoryIf() {
    const timer = document.querySelector('.timer')
    timer && timer.remove()
  }
}

class LEDTimer {
  constructor(container) {
    this.container = container
    this.end()
    this.destoryIf()
    this.drawTimer(container)
    this.start()
  }

  drawTimer(container) {
    const parent = document.querySelector(container).parentNode
    const timer = document.createElement('div')
    timer.setAttribute('class', 'timer')
    timer.style.display = 'inline-block'

    parent.append(timer)
  }

  start() {
    this.cost = 0;
    this.timerInterval = setInterval(() => {
      this.cost++;
      this.destoryIf()
      this.drawTimer(this.container)
      this.timer = new window.LED('.timer', this.cost)
      this.timer.display()
    }, 1000)
  }

  end() {
    clearInterval(this.timerInterval)
  }

  destoryIf() {
    this.timer && this.timer.destory()
  }
}