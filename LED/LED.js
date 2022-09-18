class LED {
  constructor(container, nums) {
    this.nums = nums + ""
    this.container = container
    const all = document.querySelector(this.container)
    this.nums.split('').forEach((n, index) => {
      const one = document.createElement('div')
      const cntName = 'innerFrame' + index
      one.setAttribute('class', cntName)
      one.style.display = 'inline-block'
      one.style['margin-left'] = '30px'
      all.appendChild(one)
    })
  }

  display(color) {
    this.nums.split('').forEach((num, index) => {
      new LEDChar('.innerFrame' + index).display(num, color)
    })
  }

  destroy () {
    const timer = document.querySelectorAll(this.container)
    Array.from(timer).forEach(t => t && t.remove())
  }
}

window.LED = LED

class LEDChar {
  constructor(container, width = 120, height = 230, innerWith = 100, innerHeight = 100) {
    this.width = width
    this.height = height
    this.innerWith = innerWith
    this.innerHeight = innerHeight
    this.horizonHeight = (height - 2 * innerHeight) / 3
    this.horizonWidth = width
    this.verticalHeight = innerHeight
    this.verticalWidth = (width - innerWith) / 2
    this.container = container

    this.setDefaultHtml(container)
    this.setDefaultClass()
  }

  display(num, color = '#2ded0a') {
    let numIn = String(num).substr(0, 1)
    let frames = CODE_MAP[numIn]
    if (!frames) {
      frames = CODE_MAP['F']
      color = 'red'
    }
    frames.forEach(frame => {
      const style = styleChangeFns[frame]
      if (frame === 'MID') {
        const c = document.querySelector(this.container + ' .midUp')
        c.style['border-bottom-color'] = color
        const c2 = document.querySelector(this.container + ' .midDown')
        c2.style['border-top-color'] = color
      } else {
        const c = document.querySelector(this.container + ' .' + frame)
        c.style[style] = color
      }
    })
  }

  setDefaultHtml(container) {
    document.querySelector(container).innerHTML = ledCharHtml()
  }

  getLedStyle() {
    return {
      ...ledCharStyleTemplate,
      width: this.width,
      height: this.height,
      innerWith: this.innerWith,
      innerHeight: this.innerHeight,
      horizonHeight: this.horizonHeight,
      horizonWidth: this.horizonWidth,
      verticalHeight: this.verticalHeight,
      verticalWidth: this.verticalWidth,
    }
  }

  setDefaultClass() {
    let styleTag = document.querySelector('.ledStyle')
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.setAttribute('class', 'ledStyle')
    }
    let styleTagHtml = styleTag.innerHTML
    const ledCharStyle = this.getLedStyle()
    Object.keys(ledCharStyleTemplate).filter(key => key.startsWith('_')).forEach(key => {
      const styleFn = ledCharStyle[key]()
      const styleStr =
        `.${key.replace("_", '')} \{
          ${styleFn}
        \}`
      styleTagHtml = styleTagHtml.replace(styleStr, '')
      styleTagHtml = styleTagHtml +
        `
        
        ${styleStr}`
    })
    styleTag.innerHTML = styleTagHtml
    document.querySelector('body').appendChild(styleTag)
  }
}

