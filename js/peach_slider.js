// JavaScript Document

(function( $ ) {
 
    $.fn.peachslider = function( options ) {
 		
		// Set Required Variables
		
		var width = 0;
		var id = this;
		var container_width = this.width();
		
		var position = 0;
 
 		// Setup default options for slider.
        var settings = $.extend({
            // These are the defaults.
            color: "#000000",
            background: "#FFFFFF"
        }, options );

			id.wrapInner( "<div class='slide'></div>");
		
				var first = $(".slide").children().first().clone().addClass('end');				
				//var last = $(".slide").children().last().clone().addClass('end');
				first.appendTo( ".slide" );
				//last.prependTo( ".slide" );
		
				$(".slide").children().each(function() {
					$(this).width(container_width);
					width = width + $(this).width();
					$(this).css("float", "left");
				});
		
				$(".slide").width(width);
		
				var height = $(".slide").outerHeight();
				id.css("height", height);
				
				controls(id, container_width, width);		
		
        return id.css({
            color: settings.color,
            background: settings.background
        });
 
    };
	
	function controls(id, container_width, width) {
		// add control buttons
		id.append( "<div class='left'>left</div>" );
		id.append( "<div class='right'>right</div>" );
		// add click events

		$( ".right" ).click(
		  function() {
			  right(container_width, width);			  
		  }
		);
	
		$( ".left" ).click(
		  function() {
		  		left(container_width, width);
		  }
		);
		
	}
	
	function right(container_width, width) {
		var left = $(".slide").css("left");
		var position = parseInt(left, 10) - container_width;
		var bumper = parseInt(width, 10) - container_width;
		var limit = parseInt(bumper, 10) - parseInt(bumper, 10) - parseInt(bumper, 10);
		if(left == limit + "px") {
			var new_position = parseInt(0, 10) - container_width;
			$(".slide").css({left: 0});
			$(".slide").animate({left: new_position});
		} else {
			$(".slide").animate({left: position});
		}		
		console.log(left);
	}
	
	function left(container_width, width) {
		var left = $(".slide").css("left");
		var position = parseInt(left, 10) + container_width;
		var bumper = parseInt(width, 10) + container_width;
		
		if(left == "0px") {
			var new_position = parseInt(0, 10) - width + container_width;
			var final_position = parseInt(0, 10) - width + container_width + container_width;
			$(".slide").css({left: new_position});
			$(".slide").animate({left: final_position});
		} else {
			$(".slide").animate({left: position});
		}		
		console.log(left);
	}

 
}( jQuery ));