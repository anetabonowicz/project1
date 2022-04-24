<?php 
     if(isset($_POST['isoCode3'])) {
   
    $executionStartTime = microtime(true);

    $countryInfo = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryInfo['features'] as $feature) {
        if($_POST['isoCode3'] == $feature['properties']['iso_a3']) {
            $temp = null;

            $temp['name'] = $feature["properties"]['name'];
            $temp['iso2'] = $feature['properties']['iso_a2'];
            $temp['countryCode'] = $feature["properties"]['iso_a3'];
            $temp['geometry'] = $feature['geometry'];
            /*



            */

            array_push($country, $temp);
        }
        }
        usort($country, function ($item1, $item2) { 
            return $item1['name'] <=> $item2['name'];
        });

        
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "done";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $country;
    $output['geoJson'] = $country[0]['geometry'];
        
    header('Content-Type: application/json; charset=UTF-8');
    
    //print_r($country);
    echo json_encode($output);
    } else  {

    $executionStartTime = microtime(true);

    $countryInfo = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryInfo['features'] as $feature) {
        $temp = null;
        
        $temp['iso2'] = $feature['properties']['iso_a2'];
        $temp['countryCode'] = $feature['properties']['iso_a3'];
        $temp['name'] = $feature['properties']['name'];
        $temp['geometry'] = $feature['geometry'];
        
        array_push($country, $temp);
    }
    usort($country, function ($item1, $item2) { 
        return $item1['name'] <=> $item2['name'];
    });


    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "done";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;
    $output['geoJson'] = $country[0]['geometry'];


    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
    }


?>