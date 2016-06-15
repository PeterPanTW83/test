var map;
var jsonData;
var markers = [];
var image = 'img/marker-movie.png';

function initMap() {
    map = new google.maps.Map(document.getElementById('map-list'), {
        center: { lat: 22.73281, lng: 120.287898 },
        zoom: 9
    });
    includeData();
}

function includeData() {
    $.getJSON('https://raw.githubusercontent.com/beibeihuang/test/gh-pages/js/movie.json', function(Data) {
        jsonData = Data;
        for (var i = 0; i < jsonData.length; i++) {
            var dataTitle = jsonData[i].title;
            var locationLati = jsonData[i].showInfo[0].latitude;
            var locationLng = jsonData[i].showInfo[0].longitude;
            var dataCoordinates = { lat: Number(locationLati), lng: Number(locationLng) };
            createMarkers(dataCoordinates, dataTitle, jsonData[i].showInfo[0].location);
            $('#list').append('<a href="javascript:focusLocation(\'' + i + '\')"><li class="clearfix"><img src="img/movie.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><p><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].time + '~' + jsonData[i].showInfo[0].endTime + '</p><p><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].locationName + '</p><p><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].location + '</p><a href="javascript:sweetAlert()" class="add-calendar">日曆</a></div></li></a>');
        }
    });
}

