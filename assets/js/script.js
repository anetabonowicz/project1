// loader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(50).fadeOut('slow', function () {
        $(this).remove();
    });
    }
});

/* FUNCTIONS */
let countrySelect = [];
let name = "";
let countryCode;
let gJsonBorders = [];
let bounds;
let latitude;
let longitude;
let isoCode3;
let isoCode2;
let countryGJson;
let map;

map = L.map('map').setView([53.4808, 2.2426], 5);

/* maps/tiles */
var OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors',
    minZoom: 1,
    maxZoom: 18
    });

var Satelitte = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    minZoom: 1,
    maxZoom: 18
    });


var baseMaps = {
    "OpenStreetMap": OpenStreetMap,
    "Satelitte": Satelitte,
}

//OVERLAYS 

var OpenWeatherMap_Wind = L.tileLayer('http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid={apiKey}', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href=http://openweathermap.org>OpenWeatherMap</a>',
    apiKey: 'b31673122b9c90a336f186013c25ffe7',
    opacity: 0.5
    });

var OpenWeatherMap_Clouds = L.tileLayer('http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid={apiKey}', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
    apiKey: 'b31673122b9c90a336f186013c25ffe7',
    opacity: 0.5
});
var OpenWeatherMap_Pressure = L.tileLayer('http://{s}.tile.openweathermap.org/map/pressure/{z}/{x}/{y}.png?appid={apiKey}', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
    apiKey: 'b31673122b9c90a336f186013c25ffe7',
    opacity: 0.5
});



var overlays = {
    "OpenWeatherMap Wind": OpenWeatherMap_Wind,
    "OpenWeatherMap Clouds": OpenWeatherMap_Clouds,
    "OpenWeatherMap Pressure": OpenWeatherMap_Pressure
}

var globeEasyButton;
let marker;

//marker
var redMarker = L.ExtraMarkers.icon({
    shape: 'circle',
    markerColor: 'blue-dark',
    prefix: 'fa',
    icon: 'fa-spinner',
    iconColor: '#fff',
    iconRotate: 1,
    extraClasses: 'fa-spin',
    number: '',
    svg: true
  });

  map.addLayer(OpenStreetMap);

// tile
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors',
    minZoom: 1,
    maxZoom: 18
    }).addTo(map);

L.control.layers(baseMaps,overlays).addTo(map);

//marker cluster 
var markers = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 25
});

//easybuttons
infoEasyButton = L.easyButton('fa-solid fa-info' , function(){
    $('#countryModal').modal("show");
},'Country Modal').addTo(map);

wikiEasyButton = L.easyButton('fa-brands fa-wikipedia-w' , function(){
    $('#wikiModal').modal("show");
},'Wikipedia Modal').addTo(map);

weatherEasyButton = L.easyButton('fa-solid fa-sun' , function(){
        $('#weatherModal').modal("show");
},'Weather Modal').addTo(map);

newsEasyButton = L.easyButton('fa-solid fa-newspaper' , function(){
    $('#newsModal').modal("show");
},'News Modal').addTo(map);


let borderStyle = {
    "color": "green",
    "opacity": 0.5,
    "weight": 2
}

/* country list */
function loadCountryList() {
    $.ajax({
        url: "assets/php/getCountryBorders.php",
        type: 'POST',
        dataType: 'json',

        success:(result) => {       
            countrySelect = $('#countrySelect');
            result['data'].forEach(country => {
                countrySelect.append(`<option value = ${country['countryCode2']}>${country['name']}</option>`);
            });
        }, error: function(jqXHR, textStatus, errorThrown){
            console.log('Something went wrong');
        }
    });
} 

/* get location */
function getLocation() {
        if(navigator.geolocation) {
            console.log("Geolocation is available");
           navigator.geolocation.getCurrentPosition(successFunction, errorFunction);

        } else {
           console.log("Sorry, your browser does not support geolocation.");
        }
}  

function successFunction(position) {
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;

    /*  get name of selected country   */
    $.ajax({
        url:'assets/php/current.php',
        type:'POST',
        dataType:'json',
        data:{
            latitude: latitude,
            longitude: longitude
        },

        success: function(result){
            isoCode2 = result['results'][0]['components']['ISO_3166-1_alpha-2'];
            $('#countrySelect').val(isoCode2).change();

            isoCode3 = result['results'][0]['components']['ISO_3166-1_alpha-3'];     
            loadCountryInfo(isoCode3);

            /*set country borders */
            $.ajax({
                url:'assets/php/getCountryBorders.php',
                type:'POST',
                dataType: 'json',
                data:{
                    isoCode2 : isoCode2 
                },

                success:(result) => {
                    countryGJson = result['geoJson'];
                   
                }, error: function(jqXHR, textStatus, errorThrown) {
                      console.log(textStatus, errorThrown);
                }
            });
        },error: function(jqXHR, textStatus, errorThrown) {
             console.log(textStatus, errorThrown);
        }
    });
}

function errorFunction(position){
    console.log('Error! Something went wrong');
}

