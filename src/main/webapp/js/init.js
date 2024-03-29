/*-----------------------------------------------------------------------------------
/*
/* Init JS
/*
-----------------------------------------------------------------------------------*/
var animationDone = false;
var hash = '';
var position = 0;
var scroll = false;
jQuery(document).ready(
		function($) {

			$.ajax('/linkedin').done(function(data) {
				$('#linkedin').html(data);

			});

			$('.mobile-btn').on('click', function(e){
			    $(this).attr('href',function(_, currHref) {
                    return currHref === '#nav-wrap' ? '#' : '#nav-wrap';
            });});

			$('a[href^=#skill]').addClass('smoothscroll');

			$('a[href^=#skill]').each(
					function() {

						this.title = $($(this).prop("hash")).parent().children(
								'span').attr('title');
						
						$(this).addClass('titled_anchor');

					});

			/*----------------------------------------------------*/
			/*
			 * FitText Settings
			 * ------------------------------------------------------
			 */

			setTimeout(function() {
				$('h1.responsive-headline').fitText(1, {
					minFontSize : '40px',
					maxFontSize : '90px'
				});
			}, 100);

			/*----------------------------------------------------*/
			/*
			 * Smooth Scrolling
			 * ------------------------------------------------------
			 */

			$('.smoothscroll').on('click', function(e) {
				e.preventDefault();

				var target = this.hash, $target = $(target);

				$('html, body').stop().animate({
					'scrollTop' : $target.offset().top
				}, 800, 'swing', function() {
					window.location.hash = target;
					animationDone = true;
				});
			});

			/*----------------------------------------------------*/
			/*
			 * Highlight the current section in the navigation bar
			 * ------------------------------------------------------
			 */

			var sections = $("section");
			var navigation_links = $("#nav-wrap a");

			sections.waypoint({

				handler : function(event, direction) {

					var active_section;

					active_section = $(this);
					if (direction === "up")
						active_section = active_section.prev();

					var active_link = $('#nav-wrap a[href="#'
							+ active_section.attr("id") + '"]');

					navigation_links.parent().removeClass("current");
					active_link.parent().addClass("current");

				},
				offset : '35%'

			});

			/*----------------------------------------------------*/
			/*
			 * Make sure that #header-background-image height is /* equal to the
			 * browser height.
			 * ------------------------------------------------------
			 */

			$('header').css({
				'height' : $(window).height()
			});
			$(window).on('resize', function() {

				$('header').css({
					'height' : $(window).height()
				});
				$('body').css({
					'width' : $(window).width()
				})
			});

			/*----------------------------------------------------*/
			/*
			 * Fade In/Out Primary Navigation
			 * ------------------------------------------------------
			 */

			$(window).on(
					'scroll',
					function() {

						var h = $('header').height();
						var y = $(window).scrollTop();
						var nav = $('#nav-wrap');

						if ((y > h * .20) && (y < h)
								&& ($(window).outerWidth() > 768)) {
							nav.fadeOut('fast');
						} else {
							if (y < h * .20) {
								nav.removeClass('opaque').fadeIn('fast');
							} else {
								nav.addClass('opaque').fadeIn('fast');
							}
						}

					});

			/*----------------------------------------------------*/
			/*
			 * Modal Popup
			 * ------------------------------------------------------
			 */

			$('.item-wrap a').magnificPopup({

				type : 'inline',
				fixedContentPos : false,
				removalDelay : 200,
				showCloseBtn : false,
				mainClass : 'mfp-fade',
				callbacks : {
					elementParse : function(item) {
						hash = window.location.hash;

						window.location.hash = item.src;
					},
					close : function() {

						window.location.hash = ' ';
						
						if(scroll)
						$("html, body").animate({ scrollTop: position },800);
						scroll = false;
						
					}
				}

			});

			$(document).on('click', '.popup-modal-dismiss', function(e) {
				e.preventDefault();
				$.magnificPopup.close();
			});

			/*----------------------------------------------------*/
			/*
			 * Flexslider /*----------------------------------------------------
			 */
			$('.flexslider').flexslider({
				namespace : "flex-",
				controlsContainer : ".flex-container",
				animation : 'slide',
				controlNav : true,
				directionNav : false,
				smoothHeight : true,
				slideshowSpeed : 7000,
				animationSpeed : 600,
				randomize : false,
			});

			/*----------------------------------------------------*/
			/*
			 * contact form
			 * ------------------------------------------------------
			 */

			$('form#contactForm button.submit').click(
					function() {

						$('#image-loader').fadeIn();

						var contactName = $('#contactForm #contactName').val();
						var contactEmail = $('#contactForm #contactEmail')
								.val();
						var contactSubject = $('#contactForm #contactSubject')
								.val();
						var contactMessage = $('#contactForm #contactMessage')
								.val();

						var data = 'contactName=' + contactName
								+ '&contactEmail=' + contactEmail
								+ '&contactSubject=' + contactSubject
								+ '&contactMessage=' + contactMessage;

						$.ajax({

							type : "POST",
							url : "/contact",
							data : data,
							success : function(msg) {
								// Message was sent
								if (msg == 'OK') {
									$('#image-loader').fadeOut();
									$('#message-warning').hide();
									$('#contactForm').fadeOut(

									function() {
										$('a[href$="contact"]').click();
										$('#message-success').fadeIn();
									});

								}
								// There was an error
								else {
									$('#image-loader').fadeOut();
									$('#message-warning').html(msg);
									$('#message-warning').fadeIn();
								}

							}

						});
						return false;
					});

			$('.modal-details-link').click(
					function(event) {
						if ($(event.target).text() == 'Details')
							$(event.target).fadeOut(function() {
								$(event.target).text('Summary');
								$(event.target).fadeIn();

							});
						else
							$(event.target).fadeOut(function() {
								$(event.target).text("Details");
								$(event.target).fadeIn();
							});

						var height = $(event.target).closest('.popup-modal')
								.children('img').outerHeight();
						height += $(event.target).closest('.popup-modal').find(
								'.overview').outerHeight();
						height -= 4;

						$(event.target).closest('.popup-modal')
								.find('.details').css('min-height', height);

						if ($(event.target).closest('.popup-modal').find(
								'.details').css('display') == 'none') {

							$(event.target).closest('.popup-modal').find(
									'.overview').fadeToggle(200);
							$(event.target).closest('.popup-modal').children(
									'img').fadeToggle(
									200,

									function() {
										$(event.target).closest('.popup-modal')
												.find('.details').fadeToggle(
														200);

									});

						} else {

							$(event.target).closest('.popup-modal').find(
									'.details').fadeToggle(
									200,

									function() {

										$(event.target).closest('.popup-modal')
												.find('.overview').fadeToggle(
														200);
										$(event.target).closest('.popup-modal')
												.children('img')
												.fadeToggle(200);
									});

						}

					});
			
			$('#home .titled_anchor,#about .titled_anchor').tooltipster({
				maxWidth : 520,
				theme : 'tooltipster-dark',
				contentAsHTML: true,
				interactive: true
			});
			
			$(':not(#home, #about) .titled_anchor').tooltipster({
				maxWidth : 520,
				theme : 'tooltipster-light',
				contentAsHTML: true,
				interactive: true
			});
			
			
			$('.tooltip').tooltipster({
				maxWidth : 520,
				theme : 'tooltipster-light',
				iconTouch : true,
				icon : 'Details',
				iconDesktop : true,
				iconTouch : true,
				contentAsHTML: true,
				interactive: true
			});
			
			
			

			if (window.location.hash.match(/modal/gi)) {
				var link = window.location.hash.toString();
				
				animationDone = false;
				$('html, body').animate({scrollTop: $('#portfolio a[href$="'+link+'"]').offset().top-$('#nav').height()}, 800, function(){animationDone=true;});
				
				position = $('#portfolio').offset().top;
				openPopup(link);

			}

			$('a[href^=#skill]').click(

			function() {
				animationDone = false;
				showTip($(this).prop("hash"));

			});
			
			

			

		});

function openPopup(link) {
	scroll = true;
	if (animationDone) {

		$('#portfolio').find('a[href$=' + link + ']').click();
	} else
		setTimeout(function() {
			openPopup(link);
		}, 100);
}

function showProject(project) {
	position = $(window).scrollTop();
	animationDone = false;
	$('html, body').animate({scrollTop: $('#portfolio a[href$="'+project+'"]').offset().top-$('#nav').height()}, 800, function(){animationDone=true;});
	openPopup(project);
}

function showTip(skill) {

	if (animationDone) {

		$(skill).parent().find('span').tooltipster('show');
	} else
		setTimeout(function() {
			showTip(skill);
		}, 100);

}
