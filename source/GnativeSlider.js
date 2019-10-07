class GnativeSlider {
	constructor(settings) {
		this.defaultSettings = {
			loop: true,
			itemsContainer: undefined,
			animationTime: 200,
			margin: '5px',
			nav: true,
			btnNext: undefined,
			btnPrev: undefined,
			dots: true,
			dotsContainer: undefined,
			exampleOfDot: undefined,
			activeDotClass: undefined,
			itemsCount: 1,
			responsive: false,
			breakpoints: {}
		}

		this.finalSettings = this.mergeSettings(this.defaultSettings, settings)

		//for the function getBreakPoint()
		this.responsiveMap = this.getResponsiveMap()

		this.wrapperItemsContainer = document.querySelector(this.finalSettings.itemsContainer)
		this.itemsContainer = document.createElement('div')
		this.items = this.itemsContainer.children
		//to get the step of animation and to work the animation in the itemsBehavior()
		this.widthItem = '0'
		this.itemsCount = this.finalSettings.itemsCount
		this.activeItemIndex = 0

		this.isNav = this.finalSettings.nav
		this.btnNext = document.querySelector(this.finalSettings.btnNext)
		this.btnPrev = document.querySelector(this.finalSettings.btnPrev)
		//to show buttons
		this.displayOfButtons = this.getPropertyOfElement(this.btnNext, 'display')

		//the map of references for active dots and items of slide
		this.arrActiveDots = [0]
		this.dotsContainer = document.querySelector(this.finalSettings.dotsContainer)
		//the made example of a dot for the slider
		this.exampleOfDot = document.querySelector(this.finalSettings.exampleOfDot)
		this.isDots = this.finalSettings.dots

		//for swipe functions: getFirstTouch(), getTouchEnd(); and listeners in setEventListeners()
		this.firstTouchX = 0
		this.firstTouchY = 0

		//for the stack of calls
		this.stackNext = 0
		this.stackPrev = 0

		//for the setStepOfAnimation()
		this.stepOfAnimation

		this.preparingItemsContainer()
		this.setEventListeners()


		return this
	}

	getPropertyOfElement(element, property) {
		if (element.style[property] === '') {
			return element.currentStyle ? element.currentStyle[property] : getComputedStyle(element, null)[property]
		}
		else
			return element.style[property]
	}

	// 1.remove text child of items container
	// 2.make wrappers for items and items container 
	preparingItemsContainer() {
		for (let i = 0; i < this.wrapperItemsContainer.childNodes.length; i++) {
			if (this.wrapperItemsContainer.childNodes[i].nodeName === "#text" ||
				this.wrapperItemsContainer.childNodes[i].nodeName === "#comment") {
				this.wrapperItemsContainer.childNodes[i].remove()
				i--
			}
		}

		while (this.wrapperItemsContainer.firstChild) {
			this.wrapperItemsContainer.firstChild.style.textAlign = this.getPropertyOfElement(this.wrapperItemsContainer.firstChild, 'textAlign')
			this.wrapperItemsContainer.firstChild.style.width = '100%'
			let wrapperItem = document.createElement('div')
			wrapperItem.append(this.wrapperItemsContainer.firstChild)
			this.itemsContainer.append(wrapperItem)
		}

		this.wrapperItemsContainer.append(this.itemsContainer)

		this.itemsContainer.style.overflow = 'hidden'
		this.itemsContainer.style.margin = `0px -${this.finalSettings.margin} 0px -${this.finalSettings.margin}`
		this.itemsContainer.style.textAlign = 'left'
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
			for (let key in this.finalSettings.breakpoints) {
				if (key > window.innerWidth)
					return true
			}
			return false
		} else
			return false
	}

	setIsNav(widthOfScreen = undefined) {
		if (widthOfScreen !== undefined) {
			if (this.finalSettings.breakpoints[widthOfScreen].nav !== undefined)
				this.isNav = this.finalSettings.breakpoints[widthOfScreen].nav
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
			if (typeof (this.finalSettings.breakpoints[widthOfScreen].itemsCount) !== "number")
				return false
			this.itemsCount = this.finalSettings.breakpoints[widthOfScreen].itemsCount
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
				this.items[this.itemsCount].style.display = 'inline-block'
				this.items[this.itemsCount].style.marginRight = `-${Number(this.widthItem)}px`
				startAnimate = setInterval(forwardAnim, 5)
			}
			else {
				this.items[this.items.length - 1].style.marginLeft = `-${Number(this.widthItem)}px`
				this.items[this.items.length - 1].style.display = 'inline-block'
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
			this.items[i].style.display = 'inline-block'
		}
	}

	setIsDots(widthOfScreen = undefined) {
		if (widthOfScreen !== undefined) {
			if (this.finalSettings.breakpoints[widthOfScreen].dots !== undefined)
				this.isDots = this.finalSettings.breakpoints[widthOfScreen].dots
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
		return Object.keys(this.finalSettings.breakpoints)
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
		//this.preparingItemsContainer()

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

		if (this.isNode(this.btnNext) && this.isNode(this.btnPrev)) {
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
		else {
			if (typeof settings.btnNext !== "string" || !this.isNod(document.querySelector(settings.btnNext)))
				console.error('btnNext is a required field. Type of btnNext must be a string. The example: btnNext: ".someSection .someWrapper .someClass"')
			if (typeof settings.btnPrev !== "string" || !this.isNod(document.querySelector(settings.btnPrev)))
				console.error('btnPrev is a required field. Type of btnPrev must be a string. The example: btnPrev: ".someSection .someWrapper .someClass"')
		}
	}

	validationOfTheInputObject() {
		if (typeof this.finalSettings !== 'object')
			throw new Error('Your options must be an object. The example: new GnativeSlider({itemsContainer: ".someSection .someWrapper .someClass"})')
		if (typeof this.finalSettings.itemsContainer !== 'string' || !this.isNode(document.querySelector(this.finalSettings.itemsContainer)))
			throw new Error('itemsContainer is a required field. Type of itemsContainer must be a string. The example: itemsContainer: ".someSection .someWrapper .someClass"')
		if (typeof this.finalSettings.btnNext !== 'string' || !this.isNode(document.querySelector(this.finalSettings.btnNext)))
			throw new Error('btnNext is a required field. Type of btnNext must be a string. The example: btnNext: ".someSection .someWrapper .someClass"')
		if (typeof this.finalSettings.btnPrev !== 'string' || !this.isNode(document.querySelector(this.finalSettings.btnPrev)))
			throw new Error('btnPrev is a required field. Type of btnPrev must be a string. The example: btnPrev: ".someSection .someWrapper .someClass"')
		if (typeof this.finalSettings.dotsContainer !== 'string' || !this.isNode(document.querySelector(this.finalSettings.dotsContainer)))
			throw new Error('dotsContainer is a required field. Type of dotsContainer must be a string. The example: dotsContainer: ".someSection .someWrapper .someClass"')
		if (typeof this.finalSettings.exampleOfDot !== 'string' || !this.isNode(document.querySelector(this.finalSettings.exampleOfDot)))
			throw new Error('exampleOfDot is a required field. Type of exampleOfDot must be a string. The example: exampleOfDot: ".someSection .someWrapper .someClass"')
		if (typeof this.finalSettings.activeDotClass !== 'string')
			throw new Error('activeDotClass is a required field. Type of activeDotClass must be a string. The example: activeDotClass: "yourActiveDotClass"')
		if ('loop' in this.finalSettings)
			if (typeof this.finalSettings.loop !== 'boolean')
				throw new Error('loop is not a required field. The default value is true. Type of loop must be a boolean. The example: loop: false')
		if ('animationTime' in this.finalSettings)
			if (typeof this.finalSettings.animationTime !== 'number')
				throw new Error('animationTime is not a required field. The default value is 200 ms. Type of loop must be a number. The example: animationTime: 200')
		if ('margin' in this.finalSettings)
			if (typeof this.finalSettings.margin !== 'string')
				throw new Error('margin is not a required field. The default value is 5px. Also margin can only be in pixels. Type of margin must be a string. The example: margin: "5px"')
		if ('nav' in this.finalSettings)
			if (typeof this.finalSettings.nav !== 'boolean')
				throw new Error('nav is not a required field. The default value is true. Type of nav must be a boolean. The example: nav: true')
		if ('dots' in this.finalSettings)
			if (typeof this.finalSettings.dots !== 'boolean')
				throw new Error('dots is not a required field. The default value is true. Type of dots must be a boolean. The example: dots: true')
		if ('itemsCount' in this.finalSettings)
			if (typeof this.finalSettings.itemsCount !== 'number')
				throw new Error('itemsCount is not a required field. The default value is 1. Type of itemsCount must be a number. The example: itemsCount: 1')
		if ('responsive' in this.finalSettings)
			if (typeof this.finalSettings.responsive !== 'boolean')
				throw new Error('responsive is not a required field. The default value is false. Type of responsive must be a boolean. The example: responsive: true')
		if ('breakpoints' in this.finalSettings) {
			for (let key in this.finalSettings.breakpoints) {
				//check of the key
				if (typeof key !== 'string')
					throw new Error('Type of key of breakpoints must be a string. The example: breakpoints: "1100": {dots: true, nav: true}')
				if (isNaN(Number(key)))
					throw new Error('key of breakpoints must be a number but represented as a string. The example: breakpoints: "1100": {dots: true, nav: true}')
				if (typeof this.finalSettings.breakpoints[key] !== "object") {
					throw new Error('keys of breakpoints must contains objects. The example: breakpoints: "1100": {dots: true, nav: true}, "960": {dots: false, nav: true}')
				}
				//check of the object inside the key
				else {
					if ('itemsCount' in this.finalSettings.breakpoints[key]) {
						if (typeof this.finalSettings.breakpoints[key].itemsCount !== 'number')
							throw new Error('Error in breakpoints.' + key + '. Type of itemsCount must be a number. The example: itemsCount: 1')
					}
					else {
						throw new Error('itemsCount in breakpoints is a required field. Type of itemsCount must be a number. The example: itemsCount: 1')
					}
					if ('dots' in this.finalSettings.breakpoints[key]) {
						if (typeof this.finalSettings.breakpoints[key].dots !== 'boolean')
							throw new Error('Error in breakpoints.' + key + '. Type of dots must be a boolean. The example: dots: true')
					}
					else {
						throw new Error('dots in breakpoints is a required field. Type of dots must be a boolean. The example: dots: true')
					}
					if ('nav' in this.finalSettings.breakpoints[key]) {
						if (typeof this.finalSettings.breakpoints[key].nav !== 'boolean')
							throw new Error('Error in breakpoints.' + key + '. Type of nav must be a boolean. The example: nav: true')
					}
					else {
						throw new Error('dots in breakpoints is a required field. Type of nav must be a boolean. The example: nav: true')
					}
				}
			}
		}
	}
}