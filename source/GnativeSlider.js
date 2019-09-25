class GnativeSlider {
	constructor(settings) {
		this.defaultSettings = {
			displayToShow: 'block',
			loop: true,
			itemsContainer: undefined,
			nav: true,
			btnNext: undefined,
			btnPrev: undefined,
			showClass: undefined,
			dots: true,
			dotsContainer: 'undefined',
			exampleOfDot: undefined,
			showDotsClass: undefined,
			itemsCount: 1,
			responsive: false,
			itemsAtScreen: {}
		}

		this.finalSettings = this.mergeSettings(this.defaultSettings, settings)
		this.responsiveMap = this.getResponsiveMap()

		this.itemsContainer = document.querySelector(this.finalSettings.itemsContainer)
		this.items = document.querySelector(this.finalSettings.itemsContainer).children
		this.itemsCount = this.finalSettings.itemsCount
		this.activeItemIndex = 0

		this.isNav = this.finalSettings.nav
		this.btnNext = document.querySelector(this.finalSettings.btnNext)
		this.btnPrev = document.querySelector(this.finalSettings.btnPrev)

		this.ArrActiveDots = [0]
		this.dotsContainer = document.querySelector(this.finalSettings.dotsContainer)
		this.exampleOfDot = document.querySelector(this.finalSettings.exampleOfDot)
		this.isDots = this.finalSettings.dots

		this.createSlider()
		this.run()
	}

	debug() {
		console.log('debug this.items:===================\n', this.items)
		console.log('debug this.btnNext:===================\n', this.btnNext)
		console.log('debug this.btnPrev:===================\n', this.btnPrev)
		console.log('debug this.finalSettings.showClass:===================\n', this.finalSettings.showClass)
		console.log('debug this.dotsContainer:===================\n', this.dotsContainer)
		console.log('debug this.exampleOfDot:===================\n', this.exampleOfDot)
		console.log('debug this.finalSettings.showDotsClass:===================\n', this.finalSettings.showDotsClass)
		console.log('debug this.finalSettings:===================\n', this.finalSettings)
		console.log('debug this.responsiveMap:===================\n', this.responsiveMap)
	}

	isNode(node) {
		return node && (node.nodeType === 1 || node.nodeType == 11)
	}

	mergeSettings(defaultSettings, settings) {
		return Object.assign(defaultSettings, settings)
	}

	isResponsive() {
		if (this.finalSettings.responsive) {
			for (let key in this.finalSettings.itemsAtScreen) {
				if (key > window.innerWidth)
					return true
			}
			return false
		} else
			return false
	}

	setIsNav(widthOfScreen = undefined) {
		if (widthOfScreen !== undefined) {
			if (this.finalSettings.itemsAtScreen[widthOfScreen].nav !== undefined)
				this.isNav = this.finalSettings.itemsAtScreen[widthOfScreen].nav
		} else {
			this.isNav = this.finalSettings.nav
		}
	}

	//for getting this.itemsCount and this.activeItemIndex
	//todo may change the getting this.activeItemIndex for resize
	setItemsCount(isResponsive = false, widthOfScreen = undefined) {
		if (isResponsive) {
			if (typeof (this.finalSettings.itemsAtScreen[widthOfScreen].itemsCount) !== "number")
				return false
			this.itemsCount = this.finalSettings.itemsAtScreen[widthOfScreen].itemsCount
			this.activeItemIndex = 0
		} else {
			this.itemsCount = this.finalSettings.itemsCount
			this.activeItemIndex = 0
		}
	}

	//on button, swipe but not dots
	itemsBehavior(directionToggle, removeItemInd, addItemInd) {
		this.items[removeItemInd].classList.remove(this.finalSettings.showClass)
		this.items[addItemInd].classList.add(this.finalSettings.showClass)

		if (directionToggle)
			this.itemsContainer.append(this.items[removeItemInd])
		else
			this.itemsContainer.prepend(this.items[addItemInd])
	}

	createItems() {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].classList.remove(this.finalSettings.showClass)
		}
		/* this.items.forEach(item => {
			item.classList.remove(this.finalSettings.showClass)
		}) */

		for (let i = 0; i < this.itemsCount; i++) {
			this.items[i].classList.add(this.finalSettings.showClass)
		}
	}

	//todo may to do the function of check for a correct data
	/*isDots(widthOfScreen = undefined) {

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
	}*/

	setIsDots(widthOfScreen = undefined) {
		if (widthOfScreen !== undefined) {
			if (this.finalSettings.itemsAtScreen[widthOfScreen].dots !== undefined)
				this.isDots = this.finalSettings.itemsAtScreen[widthOfScreen].dots
		} else {
			this.isDots = this.finalSettings.dots
		}
	}

	setArrActiveDots() {
		this.ArrActiveDots = [0]
		let total = 0
		for (let i = 0; i < this.items.length; i += this.itemsCount) {
			total += this.itemsCount
			if (total <= this.items.length - 1)
				this.ArrActiveDots.push(total)
		}

		if (this.ArrActiveDots[this.ArrActiveDots.length - 1] !== this.items.length - this.itemsCount) {
			this.ArrActiveDots[this.ArrActiveDots.length - 1] = this.items.length - this.itemsCount
		}
		//console.log("setArrActiveDots", this.ArrActiveDots)
	}

	dotsBehavior() {
		//&& !this.dotsContainer.childNodes[i].classList.contains(this.finalSettings.showDotsClass)
		if (this.ArrActiveDots.length === 1) {
			this.dotsContainer.childNodes[this.activeItemIndex].classList.remove(this.finalSettings.showDotsClass)
			this.dotsContainer.childNodes[this.activeItemIndex + 1].classList.add(this.finalSettings.showDotsClass)
		}
		else {
			for (let i = 0; i < this.ArrActiveDots.length; i++) {
				console.log("dotsBehavior for", this.activeItemIndex, this.ArrActiveDots)
				if (this.activeItemIndex === this.ArrActiveDots[i]) {
					let currentActiveDot = this.dotsContainer.querySelector("." + this.finalSettings.showDotsClass)
					let activeIndex = this.ArrActiveDots.indexOf(this.ArrActiveDots[i])
					currentActiveDot.classList.remove(this.finalSettings.showDotsClass)
					this.dotsContainer.childNodes[activeIndex].classList.add(this.finalSettings.showDotsClass)
					return false
				}
			}
		}
	}

	removeDots() {
		if (this.isNode(this.dotsContainer)) {
			while (this.dotsContainer.firstChild) {
				this.dotsContainer.firstChild.remove();
			}
		}
	}

	createDots() {
		this.removeDots()

		let dotsCount
		if (typeof (this.itemsCount) !== "number")
			return false
		else
			dotsCount = Math.ceil(this.items.length / this.itemsCount)

		for (let i = 0; i < dotsCount; i++)
			this.dotsContainer.append(this.exampleOfDot.cloneNode(true))

		//todo get active dot from arrActiveDots
		this.dotsContainer.firstChild.classList.add(this.finalSettings.showDotsClass)
	}

	//for getBreakPoint()
	getResponsiveMap() {
		return Object.keys(this.finalSettings.itemsAtScreen)
	}

	//for getting the actual width
	getBreakPoint() {
		for (let i = 0; i < this.responsiveMap.length; i++) {
			if (Number(this.responsiveMap[i]) > window.innerWidth) {
				return this.responsiveMap[i]
			}
		}
	}

	createSlider() {
		if (this.isResponsive()) {
			let breakPoint = this.getBreakPoint()
			this.setItemsCount(true, breakPoint)
			this.setIsDots(breakPoint)
			this.setArrActiveDots()
			this.setIsNav(breakPoint)
		}
		else {
			this.setItemsCount(false)
			this.setArrActiveDots()
			this.setIsDots()
			this.setIsNav()
		}

		if (this.isDots)
			this.createDots()
		else
			this.removeDots()

		this.createItems()
	}

	slideWithLoop(directionToggle) {
		//direction: next. 
		if (directionToggle) {
			this.itemsBehavior(directionToggle, 0, this.itemsCount)

			//dots behavior-------------------------------------------------
			if ((this.activeItemIndex + 1) < this.items.length) {
				this.activeItemIndex++
				if (this.isDots)
					this.dotsBehavior()
			}
			else {
				this.activeItemIndex = 0
				if (this.isDots)
					this.dotsBehavior()
			}
		}
		//direction: prev
		else {
			this.itemsBehavior(directionToggle, this.itemsCount - 1, this.items.length - 1)

			//dots behavior-------------------------------------------------
			if ((this.activeItemIndex - 1) > -1) {
				this.activeItemIndex--
				if (this.isDots)
					this.dotsBehavior()
			}
			else {
				this.activeItemIndex = this.items.length - 1
				if (this.isDots)
					this.dotsBehavior()
			}
		}
	}

	slideWithoutLoop(directionToggle) {
		if (directionToggle) {
			if ((this.activeItemIndex + this.itemsCount) <= this.items.length - 1) {
				this.itemsBehavior(directionToggle, 0, this.itemsCount)
				this.activeItemIndex++
				if (this.isDots)
					this.dotsBehavior()
			}
			else
				return false
		}
		else if ((this.activeItemIndex - 1) >= 0) {
			this.itemsBehavior(directionToggle, this.itemsCount - 1, this.items.length - 1)
			this.activeItemIndex--
			if (this.isDots)
				this.dotsBehavior()
		}
		else
			return false
	}

	run() {
		if (this.finalSettings.responsive) {
			window.addEventListener('resize', () => {
				this.createSlider()
			})
		}

		if (this.isNav) {
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
}