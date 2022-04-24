$(window).on('load', function () {
	if ($('#preloader').length) {
		$('#preloader').delay(50).fadeOut('slow', function () {
		$(this).remove();
	});
	}
});


