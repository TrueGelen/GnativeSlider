# GnativeSlider
This is a responsive slider which was created on native js.
---------------------------------
Usage
-----------------------------
#### The expamle:
````js
new GnativeSlider({
		loop: false,
		itemsContainer: '.someSection .slider .items',
		animationTime: 200,
		margin: '5px',
		btnNext: '.someSection .slider .buttons .button-next',
		btnPrev: '.someSection .slider .buttons .button-prev',
		dotsContainer: '.someSection .dotsContainer',
		exampleOfDot: '.someSection .dotsContainer .exampleOfDot',
		activeDotClass: 'activeDotClass',
		itemsCount: 4,
		nav: true,
		dots: true,
		responsive: true,
		breakpoints: {
			'1100': {//all fields inside curly brackets of breakpoint are required
				itemsCount: 3,
				nav: false,
				dots: true
			},
			'960': {
				itemsCount: 2,
				nav: false,
				dots: false
			},
			'780': {
				itemsCount: 1,
				nav: false,
				dots: true
			}
		}
	}).createSlider()
  ````
  
  ### Default settings
  
````js
  this.defaultSettings = {
//TYPE		//POSSIBLE VALUES(expample)			//NECESSARY TO FILL
//boolean
	loop: true,
//string	//'.someSection .someWrapper .someClass' 	//a required field
	itemsContainer: undefined,
//number	//milliseconds
	animationTime: 200,
//string 	//'5px'
	margin: '5px',
//boolean
	nav: true,
//string	//'.someSection .someWrapper .someClass'	//a required field if nav === true
	btnNext: undefined,
	btnPrev: undefined,
//booleam
	dots: true,
//string	//'.someSection .someWrapper .someClass'	//a required field if dots === true
	dotsContainer: undefined,
//string	//'.someSection .someWrapper .someClass'	//a required field if dots === true
	exampleOfDot: undefined,
//string	//'yourShowClass'				//a required field if dots === true
	activeDotClass: undefined,
//number	//just a number of count on first screen
	itemsCount: 1,
//boolean
	responsive: false,
//object  //{'1100':{itemsCount: 3,nav: true,dots: true}, '960':{itemsCount: 2,nav: true,dots: true}}
  breakpoints: {},
 //boolean	// if you want to validate your input object, when you did it, set false
  validation: false
  }
  ````
  
  ### If you want to have more buttons, you can use method "doSlide(nodeElement, 'direction')":
  #### The expample:
  
  ````js
  let Gslider = new GnativeSlider({...})
	Gslider.createSlider()

	const secondaryBtnNext = document.querySelector('.someSection .otherButtons .otherButtons_button-next')
	const secondaryBtnPrev = document.querySelector('.someSection .otherButtons .otherButtons_button-prev')

	slider.doSlide(secondaryBtnNext, 'next')
	slider.doSlide(secondaryBtnPrev, 'prev')
  ````
  
