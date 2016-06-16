var map;
var jsonData;
var markers = [];
var activity;
var isSearch = false;
var tempData1;

function initMap() {
    map = new google.maps.Map(document.getElementById('map-list'), {
        center: { lat: 22.73281, lng: 120.287898 },
        zoom: 9
    });
    includeData();
}

function includeData() {
    $.getJSON('https://raw.githubusercontent.com/beibeihuang/test/gh-pages/js/all.json', function(Data) {
        jsonData = Data;
        jsonData.sort(SortByDate);
        for (var i = 0; i < jsonData.length; i++) {
            var dataTitle = jsonData[i].title;
            var locationLati = jsonData[i].showInfo[0].latitude;
            var locationLng = jsonData[i].showInfo[0].longitude;
            var dataCoordinates = { lat: Number(locationLati), lng: Number(locationLng) };
            createMarkers(dataCoordinates, dataTitle, jsonData[i].showInfo[0].location, jsonData[i].category);
            if (jsonData[i].category == 8) {
                $('#list').append('<li><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><img src="img/movie.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><ul><li><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].time + '~' + jsonData[i].showInfo[0].endTime + '</li><li><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].locationName + '</li><li><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].location + '</li></ul><div class="submenu"><button onclick="addFavorite(\'' + i + '\'); $(this).children(\'img\').attr(\'src\', \'img/heart.png\');" class="favorite"><img src="img/empty-heart.png">未收藏</button><button onclick="" class="route"><img src="img/route.png">路線規劃</button><button onclick="Dialog(\'' + i + '\')" class="add-calendar"><img src="img/min-calendar.png">加至Google日曆</button></div></div></a></li>');
            } else {
                $('#list').append('<li><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><img src="img/exhibition.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><ul><li><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].time + '~' + jsonData[i].showInfo[0].endTime + '</li><li><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].locationName + '</li><li><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + jsonData[i].showInfo[0].location + '</li></ul><div class="submenu"><button onclick="addFavorite(\'' + i + '\'); $(this).children(\'img\').attr(\'src\', \'img/heart.png\');" class="favorite"><img src="img/empty-heart.png">未收藏</button><button onclick="" class="route"><img src="img/route.png">路線規劃</button><button onclick="Dialog(\'' + i + '\')" class="add-calendar"><img src="img/min-calendar.png">加至Google日曆</button></div></div></a></li>');
            }
        }
    });
}

