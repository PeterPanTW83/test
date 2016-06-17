var map;
var markers = [];
var activity;
var isSearch = false;
var jsonData;
var searchResult

function initMap() {
    map = new google.maps.Map(document.getElementById('map-list'), {
        center: { lat: 23.973875, lng: 120.982024 },
        zoom: 8
    });
    includeData();
}

function includeData() {
    jsonData = JSON.parse(localStorage.getItem("jsonData"));
    if (jsonData == null) {
        $.getJSON('https://raw.githubusercontent.com/beibeihuang/test/gh-pages/js/all.json', function(data) {
            
            var date=new Date();
            var TodayY=date.getFullYear();
            console.log(TodayY);
            var TodayM=date.getMonth()+1;
            console.log(TodayM);
            var TodayD=date.getDate();
            console.log(TodayD);
            jsonData = [];

            console.log(data.length);

            for (var i = 0; i < data.length; i++) {
                console.log(data[i].showInfo[0].time);
                if(data[i].showInfo[0].time == "" || data[i].showInfo[0].endTime == "" || data[i].showInfo[0].latitude == ""){
                    continue;
                }
                var rawDataEndTimeY=Number(data[i].showInfo[0].endTime.substr(0, 4));
                var rawDataEndTimeM=Number(data[i].showInfo[0].endTime.substr(5, 2));
                var rawDataEndTimeD=Number(data[i].showInfo[0].endTime.substr(8, 2));
                var rawDataLat=data[i].showInfo[0].latitude;

                if(rawDataEndTimeY>TodayY){
                    jsonData.push(data[i]);
                    jsonData[jsonData.length-1].favorite = false;
                }else if(rawDataEndTimeY==TodayY){
                    if(rawDataEndTimeM>TodayM){
                        jsonData.push(data[i]);
                        jsonData[jsonData.length-1].favorite = false;
                    }else if(rawDataEndTimeD>=TodayD){
                        jsonData.push(data[i]);
                        jsonData[jsonData.length-1].favorite = false;
                    }
                }
            }
            jsonData.sort(SortByDate);
            localStorage.setItem("jsonData", JSON.stringify(jsonData));
            showData(jsonData);
        });
    } else {
        showData(jsonData);
    }

}

function showData(data) {
    for (var i = 0; i < data.length; i++) {
        var dataTitle = data[i].title;
        var dataStartTime = data[i].showInfo[0].time;
        var dataEndTime = data[i].showInfo[0].endTime;
        var dataLati = data[i].showInfo[0].latitude;
        var dataLng = data[i].showInfo[0].longitude;
        var dataCoordinates = { lat: Number(dataLati), lng: Number(dataLng) };
        var dataLocation = data[i].showInfo[0].location;
        var dataLocationName = data[i].showInfo[0].locationName;
        var dataCategory = data[i].category;
        var dataFavorite = data[i].favorite;
        createMarkers(dataCoordinates, dataTitle, dataLocation, dataCategory);
        var dataImageUrl;
        var dataFavoriteHtml;
        switch (dataCategory) {
            case "2":
                dataImageUrl = "img/drama.png";
                break;
            case "3":
                dataImageUrl = "img/dance.png";
                break;
            case "5":
                dataImageUrl = "img/music.png";
                break;
            case "8":
                dataImageUrl = "img/movie.png";
                break;
            case "4":
                dataImageUrl = "img/children.png";
                break;
        }
        if (dataFavorite) {
            dataFavoriteHtml = '<img src="img/heart.png">已收藏';
        } else {
            dataFavoriteHtml = '<img src="img/empty-heart.png">未收藏';
        }
        $('#list').append('<li><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><img src="' + dataImageUrl + '" class="photo"><div class="activity-info"><h2>' + dataTitle + '</h2><ul><li><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>' + dataStartTime + '~' + dataEndTime + '</li><li><i class="fa fa-home fa-lg" aria-hidden="true"></i>' + dataLocationName + '</li><li><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>' + dataLocation + '</li></ul><div class="activity-btn"><button onclick="changeFavorite(\'' + i + '\', $(this))" class="favorite">' + dataFavoriteHtml + '</button><button onclick="" class="route"><img src="img/route.png">路線規劃</button><button onclick="Dialog(\'' + i + '\')" class="add-calendar"><img src="img/min-calendar.png">加至Google日曆</button></div></div></a></li>');
    }
}

