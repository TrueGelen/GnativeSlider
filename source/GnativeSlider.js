class GnativeSlider {
	constructor(obj) {
		this.items = document.querySelectorAll(obj.slides)
		this.btnNext = document.querySelector(obj.btnNext)
		this.btnPrev = document.querySelector(obj.btnPrev)
		this.showClass = obj.showClass || 'showed'
		this.i = []
		this.itemsAtScreen = obj.itemsAtScreen

		this.nav
		this.dots

		this.dotsContainer = document.querySelector(obj.dotsContainer)
		this.exampleOfDot = document.querySelector(obj.exampleOfDot)
		this.showDotsClass = obj.showDotsClass || undefined

		this.getIAndCreateDots()
	}

	debug() {
		console.log('debug this.items:===================\n', this.items)
		console.log('debug this.btnNext:===================\n', this.btnNext)
		console.log('debug this.btnPrev:===================\n', this.btnPrev)
		console.log('debug this.showClass:===================\n', this.showClass)
		console.log('debug this.i:===================\n', this.i)
		console.log('debug this.dotsContainer:===================\n', this.dotsContainer)
		console.log('debug this.exampleOfDot:===================\n', this.exampleOfDot)
		console.log('debug this.showDotsClass:===================\n', this.showDotsClass)
	}

	hasDots() {
		if (this.dotsContainer === 'undefined') {
			console.error('dotsContainer is undefined')
			return false
		}
		if (this.exampleOfDot !== 'undefined') {
			console.error('exampleOfDot is undefined')
			return false
		}
		if (this.showDotsClass !== 'undefined') {
			console.error('showDotsClass is undefined')
			return false
		}
		else
			return true
	}

	getIAndCreateDots() {
		this.items.forEach((item, ind) => {
			if (item.classList.contains(this.showClass)) {
				this.i.push(ind)
				if (this.hasDots) {
					this.createDots(true)
				}
			} else {
				this.i = 0
				this.createDots(false)
			}
		})
		this.dotsContainer.removeChild(this.exampleOfDot)
	}

	createDots(bool) {
		let clone
		if (bool) {
			clone = this.exampleOfDot.cloneNode(true)
			clone.classList.add(this.showDotsClass)
		}
		else {
			clone = this.exampleOfDot.cloneNode(true)
		}
		this.dotsContainer.appendChild(clone)
	}

	toggle(toggle) {
		this.items[this.i].classList.remove(this.showClass)
		console.log(this.dotsContainer.childNodes)
		if (toggle) {
			this.i++
			if (this.i > this.items.length - 1)
				this.i = 0
		} else {
			this.i--
			if (this.i < 0)
				this.i = this.items.length - 1
		}
		this.items[this.i].classList.add(this.showClass)
	}



	run() {
		console.log('ran in working')
		this.btnNext.addEventListener('click', () => {
			console.log('событие некст работает')
			this.toggle(true)
		})
		this.btnPrev.addEventListener('click', () => {
			console.log('событие бэк работает')
			this.toggle(false)
		})
	}
}