require([
    ,
    '',
    '',
    '',
    '',
    '',
    ''
], function() {

    initMap();

    $('.btn-filter').on('click', function() {
        $('.filter').toggle();
    });

    $('#form').dk_tw_citySelector('#city', '#district', '#zipcode');
    
});