function SortByDate(x, y) {
    return Number(x.showInfo[0].time.substr(0, 10).replace(/\//g, "")) - Number(y.showInfo[0].time.substr(0, 10).replace(/\//g, ""));
}

function createMarkers(dataCoordinates, dataTitle, dataLocation, dataCategory) {
    var dataImageUrl;

    switch (dataCategory) {
        case "2":
            dataImageUrl = "img/marker-drama.png";
            break;
        case "3":
            dataImageUrl = "img/marker-dance.png";
            break;
        case "5":
            dataImageUrl = "img/marker-music.png";
            break;
        case "8":
            dataImageUrl = "img/marker-movie.png";
            break;
        case "4":
            dataImageUrl = "img/marker-children.png";
            break;
    }

    var marker = new google.maps.Marker({
        position: dataCoordinates,
        title: dataTitle,
        icon: dataImageUrl
    });

    var infoWindow = new google.maps.InfoWindow({
        content: '活動名稱:' + dataTitle + '<br>' + '地址:' + dataLocation
    });

    marker.setMap(map);
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

function focusLocation(markerCount) {
    var focusMarker = markers[markerCount];
    map.panTo(focusMarker.getPosition());
    map.setZoom(15);
    $('.filter').hide();
}

function changeFavorite(dataCount, dataElemet) {
    var selectData;
    if (isSearch) {
        selectData = searchResult;
    } else {
        selectData = jsonData;
    }

    if (dataElemet.text() == "未收藏") {
        dataElemet.html('<img src="img/heart.png">已收藏');
        var selectDataUID = selectData[dataCount].UID;
        jsonData = JSON.parse(localStorage.getItem("jsonData"));
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].UID == selectDataUID) {
                jsonData[i].favorite = true;
                localStorage.setItem("jsonData", JSON.stringify(jsonData));
                return;
            }
        }


    } else {
        dataElemet.html('<img src="img/empty-heart.png">未收藏');
        var selectDataUID = selectData[dataCount].UID;
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].UID == selectDataUID) {
                jsonData[i].favorite = false;
                localStorage.setItem("jsonData", JSON.stringify(jsonData));
                return;
            }
        }
    }
}

