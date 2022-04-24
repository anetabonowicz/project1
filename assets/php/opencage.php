<?php

	$executionStartTime = microtime(true) / 1000;
	$lat = $_REQUEST['latitude'];
     
	$lng = 	$_REQUEST['longitude'];
  
    $url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $lat . ','. $lng .'&&key=fdf0c909a41e49b5ac2ad309363c3d9d'; 

	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
 
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>