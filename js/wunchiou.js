var navlocation = "#about";
var navlist = [];

jQuery(document).ready(function($) {

	// ---------------------------------------
	// Set current nav state
	// ---------------------------------------

	function setlocation(loc) {
		navlocation = loc;
		$('nav > a[href!='+loc+']').removeClass('nav_selected');
		$('nav > a[href='+loc+']').addClass('nav_selected');
	}

	// ---------------------------------------
	// Smooth scrolling for same-page anchors
	// ---------------------------------------

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

   	// ---------------------------------------
   	// Load Resumé
   	// ---------------------------------------
   	$('#resume_content').load('resume/resume.html', ajaxloaded);

   	// ---------------------------------------
   	// Load Work Portfolio
   	// ---------------------------------------
   	$('#work_content').load('portfolio/portfolio.html', ajaxloaded);

   	// ---------------------------------------
   	// Load posts from Wordpress
   	// ---------------------------------------

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
			// Register post image links with Slimbox2
			//$('article a > img:not([data-orig-file])').parent().slimbox();
			$('#post_content article a > img:not([data-orig-file])').parent().slimbox({},function(el) {
				return [el.href.replace(/\?.+/, "") + '?h=600', (el.title || el.firstChild.alt)];
				});
			$('#post_content article a > img[data-orig-file]').parent().slimbox({},function(el) {
				return [el.firstChild.getAttribute('data-orig-file')+'?h=600',
					(el.title || el.firstChild.alt)];
				});
			
		} else {
			$('#post_content').html("Sorry, cannot load posts right now.");
		}
	}).complete(ajaxloaded);

   	// ---------------------------------------
   	// Load photos from Flickr
   	// ---------------------------------------
	
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
			// Register Flickr image links with Slimbox2
			$('#pictures_content a > img').parent().slimbox({
				resizeDuration:200,imageFadeDuration:200,captionAnimationDuration:100},
				function(el) {
					return [el.href, (el.title || el.firstChild.alt)];
				});
			// Register Flickr image links with tipTip
			$('#pictures_content a > img').parent().tipTip({defaultPosition:"top",edgeOffset:150});
		} else {
			console.log(json.stat);
			$('#pictures_content').html("Sorry, cannot load pictures right now.");
		}
	}).complete(ajaxloaded);

   	// ---------------------------------------
   	// Set contact hover tip effect
   	// ---------------------------------------
	$('#contact a[title]').tipTip({edgeOffset:15});

   	// ---------------------------------------
   	// After ajax is loaded: Set nav location on page scroll, register Slimbox links
   	// ---------------------------------------
   	var num = 0;
   	function ajaxloaded () {
   		if (++num >= 4) {		// do this after the last ajax section is loaded
   			// build an array of sections on the page
   			$('section').each(function(){
				navlist.push('#' + this.id);
			});
   			// set the waypoints
			$('section').waypoint(function(event, direction) {
				if (direction === 'down') {setlocation('#'+this.id);}
				else {setlocation( navlist[navlist.indexOf('#'+this.id)-1] );}
			}, {
		   		offset: '50%'  // middle of the page
			});
			// Register  image links with Slimbox2
			$('#work_content article').each(function() {
				$(this).find('a > img').parent().slimbox({
					resizeDuration:200,imageFadeDuration:200,captionAnimationDuration:100},
					function(el) {
						return [el.href, (el.title || el.firstChild.alt)];
				});
			});
			// Register tipTip icons
			$('#resume_content a[title]').tipTip({defaultPosition:"top",edgeOffset:20});
   		}
	}
});
