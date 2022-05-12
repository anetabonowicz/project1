<?php

    $executionStartTime = microtime(true) / 1000;

    $iso2 = strtolower($_REQUEST['iso_code2']);


    $url='https://newsdata.io/api/1/news?apikey=pub_69342c93fca47ac873e91cc97f0a1a6d9c79&country=' . $iso2;

    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result=curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result, true);	

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $decode['results'];

    header('Content-Type: application/json; charset=UTF-8');
    #print_r($output);
    echo json_encode($output); 


?>