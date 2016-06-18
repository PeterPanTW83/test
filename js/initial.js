require.config({
    paths: {
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js',
        googleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA0UyOx-fxoHQGbHLnU9475buiCyfR28kQ',
        oms: 'js/oms.min.js',
        googleClient: 'https://apis.google.com/js/client.js',
        sweetAlert: 'js/sweetalert.min.js',
        taiwanCity: 'js/taiwan-city-selector.js',
        all: 'js/all.js'
    },

});

require(['jquery', 'googleMap', 'oms', 'googleClient', 'sweetAlert', 'taiwanCity', 'all'], function() {

    initMap();

    $('.btn-filter').on('click', function() {
        $('.filter').toggle();
    });

    $('#form').dk_tw_citySelector('#city', '#district', '#zipcode');

});
