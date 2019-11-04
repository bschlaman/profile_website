window.onload=function(){
    // Declare global vaiables
    navHighlight();
//    navigationSection();

    setOpenNewTab();
}

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

var navHighlight = function(){

    let navAnchors = document.querySelectorAll("#main-menu ul li a");
    for (let i = 0 ; i < navAnchors.length ; i++){
        navAnchors[i].onclick = function() {
            let items = navAnchors;
            for (let i = 0 ; i < items.length ; i++){
                items[i].parentElement.classList.remove('active');
            }
            this.parentElement.classList.add('active')
        }
    }
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


}


var navActive = function(section) {

    var $el = $('#navbar > ul');
    $el.find('li').removeClass('active');
    $el.each(function(){
        $(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
    });

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

