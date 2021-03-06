// This file will hold all logic and data related to map. 

var contactusPluginMap = angular.module('mapModule',[]);

/* Map Service */

contactusPluginMap.factory('mapService',function(){
	 var geocoder = new google.maps.Geocoder();
	var getAddress = function(latlng,callback){
		 geocoder.geocode({'location': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    console.log(results[0].geometry.location);
                    console.log('Address '+results[1].formatted_address);
                    callback(results[1].formatted_address);
                } else {
                    // window.alert('No results found');
//                    alert('Address was not successful for the following reason: ' + status);
                }
            } else {
                //window.alert('Geocoder failed due to: ' + status);
//                alert('Address was not successful for the following reason: ' + status);
            }
        });
	  }
	
	var getLatLong = function(address,callback){
		
		geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results[0].geometry.location);
                var latLng = {
                		"lat":results[0].geometry.location.lat(),
                		"long":results[0].geometry.location.lng()
                }
                callback(latLng);  
            } else {
//                alert('Geocode was not successful for the following reason: ' + status);
              
            }
        });
    }
		
	
	
	return {
		"getAddressByLatLng":getAddress,
		"getLatLngByAddress":getLatLong
	}
	
});

/* directive for map */
contactusPluginMap.directive('mapdirective',function(mapService){
    var link = function(scope,element,attrs){
        
        var map;
        var marker;
        var address;
        var infoWindow;
        var lati = 0;
        var long =  0;
        var latlng = new google.maps.LatLng(lati,long);
        
//        mapService.getLatLngByAddress(scope.query,function(response){
//        	
//        	lati = response.lat;
//        	long = response.long;
//        	 latlng = new google.maps.LatLng(lati,long);
//        	 marker.setPosition(latlng);
//        	map.setCenter(latlng);
//        });
        
//   	   setTimeout(function(){
//   		latlng = new google.maps.LatLng(lati,long);
//   	 	marker.setPosition(latlng);
//   	 	map.setCenter(latlng);   
//   	   }); 
        
       
   	 var contentinfo = '<a href="geo:'+lati +',' +long+ '"' +'><p style="margin:5px;font-size:17px;">Get Directions</p></a>';
   	 
   	 var infowindow = new google.maps.InfoWindow({
	      content: contentinfo
	  });	
   	    var mapOptions = {
            center : latlng,
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl:false,
            zoom : 15,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            styles:[{
                featureType: "poi",
                elementType: "all",
                stylers: [
                          { visibility: "off" }
                          ]
                }]
        };

        map = new google.maps.Map(element[0],mapOptions);
        
        
        
        marker = new google.maps.Marker({
            position: latlng,
//          draggable: true,
            icon:'assets/currentlocation.png',
            animation: google.maps.Animation.DROP
        });

        marker.setMap(map);
        
        scope.markerobj = marker;
        
        var draglat,draglng, dragEndlat, dragEndlong;
        
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
//            innerHtml.write('<a href="geo:53.33196,6.92583">View on Google Maps</a>');
   //     	window.location.href = marker.url;
         });

        google.maps.event.addListener(marker,'drag',function(event) {
       // 	infowindow.open(map,marker);
        //	window.location.href = marker.url;
        
            draglat = event.latLng.lat();
            draglng = event.latLng.lng();
            console.log('draglat '+draglat+', draglng '+draglng);
        });

      var getAddress = function(option){
    	  mapService.getAddressByLatLng(option,function(response){
    		  scope.query = response;
    		  scope.dataForView.content.address = response;
    		  scope.$emit("dataChangedFromMap");
          });
      }
        google.maps.event.addListener(marker,'dragend',function(event) {
            dragEndlat = event.latLng.lat();
            dragEndlong = event.latLng.lng();
            console.log('dragEndlat '+dragEndlat+', dragEndlong '+dragEndlong);
            var latlng = new google.maps.LatLng(dragEndlat, dragEndlong);
            map.setCenter(latlng);
            getAddress(latlng);
        });
        
        scope.$watch('location',function(){
		if(scope.location){
        	var res = scope.location.split(",");
			 var lati = res[0];
	         var long = res[1];
	         
	         map.setCenter(new google.maps.LatLng(lati,long));
	         marker.setPosition(new google.maps.LatLng(lati,long));
//	         map.setZoom(15);
	         contentinfo = '<a href="geo:'+lati +',' +long+ '"' +'><p style="margin:5px;font-size:17px;">Get Directions</p></a>';
	       	 	infowindow.setContent(contentinfo);
//	         if(scope.data && scope.data.content &&  scope.data.content.address){
//	        	 infowindow.setContent(scope.data.content.address);	 
//	         }
		} 

			
		});
        

    }

    return {
        restrict : 'AEC',
        template : '<div id="lmap"></div>',
        replace : true,
        link : link

    }

});