function createMarkers(dataCoordinates, dataTitle, address) {
    var marker = new google.maps.Marker({
        position: dataCoordinates,
        title: dataTitle,
        icon: image
    });

    var infoWindow = new google.maps.InfoWindow({
        content: '活動名稱:' + dataTitle + '<br>' + '地址:' + address
    });

    marker.setMap(map);
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

function search() {
    var activityTitle = document.getElementById("name").value;
    var activityLocation = document.getElementById("location").value;
    var activityStartTime = Number(document.getElementById("starttime").value.replace(/-/g, ""));
    var activityEndTime = Number(document.getElementById("endtime").value.replace(/-/g, ""));
    var activityCity = document.getElementById("city").value;
    var activityDistrict = document.getElementById("district").value;

    var tempData = [];
    var tempData1 = [];

    $('#list').html("");
    deleteMarkers();

    if (activityTitle != null) {
        for (var i = 0; i < jsonData.length; i++) {
            var dataTitle = jsonData[i].title;
            if (dataTitle.match(activityTitle) != null) {
                tempData.push(jsonData[i]);
            }
        }
    } else {
        tempData = jsonData;
    }

    if (activityLocation != null) {
        for (var i = 0; i < tempData.length; i++) {
            var dataLocation = tempData[i].showInfo[0].locationName;
            if (dataLocation.match(activityLocation) != null) {
                tempData1.push(tempData[i]);
                console.log(tempData[i].showInfo[0].locationName);
            }
        }
    } else {
        tempData1 = tempData;
    }
    tempData = [];
    if (activityCity != "" && activityDistrict != "") {
        for (var i = 0; i < tempData1.length; i++) {
            var dataaddress = tempData1[i].showInfo[0].location;
            if (dataaddress.match(activityCity + activityDistrict)) {
                tempData.push(tempData1[i]);

            }
        }
    } else if (activityCity != "" && activityDistrict == "") {
        for (var i = 0; i < tempData1.length; i++) {
            var dataaddress = tempData1[i].showInfo[0].location;
            if (dataaddress.match(activityCity)) {
                tempData.push(tempData1[i]);
            }
        }

    } else if (activityCity == "" && activityDistrict != "") {
        for (var i = 0; i < tempData1.length; i++) {
            var dataaddress = tempData1[i].showInfo[0].location;
            if (dataaddress.match(activityDistrict)) {
                tempData.push(tempData1[i]);
            }
        }
    } else {
        tempData = tempData1;

    }
    tempData1 = [];
    if (activityStartTime != 0 && activityEndTime != 0) {
        for (var i = 0; i < tempData.length; i++) {
            var dataStartTime = Number(tempData[i].showInfo[0].time.substr(0, 10).replace(/\//g, ""));
            var dataEndTime = Number(tempData[i].showInfo[0].endTime.substr(0, 10).replace(/\//g, ""));
            if (dataStartTime < activityStartTime) {
                if (dataEndTime >= activityStartTime) {
                    tempData1.push(tempData[i]);
                }
            } else if (dataStartTime > activityStartTime) {
                if (dataStartTime <= activityEndTime) {
                    tempData1.push(tempData[i]);
                }
            } else {
                tempData1.push(tempData[i]);
            }
        }
    } else if (activityStartTime != 0 && activityEndTime == 0) {
        for (var i = 0; i < tempData.length; i++) {
            var dataStartTime = Number(tempData[i].showInfo[0].time.substr(0, 10).replace(/\//g, ""));
            var dataEndTime = Number(tempData[i].showInfo[0].endTime.substr(0, 10).replace(/\//g, ""));
            if (activityStartTime <= dataEndTime) {
                tempData1.push(tempData[i]);
            }
        }
    } else if (activityStartTime == 0 && activityEndTime != 0) {
        for (var i = 0; i < tempData.length; i++) {
            var dataStartTime = Number(tempData[i].showInfo[0].time.substr(0, 10).replace(/\//g, ""));
            var dataEndTime = Number(tempData[i].showInfo[0].endTime.substr(0, 10).replace(/\//g, ""));
            if (activityEndTime >= dataStartTime) {
                tempData1.push(tempData[i]);
            }
        }
    } else {
        tempData1 = tempData;
    }



    for (var i = 0; i < tempData1.length; i++) {
        var dataTitle = tempData1[i].title;
        var dataLocationName = tempData1[i].showInfo[0].locationName;
        var locationLati = tempData1[i].showInfo[0].latitude;
        var locationLng = tempData1[i].showInfo[0].longitude;
        var dataCoordinates = { lat: Number(locationLati), lng: Number(locationLng) };

        createMarkers(dataCoordinates, dataTitle, tempData1[i].showInfo[0].location);

        $('#list').append('<a href="javascript:focusLocation(\'' + i + '\')"><li class="clearfix"><img src="img/movie.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><p><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].time + '~' + tempData1[i].showInfo[0].endTime + '</p><p><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].locationName + '</p><p><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].location + '</p><a href="javascript:sweetAlert()" class="add-calendar">日曆</a></div></li></a>');
    }
    $('.filter').hide();
}

function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function focusLocation(markerCount) {
    var focusMarker = markers[markerCount];
    map.panTo(focusMarker.getPosition());
    map.setZoom(15);
    $('.filter').hide();
}

function geoFindMe() {

    if (!navigator.geolocation) {
        alert("很抱歉，您的瀏覽器不支援定位服務");
        return;
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        initMap(latitude, longitude);
    };

    function error() {
        alert("定位時發生錯誤，請稍後再試");
    };
    navigator.geolocation.getCurrentPosition(success, error);
}

var CLIENT_ID = '998871371950-c95ffdeu6pee5bal5l4pmio9911gjdva.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar"];

function checkAuth() {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        loadCalendarApi();
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: false
    }, handleAuthResult);
    return false;
}

function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', createEvent);
}

function createEvent() {
    var event = {
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
            'dateTime': '2016-06-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
        },
        'end': {
            'dateTime': '2016-06-28T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
        },
        'reminders': {
            'useDefault': true,
        }
    };

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });

    request.execute(function(event) {
        swal({
            title: "完成",
            text: "活動已經新增至您的日曆中<br><a href='"+event.htmlLink+"'>查看日曆</a>",
            type: "success",
            closeOnConfirm: true
        });
    });
}

function sweetAlert() {
    swal({
        title: "新增日曆活動",
        text: "請問您是否要新增此活動至Google日曆？",
        imageUrl: "img/calendar.png",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "同意",
        closeOnConfirm: true
    }, function() {
        handleAuthClick(event);
    });
}

$(document).ready(function() {
    $('.add-calendar').click(function() {
        swal("hello world");
    });
});

jQuery(document).ready(function($) {

    $('.btn-filter').on('click', function() {
        $('.filter').toggle();
    });

    /*   $('.add-calendar').on('click', function(){
           swal({   title: "Sweet!",   text: "請問您是否同意新增此活動至Google日曆？",   imageUrl: "img/calendar.png" });
       });*/

    $(".add-calendar").click(function(event) {
        location.href = "https://www.google.com";
        event.stopPropagation();
    });

    $("li").click(function() {
        location.href = "https://www.facebook.com";
    });

    $('#form').dk_tw_citySelector('#city', '#district', '#zipcode');

});
