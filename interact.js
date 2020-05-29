$(document).ready(function() {

	const NEEDLE = 'needle';
	const DOT = 'dot';
	const TOPO = 'topo';
	currentTool = TOPO;
	needleIframe = `<iframe src="needle.html" id="${NEEDLE}"></iframe>`;
	dotIframe = `<iframe src="dot.html" id="${DOT}"></iframe>`;
	topoIframe = `<iframe src="topo.html" id="${TOPO}"></iframe>`;

	$('div.nav-option').click((event) => {
		toolSelection = event.target.dataset.option;
		if (toolSelection && toolSelection != currentTool) {
			$(`#${currentTool}`).remove();
			switch (toolSelection) {
				case NEEDLE:
					$(needleIframe).appendTo('body');
					currentTool = NEEDLE;
					break;
				case DOT:
					$(dotIframe).appendTo('body');
					currentTool = DOT;
					break;
				case TOPO:
					$(topoIframe).appendTo('body');
					currentTool = TOPO;
					break;
			}
		}
	});

});
