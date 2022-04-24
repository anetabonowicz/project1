<?php
    

    $executionStartTime = microtime(true);

    $_REQUEST['capital'] = str_replace(' ', '%20', $_REQUEST['capital']);
    
    $url='http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=' . $_REQUEST['capital'] . '&username=aneta&style=full';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result,true);	

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $decode;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 



?>