$(document).ready(function() {

	// SLIDERS

	new WebkitInputRangeFillLower(
		{
			selectors: ['slider-width', 'slider-height', 'slider-spacing'], 
			degree: 165,
			gradient: '#c73e1d 0%, #a23b72 12%, #2e86ab 100%',
		}
	);
	

	// INTRO ANIMATION

	$('header').removeClass('header-close')
	$('.sidebar').removeClass('sidebar-close')

	// NEEDLE PARAMETER PANE

	// Event Listeners
	$('#slider-width').on("input change", evt => {
		config.gridWidth = parseInt(evt.target.value)
		refreshGraphic()
	})

	$('#slider-height').on("input change", evt => {
		config.gridHeight = parseInt(evt.target.value)
		refreshGraphic()
	})

	$('#slider-spacing').on("input change", evt => {
		config.gridSpacing = parseInt(evt.target.value)
		refreshGraphic()
	})

	$('#slider-length').on("input change", evt => {
		config.needleLength = parseInt(evt.target.value)
		refreshGraphic()
	})

	$('input[name=color]').on("change", () => {
		config.fill = $('#input-color-black').prop('checked') ? BLACK : WHITE;
	})

	$('#slider-weight').on("input change", evt => {
		config.needleWeight = parseInt(evt.target.value)
		refreshGraphic()
	})

	$('input[name=strokecap]').on("change", () => {
		config.needleCap = $('#input-strokecap-round').prop('checked') ? ROUND : SQUARE;
	})


	// GENERAL PANE CONTROLS

	$('#openclose-panel-container').on("click", () => {
		if ($('.sidebar').attr("class").split(/\s+/).includes('sidebar-close')) {
			$('.sidebar').removeClass('sidebar-close')
			$('header').removeClass('header-close')
		} else {
			$('.sidebar').addClass('sidebar-close')
			$('header').addClass('header-close')
		}
	})

});
