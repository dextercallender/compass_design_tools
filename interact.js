$(document).ready(function(){

	$('div.nav-option').click((event) => {
		console.log( event.target.dataset.option );
	})

	// https://stackoverflow.com/questions/56639804/is-there-a-way-to-only-run-p5-js-once-an-event-happens
	// Instance approach. destory after out of view. Create another new when in view

});
