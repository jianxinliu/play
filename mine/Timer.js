function getTimer(container) {
    return new Timer(container);
}

class Timer {
    constructor(container) {
        this.end()
        this.destroyIf()
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

    destroyIf() {
        const timer = document.querySelector('.timer')
        timer && timer.remove()
    }
}

class LEDTimer {
    constructor(container) {
        this.container = container
        this.end()
        this.destroyIf()
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
            this.destroyIf()
            this.drawTimer(this.container)
            this.timer = new window.LED('.timer', this.cost)
            this.timer.display()
        }, 1000)
    }

    end() {
        clearInterval(this.timerInterval)
    }

    destroyIf() {
        this.timer && this.timer.destroy()
    }
}