/*   borders   */
function drawBorder(geoJson) {
    if(gJsonBorders === true) {
        map.removeLayer(gJsonBorders);
    }

    gJsonBorders = L.geoJson(geoJson, borderStyle).addTo(map);
    bounds = gJsonBorders.getBounds();
    map.fitBounds(bounds);

    north = bounds.getNorth();
    south = bounds.getSouth();
    east = bounds.getEast();
    west = bounds.getWest();
} 

let capital = "";
let population;
let currencyName = "";
let currencyInfo;
let currentRate;
let currencyCode;
let country;
let newsLink;
let newsLink2;
let north;
let south;
let east;
let west;
let json;
let region;

/*  get info of selected country   */
function loadCountryInfo(isoCode3) {
    $.ajax({
        url:'assets/php/countryInfo.php',
        type:'POST',
        dataType: 'json',
        data:{
            isoCode3 : isoCode3
        },

        success:function(result){
                capital = result['data'][0]['capital'];
                currencyName = result['data'][0]['currencies'][0]['name'];
                population = result['data'][0]['population'].toLocaleString("en-US");
                countryCode = result['data'][0]['alpha2Code'];
                currencyInfo = result['data'][0]['currencies'][0]['code'];
                country = result['data'][0]['name'];
                iso_code2 = result['data'][0]['alpha2Code'];
                region = result['data'][0]['region'];

                $('.countryName').html(result['data'][0]['name']);
                $('.capital').html(result['data'][0]['capital']);
                $('#population').html(`${result['data'][0]['population'].toLocaleString("en-US")}`);
                $('#currencyName').html(result['data'][0]['currencies'][0]['name']);
                $('#lang').html(result['data'][0]['languages'][0]['name']);
                $('#region').html(result['data'][0]['region']);
                $('#area').html(result['data'][0]['area'] + ' km²');
                $('#call_code').html('+' + result['data'][0]['callingCodes']);

                loadWiki(capital);
                loadWeather(capital);
                markCities(north, south, east, west);

                /* current exchange rate */
                $.ajax({
                    url: 'assets/php/currencyRate.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        currencyInfo: currencyInfo
                    },

                    success: function(result) {    
                        currentRate = result['data'];
                        $("#currentRate").text(`${currentRate}`);                
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    }
                });

                let newsTitle;
                let newsContent;

                let newsTitle2;
                let newsContent2;

                /* news */
                $.ajax({                 
                    url: 'assets/php/news.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        iso_code2: iso_code2
                    },

                    success: function(result) { 
                        $('#newsImg').empty();
                        $('#newsImg2').empty();
                        $('#newsImg3').empty(); 

                        newsTitle = result['data'][0]['title'];
                        newsContent = result['data'][0]['description'];
                        newsLink = result['data'][0]['link'];
                        newsImg = result['data'][0]['image_url'];

                        newsTitle2 = result['data'][1]['title'];
                        newsContent2 = result['data'][1]['description'];
                        newsLink2 = result['data'][1]['link'];
                        newsImg2 = result['data'][1]['image_url'];

                        newsTitle3 = result['data'][2]['title'];
                        newsContent3 = result['data'][2]['description'];
                        newsLink3 = result['data'][2]['link'];
                        newsImg3 = result['data'][2]['image_url'];

                        //-----
                        if(result['data'][0]['image_url']){
                            $('#newsImg').html(`<img src="${newsImg}" alt="news_img" >`);
                        } 
                        $('#newsTitle').html(`${newsTitle}`);
                        $('#newsContent').html(`<a href="${newsLink}"> ${newsContent} </a>`);

                        //------
                        if(result['data'][1]['image_url']){
                            $('#newsImg2').html(`<img src="${newsImg2}" alt="news_img" >`);
                        } 
                        $('#newsTitle2').html(`${newsTitle2}`);
                        $('#newsContent2').html(`<a href="${newsLink2}"> ${newsContent2} </a>`);

                        //-------
                        if(result['data'][2]['image_url']){
                            $('#newsImg3').html(`<img src="${newsImg3}" alt="news_img" >`);
                        } 
                        $('#newsTitle3').html(`${newsTitle3}`);
                        $('#newsContent3').html(`<a href="${newsLink3}"> ${newsContent3} </a>`);
                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    }
                });

        }, error: function(jqXHR, textStatus, errorThrown){
            console.log('Something went wrong', errorThrown);
        }
    });
} 

let newMarkers;

/*   markers for current country   */
function markCities(north, south, east, west) {
    $.ajax({
        url: "assets/php/getCity.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: north,
            south: south,
            east: east,
            west: west
        },

        success: function(result) { 
            if(newMarkers) {
                for(let i = 0; i < 10; i++) {
                    markers.clearLayers();
                    map.removeLayer(markers);
                }
            }

            for (let i = 0; i < 10; i++) { 
                newMarkers =  L.marker([result['data']['geonames'][i]['lat'], result['data']['geonames'][i]['lng']], {icon: redMarker})
                .bindPopup(`<b>` + result['data']['geonames'][i]['name'] + `</b>`);
                markers.addLayer(newMarkers);
            }

            map.addLayer(markers);

        }, error: function(jqXHR, textStatus, errorThrown){
            console.log('Something went wrong: ' + errorThrown.message);
        }
    });
} 

