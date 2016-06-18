require.config({
    paths: {
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min',
        googleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA0UyOx-fxoHQGbHLnU9475buiCyfR28kQ',
        oms: 'js/oms.min',
        googleClient: 'https://apis.google.com/js/client',
        sweetAlert: 'js/sweetalert.min',
        taiwanCity: 'js/taiwan-city-selector',
        all: 'js/all'
    },
    shim: {
        'taiwanCity': ['jquery'],
        'all': ['oms']
    }
});

require(['jquery', 'googleMap', 'oms', 'googleClient', 'sweetAlert', 'taiwanCity', 'all'], function() {

    initMap();

    $('.btn-filter').on('click', function() {
        $('.filter').toggle();
    });

    $('#form').dk_tw_citySelector('#city', '#district', '#zipcode');

});
