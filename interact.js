$(document).ready(function() {

	// SLIDERS

	new WebkitInputRangeFillLower(
		{
			selectors: ['slider-width', 'slider-height', 'slider-spacing', 'slider-length', 'slider-weight'], 
			degree: 165,
			gradient: '#c73e1d 0%, #a23b72 12%, #2e86ab 100%',
		}
	);

	// INTRO ANIMATION

	$('header').removeClass('header-close')
	$('.sidebar').removeClass('sidebar-close')
	$('#tooltip-pane').addClass('tooltip-pane-show')

	// $('#slider-width').on('input', ()=>{alert('trigger')})

	// var intervalRefreshID = setInterval(function(){
	// 	const value = parseInt($('#slider-width').val()) + 1
	// 	$('#slider-width').val(value).trigger("input")

		// if ($('#slider-width').val() >= config.gridWidth) {
		// 	clearInterval(intervalRefreshID)
		// }
	// }, 200)


	// NEEDLE PARAMETER PANE

	$('#slider-width').on("input change", evt => {
		config.gridWidth = parseInt(evt.target.value)
		$('#width-value').html(parseInt(evt.target.value))
		refreshGraphic()
	})

	$('#slider-height').on("input change", evt => {
		config.gridHeight = parseInt(evt.target.value)
		$('#height-value').html(parseInt(evt.target.value))
		refreshGraphic()
	})

	$('#slider-spacing').on("input change", evt => {
		config.gridSpacing = parseInt(evt.target.value)
		$('#spacing-value').html(parseInt(evt.target.value))
		refreshGraphic()
	})

	$('#slider-length').on("input change", evt => {
		config.needleLength = parseInt(evt.target.value)
		$('#length-value').html(parseInt(evt.target.value))
		refreshGraphic()
	})

	$('input[name=color]').on("change", () => {
		config.fill = $('#input-color-black').prop('checked') ? BLACK : WHITE;
	})

	$('#slider-weight').on("input change", evt => {
		config.needleWeight = parseInt(evt.target.value)
		$('#weight-value').html(parseInt(evt.target.value))
		refreshGraphic()
	})

	$('input[name=strokecap]').on("change", () => {
		config.needleCap = $('#input-strokecap-round').prop('checked') ? ROUND : SQUARE;
	})

	$('#pattern-toggle div').on("click", evt => {
		$('#pattern-toggle div').removeClass('selected')
		$(evt.target).addClass('selected')
		if ($(evt.target).attr('id') == 'pattern-icon-div') {
			config.mode = PATTERN
		} else {
			config.mode = INTERACTIVE
		}
	})

	const patternMap = {
		1: PATTERN1, 2: PATTERN2, 3: PATTERN3, 4: PATTERN4, 5: PATTERN5, 6: PATTERN6,
		7: PATTERN7, 8: PATTERN8, 9: PATTERN9, 10: PATTERN10, 11: PATTERN11, 12: PATTERN12,
		13: PATTERN13, 14: PATTERN14, 15: PATTERN15, 16: PATTERN16
	}

	$('td').on("click", (evt) => {
		$('td').removeClass('selected')
		$(evt.target).addClass('selected')
		config.patternOption = patternMap[$(evt.target).html()]
	})

	// NEEDLE TOOLTIP PANE

	const tutorialVideo = {
		width: 'assets/width_video_800x800.mp4',
		height: 'assets/height_video_800x800.mp4',
		spacing: 'assets/spacing_video_800x800.mp4',
		length: 'assets/length_video_800x800.mp4',
		weight: 'assets/weight_video_800x800.mp4',
	}

	const tutorialText = {
		width: "The width slider controls the number of needles in a row of the grid.",
		height: "The height slider controls the number of needles in a column of the grid.",
		spacing: "The spacing slider controls the number of pixels between each needle.",
		length: "The length slider controls the length of each needle in pixels.",
		weight: "The weight slider controls the weight of each needle in pixels.",
	}

	$('#tooltip-howto-buttons div').on('click', (evt) => {
		$('#tooltip-howto-buttons div').removeClass('selected')
		$(evt.target).addClass('selected')
		const dataOption = $(evt.target).data('option')
		$('#tutorial-animation video').addClass('fadeout')
		setTimeout(() => {
			$('#tutorial-animation video').attr('src', tutorialVideo[dataOption]);
			setTimeout(() => {
				$('#tutorial-animation video').removeClass('fadeout')
			}, 100)
		}, 300)
		$('#tutorial-description p').html(tutorialText[dataOption])
	})

	// automatically rotate 
	const tutorialOptions = $('#tooltip-howto-buttons div')
	let i = 1;
	setInterval(() => {
		$(tutorialOptions[i % tutorialOptions.length]).trigger('click');
		i++;
	}, 4000)

	// GENERAL PANE CONTROLS

	$('#openclose-panel-container').on('click', () => {
		if ($('.sidebar').attr("class").split(/\s+/).includes('sidebar-close')) {
			$('.sidebar').removeClass('sidebar-close')
			$('header').removeClass('header-close')
		} else {
			$('.sidebar').addClass('sidebar-close')
			$('header').addClass('header-close')
		}
	})

	$('#tooltip-container').on('click', () => {
		if ($('#tooltip-pane').attr("class").split(/\s+/).includes('tooltip-pane-show')) {
			$('#tooltip-pane').removeClass('tooltip-pane-show')
		} else {
			$('#tooltip-pane').addClass('tooltip-pane-show')
		}
	})

	$('#tooltip-pane .close-icon').on('click', () => {
		$('#tooltip-pane').removeClass('tooltip-pane-show')
	})

});
