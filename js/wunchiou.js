var navlocation = "#about";
var navlist = [];
var num = 0;
var num_ajax_sections = 4;
var sm_width = 480;

/**
 * Show the current page location in the nav
 * @param  {string} loc : the CSS selector for the current location
 */
function setlocation(loc) {
	navlocation = loc;
	$('nav > a[href!='+loc+']').removeClass('nav_selected');
	$('nav > a[href='+loc+']').addClass('nav_selected');
}

/**
 * Register the hover tips.
 * @param  {jQuery} $items  : items to register
 * @param  {Object} options : TipTip options
 */
function registerHoverTips($items, options) {
	if (window.innerWidth > sm_width) {
		$items.tipTip(options);
	}
}

/**
 * Register images to load in the lightbox
 * @param  {jQuery} $items
 * @param  {function} linkmapper
 */
function registerLightbox($items, linkmapper) {
	if (window.innerWidth > sm_width) {
		var linkmapper = linkmapper || function(el) {
			return [el.href, (el.title || el.firstChild.alt)];
		};

		$items.parent().slimbox({
			resizeDuration: 200,
			imageFadeDuration: 200,
			captionAnimationDuration: 100,
		}, linkmapper);
	}
}

/**
 * After last ajax is loaded: Set nav location on page scroll, register hover tips & lightbox links
 */
function ajaxloaded () {
	if (++num >= num_ajax_sections) {
		// build an array of sections on the page
		$('section').each(function() {
			navlist.push('#' + this.id);
		});

		// set the waypoints
		$('section').waypoint(function(event, direction) {
			if (direction === 'down') {
				setlocation('#'+this.id);
			} else {
				setlocation( navlist[navlist.indexOf('#'+this.id)-1] );
			}
		}, {
	   		offset: '50%'  // middle of the page
		});

		// Register work image links with lightbox
		$('#work_content article').each(function() {
			registerLightbox($(this).find('a > img'));
		});

		// Register resume icons hover tips
		registerHoverTips($('#resume_content a[title]'), {defaultPosition:"top",edgeOffset:20});
	}
}

/**
 * Load the blog posts from Wordpress
 */
function loadPostsSection() {
	$('#post_content').html('Loading posts from Wordpress ...');
	$.getJSON("https://public-api.wordpress.com/rest/v1/sites/wunchiou.wordpress.com/posts/?number=5&callback=?",
	function(json) {
		if (json !== "error"){
			$('#post_content').html('');
			$.each(json.posts, function(i,post) {
				var article = $('<article>', {html: post.content});
				var header = $('<header>');
				var title = $('<h1>').append( $('<a>',{html:post.title, href:post.URL}) );
				var time = $('<time>',{
								datetime: post.date,
								pubdate: 'pubdate',
								html: (new Date(post.date)).toLocaleDateString()
							});
				
				$(header).append(title);
				$(header).append(time);
				$(article).prepend(header);
				$('#post_content').append(article);
			});
			registerLightbox($('#post_content article a > img:not([data-orig-file])'),function(el) {
				return [el.href.replace(/\?.+/, "") + '?h=600', (el.title || el.firstChild.alt)];
			});
			registerLightbox($('#post_content article a > img[data-orig-file]'),function(el) {
				return [el.firstChild.getAttribute('data-orig-file')+'?h=600', (el.title || el.firstChild.alt)];
			});	
		} else {
			$('#post_content').html("Sorry, cannot load posts right now.");
		}
	}).always(ajaxloaded);
}

/**
 * Load the pictures section from Flickr
 */
function loadPicturesSection() {
	var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos"
						+ "&api_key=a26d129b372bb3273bfa954be5200d2c"
						+ "&user_id=49503158742@N01"
						+ "&extras=url_q,url_z"
						+ "&per_page=15"
						+ "&format=json&jsoncallback=?";
	$('#pictures_content').html('Loading photos from Flickr ...');
	$.getJSON(flickr_url,
	function(json) {
		if (json.stat === "ok"){
			$('#pictures_content').html('');
			$.each(json.photos.photo, function(i,photo) {
				$('#pictures_content')
					.append($('<a>',{href:photo.url_z,title:photo.title})
						.append( $('<img>',{src:photo.url_q,alt:photo.title})));
			});
			registerLightbox($('#pictures_content a > img'));
			registerHoverTips($('#pictures_content a > img').parent(), {defaultPosition:"top",edgeOffset:150});
		} else {
			console.log(json.stat);
			$('#pictures_content').html("Sorry, cannot load pictures right now.");
		}
	}).always(ajaxloaded);
}

/**
 * Things to do when the page is ready
 */
jQuery(document).ready(function($) {

	// Smooth scrolling for same-page anchors
	$('a[href*=#]').click(
	function(e) {
		e.preventDefault();
		var target = $(this).attr("href");
		$('footer').css('height', '200px'); // Mobile Safari hack, part 1

		// perform animated scrolling by getting top-position of target-element and set it as scroll target
		$('html, body').stop().animate({ scrollTop: $(target).offset().top }, 700, 'swing',
			function() {
		    	location.hash = target;  //attach the hash (#jumptarget) to the pageurl
		    	$('footer').css('height', '1px'); // Mobile Safari hack, part 2
			});

		return false;
	});

   	$('#resume_content').load('resume/resume.html', ajaxloaded);
   	$('#work_content').load('portfolio/portfolio.html', ajaxloaded);
   	loadPostsSection();
   	loadPicturesSection();
	registerHoverTips($('#contact a[title]'), {edgeOffset:15});

});