let wikiInfo;
let link;

/* load wikipedia information */
function loadWiki(capital) {
    $.ajax({
        url:'assets/php/wikiSearch.php',
        type:'POST',
        dataType:'json',
        data: {
            capital: capital
        },

        success: function(result) {
            wikiInfo = result['data']['geonames'][0]['summary'];
            wikiImg = result['data']['geonames'][0]['thumbnailImg'];
            link = 'https://' + result['data']['geonames'][0]['wikipediaUrl'];
            
            if(result.status.name === "ok") {
                
                $('#wikiLoop').empty();
                
                for(let i = 0; i < 4; i++) {

                    link = 'https://' + result['data']['geonames'][i]['wikipediaUrl'];
                    $('#wikiLoop')
                    .append(`<h3> ${result['data']['geonames'][i]['title']} </h3>`) 
                    .append(`<img src="${result['data']['geonames'][i]['thumbnailImg']}" alt="wikipedia_img" style="width="400px"; height="auto"; "> `)
                    .append(`<p> ` + result['data']['geonames'][i]['summary'] + `</p>`)
                    .append(` <a href="${link}">${link}</a> <hr>`);
                                       
                }
            }
        },
        error: function(){
            console.log('Something went wrong.(Wikipedia error)');
        }
    });
}

let temperature;
let weather;
let wind;

function loadWeather(capital) {
    $.ajax({
        url:'assets/php/loadWeather.php',
        type: 'POST',
        dataType: 'json',
        data: {
            capital: capital
        },

        success:function(result) {
            if(result.status.name === "ok") {

                temperature = Math.round(result['data']['main']['temp']);
                weather = result['data']['weather'][0]['description'];
                wind = result['data']['wind']['speed'];
                imgSrc = "http://openweathermap.org/img/w/" + result['data']['weather'][0]['icon'] + ".png";
                let low = Math.round(result['data']['main']['temp_min']);
                let high = Math.round(result['data']['main']['temp_max']);

                $('#weatherImg').html(`<img src=${imgSrc} alt="weather_icon"  />`);  
                $('#weather').html(`${weather}`);
                $('#temperature').html(`<p>${high} °C </p>`).append(`<span> ${low} °C </span>`);

                $('#wind').html(`  ${wind}` + " m/s");
                $('#pressure').html(`  ${result['data']['main']['pressure']}` + " hPa");
                $('#humidity').html(`  ${result['data']['main']['humidity']}` + " %");
            }
            
            $.ajax({
                url:'assets/php/weatherForcast.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    capital: capital
                },
                
                success:function(result) {
                    $('#forecast').empty();

                    if(result.status.name === "ok") {

                        let days = ["Today", "Tomorrow"];

                        const date = new Date();
                        let day = date.getDay();

                        const createDay = (day) => {

                            if(day > 6) {
                                day = day - 7;
                            }
                                switch(day) {
                                    case 0:
                                        days.push("Sunday");
                                    break;
                                    case 1:
                                        days.push("Monday");
                                    break;
                                    case 2:
                                        days.push("Tuesday");
                                    break;
                                    case 3:
                                        days.push("Wednesday");
                                    break;
                                    case 4:
                                        days.push("Thursday");
                                    break;
                                    case 5:
                                        days.push("Friday");
                                    break;
                                    case 6:
                                        days.push("Saturday");
                                    break;
                                    default:
                                        return "error";
                            }
 
                        }

                        createDay(day + 2);
                        createDay(day + 3);
                        
                        for(let i = 1; i < 4; i ++) {

                            let weatherF = result['data'][i]['weather'][0]['description'];
                            let imgSrcF = "http://openweathermap.org/img/w/" + result['data'][i]['weather'][0]['icon'] + ".png";
                            let lowFor = Math.round(result['data'][i]['main']['temp_min']);
                            let highFor = Math.round(result['data'][i]['main']['temp_max']);

                            

                            $('#forecast').append(`<div>
                                                        <h6>${days[i]}</h6>
                                                        <img src=${imgSrcF} alt="weather_forecast_icon"  />
                                                        <div>
                                                            <span><strong>${highFor} °C </strong></span>
                                                            <span> ${lowFor} °C </span> 
                                                        </div>
                                                        <br>
                                                        <p> ${weatherF} </p> 
                                                    </div>`);
                                    
                        }
                     }
                }
            });
        }
    });
}

//on  country select change data 
$('#countrySelect').change(function(){
    var sel_iso3 =  $('#countrySelect').find(':selected').val();

    map.removeLayer(gJsonBorders);

    loadCountryInfo(sel_iso3);
        $.ajax({
            url:'assets/php/getCountryBorders.php',
            type:'POST',
            dataType: 'json',
            data : {
                "isoCode2": sel_iso3
            },

            success:(result) => {
               countryGJson = result['geoJson'];
               drawBorder(countryGJson);
            }, error: function(jqXHR, textStatus, errorThrown){
                console.log('Something went wrong');
            }
      });
 });

$(document).ready(function(){
    getLocation();
    loadCountryList();
})