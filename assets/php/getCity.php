<?php

	$executionStartTime = microtime(true) / 1000;

    #$newLat = $_REQUEST['newLat'];
	#$newLon = $_REQUEST['newLon'];
	#$name = $_REQUEST['name'];
	#$currencyInfo = $_REQUEST['currencyInfo'];

	$north = $_REQUEST['north'];
	$south = $_REQUEST['south'];
	$east = $_REQUEST['east'];
	$west = $_REQUEST['west'];


	$url = 'http://api.geonames.org/citiesJSON?north=' . $north . '&south=' . $south . '&east=' . $east . '&west=' . $west . '&lang=de&username=aneta';
	#$url = json_decode(file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $currencyInfo), true);
    #$url = 'http://api.geonames.org/findNearbyJSON?lat=' . $newLat . '&lng=' . $newLon . '&localCountry=true&&style=short&cities=15000&radius=100&maxRows=10&username=aneta'; 
	#$url = json_decode(file_get_contents('http://api.geonames.org/findNearbyPlaceNameJSON?lat='.$newLat.'&lng='.$newLon.'&style=short&cities=15000&radius=100&maxRows=5&username=aneta', true));

	$ch = curl_init();
	#print_r($ch);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
 
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode;
    #print_r($output);
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>