function SortByDate(x, y) {
    return Number(x.showInfo[0].time.substr(0, 10).replace(/\//g, "")) - Number(y.showInfo[0].time.substr(0, 10).replace(/\//g, ""));
}

function createMarkers(dataCoordinates, dataTitle, address, category) {
    var image;
    if (category == 8) {
        image = 'img/marker-movie.png';
    } else {
        image = 'img/marker-exhibition.png';
    }

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
    isSearch = true;
    var activityTitle = document.getElementById("name").value;
    var activityLocation = document.getElementById("location").value;
    var activityStartTime = Number(document.getElementById("starttime").value.replace(/-/g, ""));
    var activityEndTime = Number(document.getElementById("endtime").value.replace(/-/g, ""));
    var activityCity = document.getElementById("city").value;
    var activityDistrict = document.getElementById("district").value;

    var tempData = [];
    tempData1 = [];

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
    tempData1.sort(SortByDate);

    if (tempData1.length == 0) {
        $('#list').append('<div class="noresult"><img src="img/noresult.png"><h2>查無任何符合之活動！</h2></div>');
    }

    for (var i = 0; i < tempData1.length; i++) {
        var dataTitle = tempData1[i].title;
        var dataLocationName = tempData1[i].showInfo[0].locationName;
        var locationLati = tempData1[i].showInfo[0].latitude;
        var locationLng = tempData1[i].showInfo[0].longitude;
        var dataCoordinates = { lat: Number(locationLati), lng: Number(locationLng) };

        createMarkers(dataCoordinates, dataTitle, tempData1[i].showInfo[0].location);

        if (tempData1[i].category == 8) {
            $('#list').append('<li><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><img src="img/movie.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><ul><li><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].time + '~' + tempData1[i].showInfo[0].endTime + '</li><li><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].locationName + '</li><li><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].location + '</li></ul><div class="submenu"><button onclick="addFavorite(\'' + i + '\'); $(this).children(\'img\').attr(\'src\', \'img/heart.png\');" class="favorite"><img src="img/empty-heart.png">未收藏</button><button onclick="" class="route"><img src="img/route.png">路線規劃</button><button onclick="Dialog(\'' + i + '\')" class="add-calendar"><img src="img/min-calendar.png">加至Google日曆</button></div></div></a></li>');
        } else {
            $('#list').append('<li><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><img src="img/exhibition.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><ul><li><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].time + '~' + tempData1[i].showInfo[0].endTime + '</li><li><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].locationName + '</li><li><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + tempData1[i].showInfo[0].location + '</li></ul><div class="submenu"><button onclick="addFavorite(\'' + i + '\'); $(this).children(\'img\').attr(\'src\', \'img/heart.png\');" class="favorite"><img src="img/empty-heart.png">未收藏</button><button onclick="" class="route"><img src="img/route.png">路線規劃</button><button onclick="Dialog(\'' + i + '\')" class="add-calendar"><img src="img/min-calendar.png">加至Google日曆</button></div></div></a></li>');
        }
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
    } else {
        handleAuthClick(event);
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

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': activity
    });

    request.execute(function(event) {
        swal({
            title: "完成",
            text: "活動已經新增至您的日曆中<br><a href='" + event.htmlLink + "' target='_new'><img src='img/calendar.png' width='23px' height='23px'>查看日曆</a>",
            type: "success",
            closeOnConfirm: true,
            html: true
        });
    });
}

function Dialog(dataCount) {

    var selectData;
    if (isSearch) {
        selectData = tempData1;
    } else {
        selectData = jsonData;
    }

    var startDateTime = selectData[dataCount].showInfo[0].time.replace(" ", "T");
    var endDateTime = selectData[dataCount].showInfo[0].endTime.replace(" ", "T");
    startDateTime = startDateTime.replace(/\//g, "-");
    endDateTime = endDateTime.replace(/\//g, "-");

    activity = {
        'summary': selectData[dataCount].title,
        'location': selectData[dataCount].showInfo[0].location,
        'description': selectData[dataCount].descriptionFilterHtml,
        'end': {
            'dateTime': endDateTime + '+08:00',
            'timeZone': 'Asia/Taipei'
        },
        'start': {
            'dateTime': startDateTime + '+08:00',
            'timeZone': 'Asia/Taipei'
        },
        'reminders': {
            'useDefault': true
        }
    };

    swal({
        title: "新增日曆活動",
        text: "請問您是否要新增此活動至Google日曆？",
        imageUrl: "img/calendar.png",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonColor: "#12BDBC",
        confirmButtonText: "同意",
        closeOnConfirm: true
    }, function() {
        checkAuth();
    });
}

function addFavorite(i) {

    var favoriteData = JSON.parse(localStorage.getItem("favorite"));
    if (favoriteData == null) {
        favoriteData = [];
    }
    var selectData;
    if (isSearch) {
        selectData = tempData1;
    } else {
        selectData = jsonData;
    }
    favoriteData.push(selectData[i]);
    localStorage.setItem("favorite", JSON.stringify(favoriteData));
}

function showFavorite() {
    $('#list').html("");
    deleteMarkers();
    var favoriteData = JSON.parse(localStorage.getItem("favorite"));
    for (var i = 0; i < favoriteData.length; i++) {
        var dataTitle = favoriteData[i].title;
        var locationLati = favoriteData[i].showInfo[0].latitude;
        var locationLng = favoriteData[i].showInfo[0].longitude;
        var dataCoordinates = { lat: Number(locationLati), lng: Number(locationLng) };
        createMarkers(dataCoordinates, dataTitle, favoriteData[i].showInfo[0].location, favoriteData[i].category);
        if (favoriteData[i].category == 8) {
            $('#list').append('<li><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><img src="img/movie.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><ul><li><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + favoriteData[i].showInfo[0].time + '~' + favoriteData[i].showInfo[0].endTime + '</li><li><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + favoriteData[i].showInfo[0].locationName + '</li><li><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + favoriteData[i].showInfo[0].location + '</li></ul><div class="submenu"><button onclick="" class="favorite"><img src="img/heart.png">已收藏</button><button onclick="" class="route"><img src="img/route.png">路線規劃</button><button onclick="Dialog(\'' + i + '\')" class="add-calendar"><img src="img/min-calendar.png">加至Google日曆</button></div></div></a></li>');
        } else {
            $('#list').append('<li><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><img src="img/exhibition.png" class="photo"><div class="info"><h2>' + dataTitle + '</h2><ul><li><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + favoriteData[i].showInfo[0].time + '~' + favoriteData[i].showInfo[0].endTime + '</li><li><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + favoriteData[i].showInfo[0].locationName + '</li><li><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + favoriteData[i].showInfo[0].location + '</li></ul><div class="submenu"><button onclick="" class="favorite"><img src="img/heart.png">已收藏</button><button onclick="" class="route"><img src="img/route.png">路線規劃</button><button onclick="Dialog(\'' + i + '\')" class="add-calendar"><img src="img/min-calendar.png">加至Google日曆</button></div></div></a></li>');
        }
    }
}

jQuery(document).ready(function($) {

    $('.btn-filter').on('click', function() {
        $('.filter').toggle();
    });

    $('#form').dk_tw_citySelector('#city', '#district', '#zipcode');

});
