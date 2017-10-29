// Peach Slider jQuery Plugin
// A boilerplate for jumpstarting jQuery plugins development
// version 1.0, January 01 2017
// by Christian Burd

;(function($) {

    $.fn.peachslider = function( options ) {

        var defaults = {
            state: "static",
            position: 0,
            total_slider: 0,
            container_width: 0,
            slide_width: 0,
            single_slide_width: 0,
            height: 0,
            controls: true,
            color: "#000000",
            background: "#FFFFFF",
            pager: false,
            thumbnails: false,
            speed: 1000,
            transition: "slide",
            autoplay: false,
            autospeed: 2500,
            auto_direction: "right",
            loop: false,
            progress_bar: false,
            captions: false,
			auto: false,
			on_load: function() {}, 
			on_before: function() {},
			on_after: function() {}
        }

        var plugin = this;
        var container = $(this);

        plugin.settings = {}

        var update_active = function() {
            container.find(".ps_thumb").removeClass("active");
            container.find(".ps_pager_btn").removeClass("active");
            container.find('.ps_thumb_btn[data-pos=' + plugin.settings.position + ']').parent().addClass("active");
            container.find('.ps_pager_btn[data-pos=' + plugin.settings.position + ']').addClass("active");
            init_progress_bar();
        }

        var progress_bar_setup = function() {
            if( $( ".ps_progress_bar_con" ).length ) {
                $(".ps_progress_bar_con").append("<div class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div>");
            } else {
                $("#peach_slider").append("<div class='ps_progress_bar_con'><div class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>");  
            }   
        }

        var init_progress_bar = function() {
            if(plugin.settings.progress_bar == true) {
                container.find(".ps_progress_bar_con").empty();
                container.find(".ps_progress_bar_con").append("<div class='progress-bar' style='width: 0%;'></div>");    
                container.find(".progress-bar").animate({width: "100%"}, plugin.settings.autospeed);
            }
        }

        var autoplay_direction = function() {
            // check auto_direction
            if(plugin.settings.auto_direction == "right") {
                // if right slide right
                right();
            } else {
                // if left slide left
                left();
            }
            // check if progress bar is set as true, if yes init progress bar
        }

        var autoplay_setup = function() {
            // create loop using setInterval
            plugin.settings.auto = setTimeout(autoplay, plugin.settings.autospeed);
            // add hover check to see if the slider is been hover, if hovered hault autoplay until user stops hovering
            container.find("#peach_slider").hover(               
               function () {
                    // Hover state stop setInterval
                    clearTimeout(plugin.settings.auto);
				    plugin.settings.auto = false;
               },                   
               function () {
                    // Hover finished restart setInterval
				    if(plugin.settings.auto != false) { clearTimeout(plugin.settings.auto); }
                    plugin.settings.auto = setTimeout(autoplay, plugin.settings.autospeed); 
               }
            ); 
        }
		
		var autoplay = function() {
			autoplay_direction();
			plugin.settings.auto = setTimeout(autoplay, plugin.settings.autospeed);
		}

        var thumbnails_setup = function() {
            if( container.find( ".ps_thumbnails_con" ).length ) {

            } else {
                container.find("#peach_slider").append("<div class='ps_thumbnails_con'><ul class='ps_thumbnails'></ul></div>");      
                container.find(".slide").children().each(function(index) {
                    var src = $(this).attr("src");
                    if(!$(this).hasClass("end")) {
                        if(index == 0) {
                            $(".ps_thumbnails").append("<li class='ps_thumb active'><a data-pos='" + index + "' class='ps_thumb_btn' href=''><div class='ps_thumb_con' style='background-image: url(" + src + ");'></div></a></li>");
                        } else {
                            $(".ps_thumbnails").append("<li class='ps_thumb'><a data-pos='" + index + "' class='ps_thumb_btn' href=''><div class='ps_thumb_con' style='background-image: url(" + src + ");'></div></a></li>");
                        }
                    }
                });
            }
            container.find( ".ps_thumb_btn" ).click(
              function(event) {
                    event.preventDefault();
                    if(plugin.settings.state == "static" && !$(this).hasClass("active")) {
                        var pos = $(this).data("pos");                        
                        if(plugin.settings.auto_direction == "right") {
                            plugin.settings.position = pos - 1;
                            // if right slide right
                            console.log(plugin.settings.position);
                            right();
                        } else {
                            // if left slide left
                            plugin.settings.position = pos + 1;
                            console.log(plugin.settings.position);
                            left();
                        }
                        update_active();    
                    }
              }
            );
        }

        var pager_setup = function() {
            container.find("#peach_slider").append("<div class='ps_pager_con'><ul class='ps_pager'></ul></div>");
            container.find(".slide").children().each(function(index) {
                if(!$(this).hasClass("end")) {
                    if(index == 0) {
                        container.find(".ps_pager").append("<li><a data-pos='" + index + "' class='ps_pager_btn active' href=''></a></li>");
                    } else {
                        container.find(".ps_pager").append("<li><a data-pos='" + index + "' class='ps_pager_btn' href=''></a></li>");
                    }
                }
            });
            container.find( ".ps_pager_btn" ).click(
              function(event) {
                    event.preventDefault();
                    if(plugin.settings.state == "static" && !$(this).hasClass("active")) {
                        var pos = $(this).data("pos");                        
                        if(plugin.settings.auto_direction == "right") {
                            plugin.settings.position = pos - 1;
                            // if right slide right
                            right();
                        } else {
                            // if left slide left
                            plugin.settings.position = pos + 1;
                            left();
                        }
                        update_active();
                    }               
              }
            );
        }

        var right = function() {
			console.log(plugin.settings.position);
            // call on after function
            plugin.settings.on_before.call(this);
            // move slider to the right by one position
            // check if slider is in final position
            if(plugin.settings.position == (plugin.settings.total_slider - 2)) {
                // we are at the last slide we now need to move back to position 0
                // set state as moving
                plugin.settings.state = "moving";
                // increment to settings.position
                plugin.settings.position++;
                // calculate the next position of slide
                var next_position = 0 - (plugin.settings.position * plugin.settings.single_slide_width);
                // set position to 0
                plugin.settings.position = 0;
                // update active position
                update_active();
                // animate slide into next position
                container.find(".slide").animate({left: next_position}, plugin.settings.speed).promise().done(function () { 
                    // set state as static
                    plugin.settings.state = "static";
                    // reset slider to position 0
                    container.find(".slide").css("left", 0);
                });
            } else {
                // we are not at the end slide yet so move to next slide
                // increment settings.position
                plugin.settings.position++;

                update_active();
                // calculate the next position for .slide
                var next_position = 0 - (plugin.settings.position * plugin.settings.single_slide_width);
                // set state as moving
                plugin.settings.state = "moving";
                // animate .slide to new position
                container.find(".slide").animate({left: next_position}, plugin.settings.speed).promise().done(function () { 
                    plugin.settings.state = "static"; 
                    // call on after function
                    plugin.settings.on_after.call(this);                   
                });
                // update active position 
                
            }
            // for test purposes this will add the current position to .slide
            container.find(".slide").attr("id",plugin.settings.position);
        }

        var left = function() {
			console.log(plugin.settings.position);
            // call on after function
            plugin.settings.on_before.call(this);
            // check if we are at position 0
            if(plugin.settings.position == 0) {
                var sum = 0 - ((plugin.settings.total_slider - 1) * plugin.settings.single_slide_width);
                var new_pos = 0 - ((plugin.settings.total_slider - 2) * plugin.settings.single_slide_width);
                plugin.settings.state = "moving";
                container.find(".slide").css("left", sum);
                plugin.settings.position = plugin.settings.total_slider - 2;
                // update active position 
                update_active(); 
                container.find(".slide").animate({left: new_pos}, plugin.settings.speed).promise().done(function () { 
                    plugin.settings.state = "static";
                }); 

            } else {
                // we are not at the start of the slide yet so move to previous slide
                // decrease settings.position
                plugin.settings.position--;
                // update active position 
                update_active(); 
                // calculate the previous position for .slide
                var previous_position = 0 - (plugin.settings.position * plugin.settings.single_slide_width);
                // set state as moving
                plugin.settings.state = "moving";
                // animate .slide to new position
                container.find(".slide").animate({left: previous_position}, plugin.settings.speed).promise().done(function () {
                        plugin.settings.state = "static";
                        // call on after function
                        plugin.settings.on_after.call(this);
                });
            }
            container.find(".slide").attr("id",plugin.settings.position);            
        }

        var controls_setup = function() {
            // add control buttons
            container.find("#peach_slider").append( "<div class='left'></div>" );
            container.find("#peach_slider").append( "<div class='right'></div>" );
            // add click events
            container.find(".right" ).click(
              function() {
                if(plugin.settings.state == "static") {
                    right();
                }             
              }
            );
        
            container.find(".left" ).click(
              function() {
                if(plugin.settings.state == "static") {
                    left();
                }
              }
            );
        }

        var init_resize = function() {

            plugin.settings.container_width = container.outerWidth();
            // Treat each element in .slide
            plugin.settings.height = 0;
            container.find(".slide").children().each(function(index) {
                // Set each element to be the current width
                $(this).width(container.find('.ps_container').outerWidth());
                // set single slide width
                plugin.settings.single_slide_width = container.find('.ps_container').outerWidth();
                // calculate the total width of each slide
                plugin.settings.slide_width = plugin.settings.slide_width + $(this).outerWidth();
                if($(this).outerHeight() > plugin.settings.height) {
                    plugin.settings.height = $(this).outerHeight();
                }
                if(plugin.settings.transition == "slide") {
                    // float left to line up each slide
                    $(this).css("float", "left");
                } else if(plugin.settings.transition == "fade") {
                    $(this).css("position", "relative");
                    $(this).css("left", 0);
                }
            });
            // set .slide total width
            container.find(".slide").width(plugin.settings.slide_width);
            // set .slide total height
            container.find('.ps_container').css("height", plugin.settings.height);
            // run slider setup
            container.find(".slide").css("left", 0);
            // resize captions
            //var captions = (plugin.settings.captions == true ? captions_setup() : null);
            update_active();
        }

        var setup = function() {
            // if controls is set as true run controls setup
            var controls = (plugin.settings.controls == true ? controls_setup() : null);
            // if pager is set as true run pager setup
            var pager = (plugin.settings.pager == true ? pager_setup() : null);
            // if thumbnails is set as true run thumbnail setup
            var thumbnails = (plugin.settings.thumbnails == true ? thumbnails_setup() : null);
            // if autoplay is set as true run autoplay setup
            var autoplay = (plugin.settings.autoplay == true ? autoplay_setup() : null);
            // if progress is set as true run progress_bar_setup
            var progress_bar = (plugin.settings.progress_bar == true ? progress_bar_setup() : null);
            // if captions is set as true run captions setup
            //var captions = (plugin.settings.captions == true ? captions_setup() : null);
            // if progress bar is set as true run progress_bar
            var progress_bar = (plugin.settings.progress_bar == true ? init_progress_bar() : null);
        }

        var init = function() {
            // init settings and compile user options
            plugin.settings = $.extend({
                on_load: function() {}, 
                on_before: function() {},
                on_after: function() {}
            }, defaults, options);            
            // Get the current with of the target element
            plugin.settings.container_width = container.outerWidth();
            // Add #peach_slider wrapper layers to contain the slides which will be contained in the slider
            container.wrapInner( "<div id='peach_slider'><div class='ps_container'><div class='slide'></div></div></div>");
            // Clone the first slide element incase the slider is set to loop
            var first = container.find(".slide").children().first().clone().addClass('end');
            // Append the cloned slide to the end of the .slide element
            first.appendTo( ".slide" ); 
            // Treat each element in .slide
            container.find(".slide").children().each(function(index) {
                // Set each element to be the current width
                $(this).width(container.find('.ps_container').outerWidth());
                // set single slide width
                plugin.settings.single_slide_width = container.find('.ps_container').outerWidth();
                // calculate the total width of each slide
                plugin.settings.slide_width = plugin.settings.slide_width + $(this).outerWidth();
                if($(this).outerHeight() > plugin.settings.height) {
                    plugin.settings.height = $(this).outerHeight();
                }
                if(plugin.settings.transition == "slide") {
                    // float left to line up each slide
                    $(this).css("float", "left");
                } else if(plugin.settings.transition == "fade") {
                    $(this).css("position", "relative");
                    $(this).css("left", 0);
                }
                $(this).attr("id", index);
                // increment the total slider width by one to calculate the total number of slides
                plugin.settings.total_slider++;
            });
            // set .slide total width
            container.find(".slide").width(plugin.settings.slide_width);
            // set .slide total height
            container.find('.ps_container').css("height", plugin.settings.height);
            // run slider setup
            setup();
            // add event for window resize
            $( window ).resize(function() {
                init_resize();
            });
            plugin.settings.on_load.call(this);
        }

        plugin.foo_public_method = function() {
            // code goes here
        }

        var foo_private_method = function() {
            // code goes here
            // callbacks
            plugin.settings.onready.call(this);
        }

        init();

    }

})(jQuery);