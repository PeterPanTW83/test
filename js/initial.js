require([
    'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyA0UyOx-fxoHQGbHLnU9475buiCyfR28kQ',
    'js/oms.min.js',
    'https://apis.google.com/js/client.js',
    'js/sweetalert.min.js',
    'js/taiwan-city-selector.js',
    'js/all.js'
], function() {
    require([
        'js/all.js'
    ], function() {

        initMap();

        $('.btn-filter').on('click', function() {
            $('.filter').toggle();
        });

        $('#form').dk_tw_citySelector('#city', '#district', '#zipcode');

    });
});