function search() {

    isSearch = true;
    var activityTitle = document.getElementById("name").value;
    var activityLocation = document.getElementById("location").value;
    var activityStartTime = Number(document.getElementById("starttime").value.replace(/-/g, ""));
    var activityEndTime = Number(document.getElementById("endtime").value.replace(/-/g, ""));
    var activityCity = document.getElementById("city").value;
    var activityDistrict = document.getElementById("district").value;
    var activityType = document.getElementById("type").value;

    searchResult = [];
    var tempData = [];

    $('#list').html("");
    deleteMarkers();

    if (activityType == "concert") {
        for (var i = 0; i < jsonData.length; i++) {
            var dataType = jsonData[i].category;
            if (dataType == "17") {
                searchResult.push(jsonData[i]);
            }
        }
    } else if (activityType == "music") {
        for (var i = 0; i < jsonData.length; i++) {
            var dataType = jsonData[i].category;
            if (dataType == "5") {
                searchResult.push(jsonData[i]);
            }
        }
    } else if (activityType == "drama") {
        for (var i = 0; i < jsonData.length; i++) {
            var dataType = jsonData[i].category;
            if (dataType == "2") {
                searchResult.push(jsonData[i]);
            }
        }
    } else if (activityType == "dance") {
        for (var i = 0; i < jsonData.length; i++) {
            var dataType = jsonData[i].category;
            if (dataType == "3") {
                searchResult.push(jsonData[i]);
            }
        }
    } else if (activityType == "movie") {
        for (var i = 0; i < jsonData.length; i++) {
            var dataType = jsonData[i].category;
            if (dataType == "8") {
                searchResult.push(jsonData[i]);
            }
        }
    } else if (activityType == "children") {
        for (var i = 0; i < jsonData.length; i++) {
            var dataType = jsonData[i].category;
            if (dataType == "4") {
                searchResult.push(jsonData[i]);
            }
        }
    } else {
        searchResult = jsonData;
    }


    if (activityTitle != null) {
        for (var i = 0; i < searchResult.length; i++) {
            var dataTitle = searchResult[i].title;
            if (dataTitle.match(activityTitle) != null) {
                tempData.push(searchResult[i]);
            }
        }
    } else {
        tempData = searchResult;
    }
    searchResult = [];
    if (activityLocation != null) {
        for (var i = 0; i < tempData.length; i++) {
            var dataLocation = tempData[i].showInfo[0].locationName;
            if (dataLocation.match(activityLocation) != null) {
                searchResult.push(tempData[i]);
            }
        }
    } else {
        searchResult = tempData;
    }
    tempData = [];
    if (activityCity != "" && activityDistrict != "") {
        for (var i = 0; i < searchResult.length; i++) {
            var dataaddress = searchResult[i].showInfo[0].location;
            if (dataaddress.match(activityCity + activityDistrict)) {
                tempData.push(searchResult[i]);

            }
        }
    } else if (activityCity != "" && activityDistrict == "") {
        for (var i = 0; i < searchResult.length; i++) {
            var dataaddress = searchResult[i].showInfo[0].location;
            if (dataaddress.match(activityCity)) {
                tempData.push(searchResult[i]);
            }
        }

    } else if (activityCity == "" && activityDistrict != "") {
        for (var i = 0; i < searchResult.length; i++) {
            var dataaddress = searchResult[i].showInfo[0].location;
            if (dataaddress.match(activityDistrict)) {
                tempData.push(searchResult[i]);
            }
        }
    } else {
        tempData = searchResult;

    }
    searchResult = [];
    if (activityStartTime != 0 && activityEndTime != 0) {
        for (var i = 0; i < tempData1.length; i++) {
            var dataStartTime = Number(tempData[i].showInfo[0].time.substr(0, 10).replace(/\//g, ""));
            var dataEndTime = Number(tempData[i].showInfo[0].endTime.substr(0, 10).replace(/\//g, ""));
            if (dataStartTime < activityStartTime) {
                if (dataEndTime >= activityStartTime) {
                    searchResult.push(tempData[i]);
                }
            } else if (dataStartTime > activityStartTime) {
                if (dataStartTime <= activityEndTime) {
                    searchResult.push(tempData[i]);
                }
            } else {
                searchResult.push(tempData[i]);
            }
        }
    } else if (activityStartTime != 0 && activityEndTime == 0) {
        for (var i = 0; i < tempData.length; i++) {
            var dataStartTime = Number(tempData[i].showInfo[0].time.substr(0, 10).replace(/\//g, ""));
            var dataEndTime = Number(tempData[i].showInfo[0].endTime.substr(0, 10).replace(/\//g, ""));
            if (activityStartTime <= dataEndTime) {
                searchResult.push(tempData[i]);
            }
        }
    } else if (activityStartTime == 0 && activityEndTime != 0) {
        for (var i = 0; i < tempData.length; i++) {
            var dataStartTime = Number(tempData[i].showInfo[0].time.substr(0, 10).replace(/\//g, ""));
            var dataEndTime = Number(tempData[i].showInfo[0].endTime.substr(0, 10).replace(/\//g, ""));
            if (activityEndTime >= dataStartTime) {
                searchResult.push(tempData[i]);
            }
        }
    } else {
        searchResult = tempData;
    }
    searchResult.sort(SortByDate);

    if (searchResult.length == 0) {
        $('.info').css('overflow', 'hidden');
        $('.info').append('<div class="noresult"><img src="img/noresult.png"><h2>查無任何符合之活動！</h2></div>');
    } else {
        showData(searchResult);
    }
    $('.filter').hide();
}

function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
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
        selectData = searchResult;
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

function showFavorite() {

    $('#list').html("");
    deleteMarkers();
    var favoriteData = [];
    jsonData = JSON.parse(localStorage.getItem("jsonData"));
    for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].favorite) {
            favoriteData.push(jsonData[i]);
        }
    }
    showData(favoriteData);
}

jQuery(document).ready(function($) {

    $('.btn-filter').on('click', function() {
        $('.filter').toggle();
    });

    $('#form').dk_tw_citySelector('#city', '#district', '#zipcode');

});
