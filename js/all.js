
	var map;
    var jsonData;
    var markers = [];
    var image = 'img/marker-movie.png';

    function initMap() {
        map = new google.maps.Map(document.getElementById('map-list'), {
            center: {lat: 22.73281, lng: 120.287898},
            zoom: 9
        });
        includeData();
    }

	function includeData(){
		$.getJSON('https://raw.githubusercontent.com/beibeihuang/test/gh-pages/js/movie.json', function(Data) {
			jsonData=Data;
   			for(var i = 0; i < jsonData.length; i++) {
                var dataTitle=jsonData[i].title;
                var locationLati=jsonData[i].showInfo[0].latitude;
                var locationLng=jsonData[i].showInfo[0].longitude;
                var dataCoordinates={lat:Number(locationLati), lng:Number(locationLng)};
                createMarkers(dataCoordinates, dataTitle, jsonData[i].showInfo[0].location);
                $('#list').append('<a href="javascript:focusLocation(\''+i+'\')"><li class="clearfix"><img src="img/movie.png" class="photo"><div class="info"><h2>'+dataTitle+'</h2><p><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>'+jsonData[i].showInfo[0].time+'~'+jsonData[i].showInfo[0].endTime+'</p><p><i class="fa fa-home fa-lg" aria-hidden="true"></i>'+jsonData[i].showInfo[0].locationName+'</p><p><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>'+jsonData[i].showInfo[0].location+'</p></div></li></a>');
            }
		});
	}

	function createMarkers(dataCoordinates, dataTitle, address){
        var marker = new google.maps.Marker({
            position: dataCoordinates,
            title:dataTitle,
            icon: image
        });

        var infoWindow = new google.maps.InfoWindow({
            content: '活動名稱:'+dataTitle+'<br>'+'地址:'+address
        });

        marker.setMap(map);
        marker.addListener('click', function(){
                infoWindow.open(map, marker);
        });

        markers.push(marker);
    }

    function search(){
        var activityTitle = document.getElementById("name").value;
        var activityLocation = document.getElementById("location").value;
        var activityStartTime = document.getElementById("starttime").value;
        var tempData = [];
        var tempData1 = [];
        var tempData2 = [];

        $('#list').html("");
        deleteMarkers();

        if(activityTitle!=null){
            for(var i = 0;i < jsonData.length; i++){
                var dataTitle=jsonData[i].title;
                if(dataTitle.match(activityTitle)!=null){
                    tempData.push(jsonData[i]);
                }
            }
        }else{
            tempData=jsonData;
        }

        if(activityLocation!=null){
            for(var i = 0;i < tempData.length; i++){
                var dataLocation=tempData[i].showInfo[0].locationName;
                if(dataLocation.match(activityLocation)!=null){
                    tempData1.push(tempData[i]);
                }
            }
        }else{
            tempData1=jsonData;
        }
        if(activityStartTime!=null){
            for(var i = 0;i <tempData1.length; i++){
                var dataStartTime=tempData1[i].showInfo[0].time;
                if(dataStartTime.match(activityStartTime)!=null){
                    tempData2.push(tempData1[i]);
                }
            }
        }else{
            tempData2=jsonData;
        }

        for(var i = 0; i < tempData2.length; i++){
            var dataTitle=tempData2[i].title;
            var dataLocationName=tempData2[i].showInfo[0].locationName;
            var locationLati=tempData2[i].showInfo[0].latitude;
            var locationLng=tempData2[i].showInfo[0].longitude;
            var dataCoordinates={lat:Number(locationLati), lng:Number(locationLng)};

            createMarkers(dataCoordinates, dataTitle, tempData2[i].showInfo[0].location);

            $('#list').append('<a href="javascript:focusLocation(\''+i+'\')"><li class="clearfix"><img src="img/movie.png" class="photo"><div class="info"><h2>'+dataTitle+'</h2><p><i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>'+tempData2[i].showInfo[0].time+'~'+tempData2[i].showInfo[0].endTime+'</p><p><i class="fa fa-home fa-lg" aria-hidden="true"></i>'+tempData2[i].showInfo[0].locationName+'</p><p><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>'+tempData2[i].showInfo[0].location+'</p></div></li></a>');
        } 
        $('.filter').hide();
    }

    function deleteMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    function focusLocation(markerCount){
        var focusMarker = markers[markerCount];
        map.panTo(focusMarker.getPosition());
        map.setZoom(15);
        $('.filter').hide();
    }
	

    $('.btn-filter').on('click', function(){
        $('.filter').toggle();
    });

    $('#form').dk_tw_citySelector('#city', '#district', '#zipcode')