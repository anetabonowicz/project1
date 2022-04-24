
<?php
	
	include('openCage/AbstractGeocoder.php');
    include('openCage/Geocoder.php');
	
	
	$geocoder = new \OpenCage\Geocoder\Geocoder('fdf0c909a41e49b5ac2ad309363c3d9d');
	
	$string = (isset($_POST['name'])) ? $_POST['name'] : $_POST['latitude'].',' .$_POST['longitude'] ;
	
	$result = $geocoder->geocode($string); 

	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
	
?>