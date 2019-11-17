window.onload=function(){
    // Declare global vaiables
    navHighlight();
//    navigationSection();

    setOpenNewTab();
}

// Forces all links to open to a new tab except for the navigation anchors
var setOpenNewTab = function(){
    let navAnchors = document.querySelectorAll("#navbar a");
    for (let i = 0 ; i < navAnchors.length ; i++){
        navAnchors[i].classList.add('no-new-tab');
    }
    let otherAnchors = document.querySelectorAll("a:not(.no-new-tab)");
    for (let i = 0 ; i < otherAnchors.length ; i++){
        otherAnchors[i].target = "_blank";
    }
}

// Adds onlick function to all nav anchors to highlight them when clicked.  Will probably disable this in favor of the scroll activation method
var navHighlight = function(){
    let navAnchors = document.querySelectorAll("#main-menu ul li a");
    for (let i = 0 ; i < navAnchors.length ; i++){
        navAnchors[i].addEventListener("click", function() {
            document.getElementById(this.innerHTML.toLowerCase()).scrollIntoView({ behavior: 'smooth' });
            //smoothScroll(document.getElementById(this.innerHTML.toLowerCase()));
            // for (let i = 0 ; i < navAnchors.length ; i++){
            //     navAnchors[i].parentElement.classList.remove('active');
            // }
            // this.parentElement.classList.add('active');
        });
    }
}


var navActive = function(section) {

    var $el = $('#navbar > ul');
    $el.find('li').removeClass('active');
    $el.each(function(){
        $(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
    });

}

// Finds which element is active near the middle of the screen and sets corresponding li to active
window.addEventListener("scroll", () => {
    let sections = document.querySelectorAll("section");
    let elem = null;
    let scrollOffset = 0.5;//determines how far up the the page the element needs to be before triggering the function
    for (let i = 0 ; i < sections.length ; i++){
        let triggerLine = sections[i].getBoundingClientRect().top + window.scrollY - (window.innerHeight * scrollOffset);
        if (window.pageYOffset > triggerLine && window.pageYOffset < triggerLine + sections[i].clientHeight){
            let navAnchors = document.querySelectorAll("#main-menu ul li a");
            for (let j = 0 ; j < navAnchors.length ; j++){
                if (sections[i].id == navAnchors[j].innerHTML.toLowerCase()){
                    navAnchors[j].parentElement.classList.add('active');
                } else { navAnchors[j].parentElement.classList.remove('active'); }
            }
        }
    }
});

var smoothScroll = function(target) {
    var MIN_PIXELS_PER_STEP = 16;
    var MAX_SCROLL_STEPS = 30;
    //var target = document.getElementById(elementId);
    var scrollContainer = target;
    do {
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do {
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    var pixelsPerStep = Math.max(MIN_PIXELS_PER_STEP,
                                 (targetY - scrollContainer.scrollTop) / MAX_SCROLL_STEPS);

    var stepFunc = function() {
        scrollContainer.scrollTop =
            Math.min(targetY, pixelsPerStep + scrollContainer.scrollTop);

        if (scrollContainer.scrollTop >= targetY) {
            return;
        }

        window.requestAnimationFrame(stepFunc);
    };

    window.requestAnimationFrame(stepFunc);
}

var navigationSection = function() {

    var $section = $('section[data-section]');

    $section.waypoint(function(direction) {

        if (direction === 'down') {
            navActive($(this.element).data('section'));
        }
    }, {
        offset: '150px'
    });

    $section.waypoint(function(direction) {
        if (direction === 'up') {
            navActive($(this.element).data('section'));
        }
    }, {
        offset: function() { return -$(this.element).height() + 155; }
    });
};


var scrollShit = function() {
    //var element_position = $('#experience').offset().top;
    //var element_position = document.getElementById("music").getBoundingClientRect().top;
    var mus = document.getElementById("blog");
    var mustop = mus.getBoundingClientRect().top;
    var musrel = mustop + window.scrollY;
    var element_position = musrel;
    //var topPos = element.getBoundingClientRect().top + window.scrollY;
    //
    //var viewTop = viewportOffset.top;
    // var mus = document.getElementById("blog");
    // var mustop = mus.getBoundingClientRect().top;
    // var musrel = mustop + window.scrollY;
    // var element_position = musrel;
    // let scrollOffset = 0.5;//determines how far up the the page the element needs to be before triggering the function
    // var activation_point = element_position - (window.innerHeight * scrollOffset);
    // var max_scroll_height = document.body.clientHeight - screen_height - 5;//-5 for a little bit of buffer
    // var y_scroll_pos = window.pageYOffset;

    // var element_in_view = y_scroll_pos > activation_point && y_scroll_pos < activation_point+mus.clientHeight;
    // var has_reached_bottom_of_page = max_scroll_height <= y_scroll_pos && !element_in_view;

    // if(element_in_view || has_reached_bottom_of_page) {
    //     console.log('asdf');
    // }
    var screen_height = window.innerHeight;
    var activation_offset = 0.5;//determines how far up the the page the element needs to be before triggering the function
    var activation_point = element_position - (screen_height * activation_offset);
    var max_scroll_height = document.body.clientHeight - screen_height - 5;//-5 for a little bit of buffer
}
//Does something when user scrolls to it OR
//Does it when user has reached the bottom of the page and hasn't triggered the function yet
    //$('#text-center a:not([class="external"])').click(function(event){
    //    var section = $(this).data('nav-section'),
    //        navbar = $('#navbar');
    //        if ( $('[data-section="' + section + '"]').length ) {
    //            $('html, body').animate({
    //                scrollTop: $('[data-section="' + section + '"]').offset().top - 55
    //            }, 500);
    //       }

    //    if ( navbar.is(':visible')) {
    //        navbar.removeClass('in');
    //        navbar.attr('aria-expanded', 'false');
    //        $('.js-colorlib-nav-toggle').removeClass('active');
    //    }

    //    event.preventDefault();
    //    return false;
    //});

