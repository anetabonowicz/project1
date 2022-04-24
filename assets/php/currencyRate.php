<?php


	$executionStartTime = microtime(true) / 1000;

	#$currency =  $_REQUEST['currencyInfo'];

	
    $url='https://openexchangerates.org/api/latest.json?app_id=2b030abaf9bf469d886599f1955474e2';
	

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
	#$output['data'] = $decode['rates'][$currency];
	$output['data'] = $decode['rates'][$_REQUEST['currencyInfo']];
	

	header('Content-Type: application/json; charset=UTF-8');
	
	echo json_encode($output); 
	

?>