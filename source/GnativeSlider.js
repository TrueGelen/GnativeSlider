class GnativeSlider {
	constructor(settings) {
		this.defaultSettings = {
			displayToShow: 'inline-block',
			loop: true,
			itemsContainer: undefined,
			animationTime: 200,
			margin: '0',
			nav: true,
			btnNext: undefined,
			btnPrev: undefined,
			dots: true,
			dotsContainer: undefined,
			exampleOfDot: undefined,
			activeDotClass: undefined,
			itemsCount: 1,
			responsive: false,
			itemsAtScreen: {}
		}

		this.finalSettings = this.mergeSettings(this.defaultSettings, settings)

		//for the function getBreakPoint()
		this.responsiveMap = this.getResponsiveMap()

		this.itemsContainer = document.querySelector(this.finalSettings.itemsContainer)
		this.items = document.querySelector(this.finalSettings.itemsContainer).children
		//to get the step of animation and to work the animation in the itemsBehavior()
		this.widthItem = '0'
		this.itemsCount = this.finalSettings.itemsCount
		this.activeItemIndex = 0

		this.isNav = this.finalSettings.nav
		this.btnNext = document.querySelector(this.finalSettings.btnNext)
		this.btnPrev = document.querySelector(this.finalSettings.btnPrev)
		//to show buttons
		this.displayOfButtons = this.getDisplayOfElement(this.btnNext)

		//the map of references for active dots and items of slide
		this.arrActiveDots = [0]
		this.dotsContainer = document.querySelector(this.finalSettings.dotsContainer)
		//the made example of a dot for the slider
		this.exampleOfDot = document.querySelector(this.finalSettings.exampleOfDot)
		this.isDots = this.finalSettings.dots

		//for swipe functions: getFirstTouch(), getTouchEnd(); and listeners in setListeners()
		this.firstTouchX = 0
		this.firstTouchY = 0

		//for the stack of calls
		this.stackNext = 0
		this.stackPrev = 0

		//for the setStepOfAnimation()
		this.stepOfAnimation

		this.createSlider()
		this.setEventListeners()

		return this
	}

	validationOfTheInputObject() {

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

	//setting width of item without margin
	preparingItems() {
		let itemsWidth = 100 / this.itemsCount
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].style.width = `calc(${itemsWidth}% - ${this.finalSettings.margin} - ${this.finalSettings.margin})`
			this.items[i].style.margin = `0px ${this.finalSettings.margin}`
		}
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

	setStepOfAnimation() {
		this.stepOfAnimation = this.widthItem / (this.finalSettings.animationTime / 5)
	}

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
			}

			let callbackForBackwardAnim = () => {
				this.items[0].style.animationName = 'none'
				this.items[0].style.margin = `0px ${this.finalSettings.margin}`
				this.items[this.itemsCount].style.animationName = 'none'
				this.items[this.itemsCount].style.display = 'none'
				this.items[this.itemsCount].style.margin = `0px ${this.finalSettings.margin}`
				this.itemsContainer.style.textAlign = 'left'
				step = 0
			}

			let forwardAnim = () => {
				step += this.stepOfAnimation
				this.items[0].style.marginLeft = "-" + step + "px"
				if (parseInt(this.items[0].style.marginLeft) * -1 > Number(this.widthItem)) {
					clearInterval(startAnimate)
					callbackForForwardAnim()
					resolve()
				}
			}

			let backwardAnim = () => {
				step += this.stepOfAnimation
				this.items[this.itemsCount].style.marginRight = "-" + step + "px"
				if (parseInt(this.items[this.itemsCount].style.marginRight) * -1 > Number(this.widthItem)) {
					clearInterval(startAnimate)
					callbackForBackwardAnim()
					resolve()
				}
			}

			if (directionToggle) {
				this.items[this.itemsCount].style.display = this.finalSettings.displayToShow
				this.items[this.itemsCount].style.marginRight = `-${Number(this.widthItem)}px`
				startAnimate = setInterval(forwardAnim, 5)
			}
			else {
				this.items[this.items.length - 1].style.marginLeft = `-${Number(this.widthItem)}px`
				this.items[this.items.length - 1].style.display = this.finalSettings.displayToShow
				this.itemsContainer.prepend(this.items[this.items.length - 1])
				this.itemsContainer.style.textAlign = 'right'
				startAnimate = setInterval(backwardAnim, 5)
			}
		})

	}

	//setting this.widthItem for this.itemsBehavior(directionToggle)
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
	}

	dotsBehavior() {
		if (this.arrActiveDots.length === 1) {
			this.dotsContainer.childNodes[this.activeItemIndex].classList.remove(this.finalSettings.activeDotClass)
			this.dotsContainer.childNodes[this.activeItemIndex + 1].classList.add(this.finalSettings.activeDotClass)
		}
		else {
			for (let i = 0; i < this.arrActiveDots.length; i++) {
				if (this.activeItemIndex === this.arrActiveDots[i]) {
					let currentActiveDot = this.dotsContainer.querySelector("." + this.finalSettings.activeDotClass)
					let activeIndex = this.arrActiveDots.indexOf(this.arrActiveDots[i])
					currentActiveDot.classList.remove(this.finalSettings.activeDotClass)
					this.dotsContainer.childNodes[activeIndex].classList.add(this.finalSettings.activeDotClass)
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
				this.dotsContainer.children[i - 1].classList.add(this.finalSettings.activeDotClass)
				return false
			} else if (this.activeItemIndex == this.arrActiveDots[i]) {
				this.dotsContainer.children[i].classList.add(this.finalSettings.activeDotClass)
				return false
			}
			else if (this.activeIndex == 0 || this.activeIndex > this.arrActiveDots.length - 1) {
				this.dotsContainer.firstChild.classList.add(this.finalSettings.activeDotClass)
				return false
			}
		}
	}

	dotClick = async (ind) => {

		let countStepTo = this.activeItemIndex - this.arrActiveDots[ind]

		if (countStepTo < 0) {

			if (this.stackNext === 0 && this.stackPrev === 0) {
				this.stackNext = (countStepTo) * -1
				this.stackWatcher()
			}
			else if (this.stackNext !== 0)
				this.stackNext = (countStepTo) * -1
			else if (this.stackPrev !== 0)
				this.stackNext = (countStepTo - 1) * -1

			if (this.stackPrev !== 0)
				this.stackPrev = 1
		}
		else {

			if (this.stackPrev === 0 && this.stackNext === 0) {
				this.stackPrev = countStepTo
				this.stackWatcher()
			}
			else if (this.stackPrev !== 0)
				this.stackPrev = countStepTo
			else if (this.stackNext !== 0)
				this.stackPrev = countStepTo + 1

			if (this.stackNext !== 0)
				this.stackNext = 1
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
		this.setStepOfAnimation()
	}

	async slideWithLoop(directionToggle) {
		//direction: next. 
		if (directionToggle) {
			await this.itemsBehavior(directionToggle)

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
			await this.itemsBehavior(directionToggle)

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

	btnNextClick = async () => {
		if (this.finalSettings.loop)
			await this.slideWithLoop(true)
		else
			await this.slideWithoutLoop(true)
	}

	btnPrevClick = async () => {
		if (this.finalSettings.loop)
			await this.slideWithLoop(false)
		else
			await this.slideWithoutLoop(false)
	}

	getFirstTouch = (e) => {
		this.itemsContainer.addEventListener('touchend', this.getTouchEnd)
		this.firstTouchX = e.touches[0].clientX
		this.firstTouchY = e.touches[0].clientY
		this.itemsContainer.removeEventListener('touchstart', this.getFirstTouch)
	}

	getTouchEnd = async (e) => {
		this.itemsContainer.removeEventListener('touchend', this.getTouchEnd)
		let direction = (Math.abs(this.firstTouchX - e.changedTouches[0].clientX) > Math.abs(this.firstTouchY - e.changedTouches[0].clientY))

		if (direction)
			if (this.firstTouchX > e.changedTouches[0].clientX)
				await this.btnNextClick()
			else
				await this.btnPrevClick()

		this.itemsContainer.addEventListener('touchstart', this.getFirstTouch)
	}

	async stackWatcher() {
		if (this.stackNext > 0) {
			await this.btnNextClick()
			this.stackNext--
			this.stackWatcher()
		} else if (this.stackPrev > 0) {
			await this.btnPrevClick()
			this.stackPrev--
			this.stackWatcher()
		}
	}

	setEventListeners() {
		if (this.finalSettings.responsive) {
			window.addEventListener('resize', () => {
				this.createSlider()
			})
		}

		this.itemsContainer.addEventListener('touchstart', this.getFirstTouch)
		this.itemsContainer.addEventListener('touchend', this.getTouchEnd)

		if (this.isNav) {
			this.btnNext.addEventListener('click', () => {
				this.stackNext++
				if (this.stackNext === 1 && this.stackPrev === 0) {
					this.stackWatcher()
				}

				if (this.stackPrev !== 0)
					this.stackPrev = 1
			})
			this.btnPrev.addEventListener('click', () => {
				this.stackPrev++
				if (this.stackPrev === 1 && this.stackNext === 0) {
					this.stackWatcher()
				}

				if (this.stackNext !== 0)
					this.stackNext = 1
			})
		}
	}
}