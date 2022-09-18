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
      this.timer.destroyIf()
    }
    this.timer = getTimer(this.container)
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
        const dataset = e.target.dataset
        this.lookEmpty({x: dataset.x - 0, y: dataset.y - 0})
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
   * 点击到空时，将其周围可达的空格全展示
   * @param currentPos 当前位置
   */
  lookEmpty(currentPos) {
    // right
    this.lookEmptyDir(currentPos, ({x, y}) => ({x: x + 1, y}))
    // left
    this.lookEmptyDir(currentPos, ({x, y}) => ({x: x - 1, y}))
    // up
    this.lookEmptyDir(currentPos, ({x, y}) => ({x, y: y - 1}))
    // down
    this.lookEmptyDir(currentPos, ({x, y}) => ({x, y: y + 1}))
  }

  /**
   * 向某一方向前进寻找空的格子，是空格子则翻开
   * @param startPos 起始位置
   * @param nextPosFn 下一个位置的生成函数
   */
  lookEmptyDir(startPos = {}, nextPosFn) {
    const {x, y} = nextPosFn(startPos)
    const edgeMagic = -7
    const current = this.getPosValue(board, x, y, edgeMagic)
    if (current !== 0 || current === edgeMagic) {
      return
    }
    // 是 0

    // 找到坐标是 x,y 的这个格子的 dom 元素
    const currentDom = document.querySelector(`div [data-x="${x}"][data-y="${y}"]`)
    if (currentDom) {
      // 翻过了，跳过该方向
      if (currentDom.dataset.opened === 'true') {
        return
      }
      // 翻开该处
      currentDom.setAttribute('data-opened', 'true')
      currentDom.style['background-color'] = 'white'
    }
    // 继续遍历该方向
    this.lookEmpty({x, y})
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

  getPosValue(board, x, y, defaultValue = 0) {
    let ret = defaultValue
    try {
      ret = board[x][y]
    } catch (e) {
    }
    return ret
  }
}
