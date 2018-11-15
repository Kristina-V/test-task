$(document).ready(function(){
    $(".slider").slick({
        autoplay: true,
        dots: true,
        slidesToShow: 1,
        infinite: true,
        nextArrow: "<button type='button' class='slick-next'></button>",
        prevArrow: "<button type='button' class='slick-prev'></button>",
        customPaging: function(slider, i) {
            return $('<button type="button" />').text("");
        }
       
    });

    $(".review-slider").slick({
        dots: false,
        slidesToShow: 2,
        infinite: false,
        nextArrow: "<button type='button' class='slick-next'></button>",
        prevArrow: "<button type='button' class='slick-prev'></button>",
    });
});
