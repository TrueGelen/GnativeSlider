window.addEventListener('load', () => {

	new GnativeSlider({
		loop: true,
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
			'1100': {
				itemsCount: 3,
				nav: false,
				dots: true
			},
			'960': {
				itemsCount: 2,
				nav: true,
				dots: false
			},
			'780': {
				itemsCount: 1,
				nav: true,
				dots: true
			}
		}
	}).createSlider()

})