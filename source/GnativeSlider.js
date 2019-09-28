class GnativeSlider {
	constructor(settings) {
		this.defaultSettings = {
			displayToShow: 'inline-block', //inline-block or flex
			loop: true,
			itemsContainer: undefined,
			margin: '0',
			nav: true,
			btnNext: undefined,
			btnPrev: undefined,
			dots: true,
			dotsContainer: undefined,
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
		this.widthItem = '0'
		this.itemsCount = this.finalSettings.itemsCount
		this.activeItemIndex = 0

		this.isNav = this.finalSettings.nav
		this.btnNext = document.querySelector(this.finalSettings.btnNext)
		this.btnPrev = document.querySelector(this.finalSettings.btnPrev)
		this.displayOfButtons = this.getDisplayOfElement(this.btnNext)

		this.arrActiveDots = [0]
		this.dotsContainer = document.querySelector(this.finalSettings.dotsContainer)
		this.exampleOfDot = document.querySelector(this.finalSettings.exampleOfDot)
		this.isDots = this.finalSettings.dots

		console.log(this.displayOfButtons)

		//for function addAnimation(keyframes)
		//this.dynamicAnimationStyles = undefined

		this.createSlider()
		this.run()
	}

	getDisplayOfElement(element) {
		if (element.style.display === '') {
			return element.currentStyle ? element.currentStyle.display : getComputedStyle(element, null).display
		}
		else
			return element.style.display
	}

	preparingItemsContainer() {
		for (let i = 0; i < this.itemsContainer.childNodes.length; i++) {
			if (this.itemsContainer.childNodes[i].nodeName === "#text")
				this.itemsContainer.childNodes[i].remove()
		}
		this.itemsContainer.style.margin = `0px -${this.finalSettings.margin} 0px -${this.finalSettings.margin}`
		this.itemsContainer.style.overflow = 'hidden'
	}

	preparingItems() {
		let itemsWidth = 100 / this.itemsCount
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].style.width = `calc(${itemsWidth}% - ${this.finalSettings.margin} - ${this.finalSettings.margin})`
			this.items[i].style.margin = `0px ${this.finalSettings.margin}`
		}
	}

	debug() {
		console.log('debug this.items:===================\n', this.items)
		console.log('debug this.btnNext:===================\n', this.btnNext)
		console.log('debug this.btnPrev:===================\n', this.btnPrev)
		//console.log('debug this.finalSettings.showClass:===================\n', this.finalSettings.showClass)
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

		if (this.isNode(this.btnNext) && this.isNode(this.btnPrev)) {
			if (!this.isNav) {
				this.btnNext.style.display = 'none'
				this.btnPrev.style.display = 'none'
			}
			else {
				this.btnNext.style.display = this.displayOfButtons
				this.btnPrev.style.display = this.displayOfButtons
			}
		}
		else
			return false
	}

	//for getting this.itemsCount
	setItemsCount(isResponsive = false, widthOfScreen = undefined) {
		if (isResponsive) {
			if (typeof (this.finalSettings.itemsAtScreen[widthOfScreen].itemsCount) !== "number")
				return false
			this.itemsCount = this.finalSettings.itemsAtScreen[widthOfScreen].itemsCount
		} else {
			this.itemsCount = this.finalSettings.itemsCount
		}
	}

	//an experiment with animation slide by adding styles in the head
	/* addAnimation(keyframes) {
		if (this.dynamicAnimationStyles === undefined) {

			this.dynamicAnimationStyles = document.createElement('style');
			this.dynamicAnimationStyles.type = 'text/css';
			console.log("addAnimation", this.dynamicAnimationStyles)
			document.head.appendChild(this.dynamicAnimationStyles);
		}
		this.dynamicAnimationStyles.sheet.insertRule(keyframes, this.dynamicAnimationStyles.length);
	} */

	//on button, swipe but not dots
	itemsBehavior(directionToggle) {
		return new Promise((resolve) => {
			let step = 0
			let startAnimate
			let callbackForForwardAnim = () => {
				this.items[this.itemsCount].style.animationName = 'none'
				this.items[this.itemsCount].style.margin = `0px ${this.finalSettings.margin}`
				this.items[0].style.animationName = 'none'
				this.items[0].style.display = 'none'
				this.items[0].style.margin = `0px ${this.finalSettings.margin}`
				this.itemsContainer.append(this.items[0])
				step = 0
				this.btnNext.addEventListener('click', this.btnNextClick)
			}

			let callbackForBackwardAnim = () => {
				this.items[0].style.animationName = 'none'
				this.items[0].style.margin = `0px ${this.finalSettings.margin}`
				this.items[this.itemsCount].style.animationName = 'none'
				this.items[this.itemsCount].style.display = 'none'
				this.items[this.itemsCount].style.margin = `0px ${this.finalSettings.margin}`
				this.itemsContainer.style.textAlign = 'left'
				step = 0
				this.btnPrev.addEventListener('click', this.btnPrevClick)
			}
			let forwardAnim = () => {
				step += 10
				this.items[0].style.marginLeft = "-" + step + "px"
				if (parseInt(this.items[0].style.marginLeft) * -1 > Number(this.widthItem)) {
					clearInterval(startAnimate)
					callbackForForwardAnim()
					resolve()
				}
			}

			let backwardAnim = () => {
				step += 10
				this.items[this.itemsCount].style.marginRight = "-" + step + "px"
				if (parseInt(this.items[this.itemsCount].style.marginRight) * -1 > Number(this.widthItem)) {
					clearInterval(startAnimate)
					callbackForBackwardAnim()
					resolve()
				}
			}

			if (directionToggle) {
				this.btnNext.removeEventListener('click', this.btnNextClick)
				this.items[this.itemsCount].style.display = this.finalSettings.displayToShow
				this.items[this.itemsCount].style.marginRight = `-${Number(this.widthItem)}px`
				startAnimate = setInterval(forwardAnim, 5)
			}
			else {
				this.btnPrev.removeEventListener('click', this.btnPrevClick)
				this.items[this.items.length - 1].style.marginLeft = `-${Number(this.widthItem)}px`
				this.items[this.items.length - 1].style.display = this.finalSettings.displayToShow
				this.itemsContainer.prepend(this.items[this.items.length - 1])
				this.itemsContainer.style.textAlign = 'right'
				startAnimate = setInterval(backwardAnim, 5)
			}
		})

	}

	setWidthItem() {
		this.widthItem = (this.items[0].getBoundingClientRect().width + parseInt(this.items[0].style.marginLeft)).toString()
	}

	createItems() {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].style.display = 'none'
		}

		for (let i = 0; i < this.itemsCount; i++) {
			this.items[i].style.display = this.finalSettings.displayToShow
		}
	}

	/*//this.itemsContainer.append(this.items[removeItemInd])
		 this.addAnimation(`
			@keyframes forAddedItems {
				0% {
					margin-right: -${this.WidthItem}px;
				}
				100% {
					margin-right: 0px;
				}
			}`)
		this.addAnimation(`
			@keyframes forRemovedItems {
				100% {
					margin-left: -${this.WidthItem}px;					
				}
			}`)
		//margin-left: -${this.WidthItem}px;
		this.items[addItemInd].style.animation = 'forAddedItems 2s linear'
		this.items[removeItemInd].style.animation = 'forRemovedItems 2s linear'
		this.items[removeItemInd].addEventListener('animationend', callbackForAnimation) */

	//todo may to do the function of check for a correct options
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
		this.arrActiveDots = [0]
		let total = 0
		for (let i = 0; i < this.items.length; i += this.itemsCount) {
			total += this.itemsCount
			if (total <= this.items.length - 1)
				this.arrActiveDots.push(total)
		}

		if (this.arrActiveDots[this.arrActiveDots.length - 1] !== this.items.length - this.itemsCount) {
			this.arrActiveDots[this.arrActiveDots.length - 1] = this.items.length - this.itemsCount
		}
		//console.log("setArrActiveDots", this.arrActiveDots)
	}

	dotsBehavior() {
		//&& !this.dotsContainer.childNodes[i].classList.contains(this.finalSettings.showDotsClass)
		if (this.arrActiveDots.length === 1) {
			this.dotsContainer.childNodes[this.activeItemIndex].classList.remove(this.finalSettings.showDotsClass)
			this.dotsContainer.childNodes[this.activeItemIndex + 1].classList.add(this.finalSettings.showDotsClass)
		}
		else {
			for (let i = 0; i < this.arrActiveDots.length; i++) {
				//console.log("dotsBehavior for", this.activeItemIndex, this.arrActiveDots)
				if (this.activeItemIndex === this.arrActiveDots[i]) {
					let currentActiveDot = this.dotsContainer.querySelector("." + this.finalSettings.showDotsClass)
					let activeIndex = this.arrActiveDots.indexOf(this.arrActiveDots[i])
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

		for (let i = 0; i < this.arrActiveDots.length; i++) {
			if (this.activeItemIndex < this.arrActiveDots[i]) {
				this.dotsContainer.children[i - 1].classList.add(this.finalSettings.showDotsClass)
				return false
			} else if (this.activeItemIndex == this.arrActiveDots[i]) {
				this.dotsContainer.children[i].classList.add(this.finalSettings.showDotsClass)
				return false
			}
			else if (this.activeIndex == 0 || this.activeIndex > this.arrActiveDots.length - 1) {
				this.dotsContainer.firstChild.classList.add(this.finalSettings.showDotsClass)
				return false
			}
		}
	}

	dotClick = async (ind, e) => {
		//this.dotsContainer.querySelector("." + this.finalSettings.showDotsClass).classList.remove(this.finalSettings.showDotsClass)
		//e.target.classList.add(this.finalSettings.showDotsClass)

		let countStepTo = this.activeItemIndex - this.arrActiveDots[ind]

		if (countStepTo < 0) {
			for (let i = 0; i < countStepTo * -1; i++)
				await this.slideWithoutLoop(true)
		}
		else {
			for (let i = 0; i < countStepTo; i++)
				await this.slideWithoutLoop(false)
		}
	}

	setEventListenerForDots() {
		for (let i = 0; i < this.dotsContainer.children.length; i++) {
			this.dotsContainer.children[i].addEventListener('click', this.dotClick.bind(this, i))
		}
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
		this.preparingItemsContainer()

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

		if (this.isDots) {
			this.createDots()
			this.setEventListenerForDots()
		}
		else
			this.removeDots()

		this.preparingItems()
		this.createItems()
		this.setWidthItem()
	}

	slideWithLoop(directionToggle) {
		//direction: next. 
		if (directionToggle) {
			this.itemsBehavior(directionToggle)
			//window.setTimeout(() => { console.log("setTimeout"); this.itemsBehavior(directionToggle) }, 2000)

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
			this.itemsBehavior(directionToggle)

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

	async slideWithoutLoop(directionToggle) {
		if (directionToggle) {
			if ((this.activeItemIndex + this.itemsCount) <= this.items.length - 1) {
				await this.itemsBehavior(directionToggle, 0, this.itemsCount)
				this.activeItemIndex++

				if (this.isDots)
					this.dotsBehavior()
			}
			else
				return false
		}
		else if ((this.activeItemIndex - 1) >= 0) {
			await this.itemsBehavior(directionToggle, this.itemsCount - 1, this.items.length - 1)
			this.activeItemIndex--
			if (this.isDots)
				this.dotsBehavior()
		}
		else
			return false
	}

	btnNextClick = () => {
		if (this.finalSettings.loop)
			this.slideWithLoop(true)
		else
			this.slideWithoutLoop(true)
	}

	btnPrevClick = () => {
		if (this.finalSettings.loop)
			this.slideWithLoop(false)
		else
			this.slideWithoutLoop(false)
	}

	run() {
		if (this.finalSettings.responsive) {
			window.addEventListener('resize', () => {
				this.createSlider()
			})
		}

		if (this.isNav) {
			this.btnNext.addEventListener('click', this.btnNextClick)
			this.btnPrev.addEventListener('click', this.btnPrevClick)
		}
	}
}