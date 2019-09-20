class GnativeSlider {
	constructor(settings) {
		this.defaultSettings = {
			loop: true,
			items: undefined,
			nav: true,
			navContainer: undefined,
			btnNext: undefined,
			btnPrev: undefined,
			showClass: undefined,
			dots: true,
			dotsContainer: 'undefined',
			exampleOfDot: undefined,
			showDotsClass: undefined,
			items: 1,
			responsive: false,
			itemsAtScreen: {}
		}

		this.finalSettings = this.mergeSettings(this.defaultSettings, settings)

		this.items = document.querySelectorAll(this.finalSettings.items)
		this.btnNext = document.querySelector(this.finalSettings.btnNext)
		this.btnPrev = document.querySelector(this.finalSettings.btnPrev)
		this.i = []

		this.dotsContainer = document.querySelector(this.finalSettings.dotsContainer)
		this.exampleOfDot = document.querySelector(this.finalSettings.exampleOfDot)

		this.getIAndCreateDots()

		this.run()
	}

	debug() {
		console.log('debug this.items:===================\n', this.items)
		console.log('debug this.btnNext:===================\n', this.btnNext)
		console.log('debug this.btnPrev:===================\n', this.btnPrev)
		console.log('debug this.finalSettings.showClass:===================\n', this.finalSettings.showClass)
		console.log('debug this.i:===================\n', this.i)
		console.log('debug this.dotsContainer:===================\n', this.dotsContainer)
		console.log('debug this.exampleOfDot:===================\n', this.exampleOfDot)
		console.log('debug this.finalSettings.showDotsClass:===================\n', this.finalSettings.showDotsClass)
		console.log('debug this.finalSettings:===================\n', this.finalSettings)
	}

	mergeSettings(defaultSettings, settings) {
		return Object.assign(defaultSettings, settings)
	}

	hasDots() {
		if (this.finalSettings.dots) {
			if (this.dotsContainer === null) {
				throw new Error("dotsContainer is null. If you want to have container of" +
					" dots you must pass the option {dotsContainer: 'path in DOM'}")
			}
			if (this.exampleOfDot === null) {
				throw new Error("exampleOfDot is null. If you want to have dots in" +
					" this slider you must pass the option {exampleOfDot: 'path in DOM'}." +
					" Also you must made one dot as an example in .html and give to it styles in .css")
			}
			if (this.finalSettings.showDotsClass === null) {
				throw new Error("showDotsClass is null. If you want to have active dots in" +
					" this slider you must pass the option {showDotsClass: 'yourClass'}")
			}
			return true
		}
		return false
	}

	getIAndCreateDots() {
		this.hasDots()
		while (this.dotsContainer.firstChild) {
			this.dotsContainer.firstChild.remove();
		}

		this.items.forEach((item, ind) => {
			if (item.classList.contains(this.finalSettings.showClass)) {
				this.i.push(ind)
				if (this.hasDots()) {
					this.createDots(true)
				}
			} else {
				this.i = 0
				if (this.hasDots()) {
					this.createDots(false)
				}
			}
		})
	}

	createDots(bool) {
		let clone
		if (bool) {
			clone = this.exampleOfDot.cloneNode(true)
			clone.classList.add(this.finalSettings.showDotsClass)
		}
		else {
			clone = this.exampleOfDot.cloneNode(true)
		}
		this.dotsContainer.appendChild(clone)
	}

	oneSlideToggleItems(toggle, ind) {
		console.log('testSlide oneSlideToggleItems', toggle, ind)
		this.items[ind].classList.remove(this.finalSettings.showClass)
		if (toggle) {
			ind++
			if (ind > this.items.length - 1)
				ind = 0
		} else {
			ind--
			if (ind < 0)
				ind = this.items.length - 1
		}
		this.items[ind].classList.add(this.finalSettings.showClass)
	}

	oneSlideToggleDots(toggle, ind) {
		console.log('testSlide oneSlideToggleDots', toggle, ind)
		this.dotsContainer.childNodes[ind].classList.remove(this.finalSettings.showDotsClass)
		if (toggle) {
			ind++
			if (ind > this.items.length - 1)
				ind = 0
		} else {
			ind--
			if (ind < 0)
				ind = this.items.length - 1
		}
		this.dotsContainer.childNodes[ind].classList.add(this.finalSettings.showDotsClass)
	}

	slideWithLoop(toggle) {
		console.log('testSlide slideWithLoop', toggle)
		if (toggle) {
			this.oneSlideToggleItems(true, this.i)

			if (this.finalSettings.dots)
				this.oneSlideToggleDots(true, this.i)

			if ((this.i + 1) < this.items.length)
				this.i++
			else
				this.i = 0
		} else {
			this.oneSlideToggleItems(false, this.i)

			if (this.finalSettings.dots)
				this.oneSlideToggleDots(false, this.i)

			if ((this.i - 1) > -1)
				this.i--
			else
				this.i = this.items.length - 1
		}
	}

	slideWithoutLoop(toggle) {
		console.log('testSlide slideWithoutLoop', toggle)
		if (toggle) {
			if ((this.i + 1) < this.items.length) {
				this.oneSlideToggleItems(true, this.i)
				if (this.finalSettings.dots)
					this.oneSlideToggleDots(true, this.i)
				this.i++
			}
			else
				return false
		}
		else if ((this.i - 1) >= 0) {
			this.oneSlideToggleItems(false, this.i)
			if (this.finalSettings.dots)
				this.oneSlideToggleDots(false, this.i)
			this.i--
		}
		else
			return false
	}

	run() {
		this.btnNext.addEventListener('click', () => {
			if (this.finalSettings.loop)
				this.slideWithLoop(true)
			else
				this.slideWithoutLoop(true)

		})
		this.btnPrev.addEventListener('click', () => {
			if (this.finalSettings.loop)
				this.slideWithLoop(false)
			else
				this.slideWithoutLoop(false)
		})
	}
}