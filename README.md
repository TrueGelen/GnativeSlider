# GnativeSlider
This is a responsive slider which was created on native js.
---------------------------------
Usage
================================
###Expamle:
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
			'1100': {         //all fields are required
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
  
  Default settings
  ----------------------
````js
  this.defaultSettings = {		//TYPE				//POSSIBLE VALUES													           //NECESSARY TO FILL
	loop: true,									//boolean. 		//true, false
	itemsContainer: undefined,	//string.		  //the example:'.someSection .someWrapper .someClass' //a required field
	animationTime: 200,     		//number.			//milliseconds
	margin: '5px',							//string. 		//The example: '5px'
	nav: true,									//boolean.		//true, false
	btnNext: undefined,					//string.		  //the example:'.someSection .someWrapper .someClass'	//a required field if nav === true
	btnPrev: undefined,					//string.		  //the example:'.someSection .someWrapper .someClass'	//a required field if nav === true
	dots: true,									//boolean.
	dotsContainer: undefined,		//string.		  //the example:'.someSection .someWrapper .someClass'	//a required field if dots === true
	exampleOfDot: undefined,		//string.		  //the example:'.someSection .someWrapper .someClass'	//a required field if dots === true
	activeDotClass: undefined,	//string.			//the example: 'yourShowClass'											  //a required field if dots === true
	itemsCount: 1,							//number			//just a number of count on first screen
	responsive: false,					//boolean.		//true, false
  breakpoints: {},						//object 		  //the example: //'1100':{itemsCount: 3,nav: true,dots: true},
                                                           // '960':{itemsCount: 2,nav: true,dots: true}
  validation: false           //boolean.   // if you want to validate your input object, when you did it, set false
  }
  ````
  
  If you want to have more buttons, you can use method "doSlide(nodeElement, 'direction')":
  --------------------
  ### The expample:
  
  ````js
  let Gslider = new GnativeSlider({...})
	Gslider.createSlider()

	const secondaryBtnNext = document.querySelector('.someSection .otherButtons .otherButtons_button-next')
	const secondaryBtnPrev = document.querySelector('.someSection .otherButtons .otherButtons_button-prev')

	slider.doSlide(secondaryBtnNext, 'next')
	slider.doSlide(secondaryBtnPrev, 'prev')
  ````
  