const CODE_MAP = {
  0: ['TOP', 'TOP_LEFT', 'BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT', 'TOP_RIGHT'],
  1: ['BOTTOM_RIGHT', 'TOP_RIGHT'],
  2: ['TOP', 'TOP_RIGHT', 'MID', 'BOTTOM_LEFT', 'BOTTOM'],
  3: ['TOP', 'TOP_RIGHT', 'MID', 'BOTTOM_RIGHT', 'BOTTOM'],
  4: ['TOP_LEFT', 'TOP_RIGHT', 'MID', 'BOTTOM_RIGHT',],
  5: ['TOP', 'TOP_LEFT', 'MID', 'BOTTOM_RIGHT', 'BOTTOM'],
  6: ['TOP', 'TOP_LEFT', 'MID', 'BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT'],
  7: ['TOP', 'TOP_RIGHT', 'BOTTOM_RIGHT'],
  8: ['TOP', 'TOP_RIGHT', 'TOP_LEFT', 'MID', 'BOTTOM_RIGHT', 'BOTTOM_LEFT', 'BOTTOM'],
  9: ['TOP', 'TOP_RIGHT', 'TOP_LEFT', 'MID', 'BOTTOM_RIGHT', 'BOTTOM'],
  F: ['TOP', 'TOP_LEFT', 'MID', 'BOTTOM_LEFT'],
  H: ['TOP_RIGHT', 'TOP_LEFT', 'MID', 'BOTTOM_RIGHT', 'BOTTOM_LEFT'],
  E: ['TOP', 'TOP_LEFT', 'MID', 'BOTTOM_LEFT', 'BOTTOM'],
  L: ['TOP_LEFT', 'BOTTOM_LEFT', 'BOTTOM'],
  O: ['TOP', 'TOP_LEFT', 'BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT', 'TOP_RIGHT']
}

const styleChangeFns = {
  TOP: 'border-top-color',
  MID: '',
  BOTTOM: 'border-bottom-color',
  TOP_LEFT: 'border-left-color',
  TOP_RIGHT: 'border-right-color',
  BOTTOM_LEFT: 'border-left-color',
  BOTTOM_RIGHT: 'border-right-color'
}

const ledCharHtml = () => {
  return `
    <div class="frame horizon t TOP"></div>
    <div style="display: flex">
        <div class="frame vertical up left TOP_LEFT" style="display: inline-block"></div>
        <div class="frame vertical up right TOP_RIGHT" style="display: inline-block"></div>
    </div>
    <div class="frame midUp horizon b MID"></div>
    <div class="frame midDown horizon t MID"></div>
    <div style="display: flex">
        <div class="frame vertical down left BOTTOM_LEFT" style="display: inline-block"></div>
        <div class="frame vertical down right BOTTOM_RIGHT" style="display: inline-block"></div>
    </div>
    <div class="frame horizon b BOTTOM" style=""></div>
  `
}

const ledCharStyleTemplate = {
  width: 120,
  height: 230,
  innerWith: 100,
  innerHeight: 100,
  horizonHeight: (this.height - 2 * this.innerHeight) / 3,
  horizonWidth: this.width,
  verticalHeight: this.innerHeight,
  verticalWidth: (this.width - this.innerWith) / 2,
  _frame: () => `background: white;`,
  _vertical: function () {
    return `width: ${this.verticalWidth}px; height: ${this.verticalHeight}px`
  },
  _horizon: function () {
    return `width: ${this.horizonWidth}px; height: ${this.horizonHeight}px`
  },
  _b: function (color = '#f1eaea') {
    return `
        height: 0;
        border-bottom: ${this.horizonHeight}px solid ${color};
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-radius: 20px;`
  },
  _t: function (color = '#f1eaea') {
    return `
        height: 0;
        border-top: ${this.horizonHeight}px solid ${color};
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-radius: 20px;`
  },
  _left: function (color = '#f1eaea') {
    return `
        width: 0;
        border-left: ${this.verticalWidth}px solid ${color};
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-radius: 20px;`
  },
  _right: function (color = '#f1eaea') {
    return `
        margin-left: ${this.width}px;
        width: 0;
        border-right: ${this.verticalWidth}px solid ${color};
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-radius: 20px;`
  },
  _midUp: function (color = '#f1eaea') {
    return `
        border-radius: 0; 
        border-bottom: ${this.horizonHeight / 2}px solid ${color};`
  },
  _midDown: function (color = '#f1eaea') {
    return `
        border-radius: 0; 
        border-top: ${this.horizonHeight / 2}px solid ${color};`
  }
}