<?php
//include 'cartoDBProxy.php';

session_cache_limiter('nocache');
$cache_limiter = session_cache_limiter();
function goProxy($dataURL) 
{
	$baseURL = 'http://hast.cartodb.com/api/v2/sql?';
	//  					^ CHANGE THE 'CARTODB-USER-NAME' to your cartoDB url!
	$api = '&api_key=b047b69708b0b5c661c4d0dc228dc78688055388';
	//				 ^ENTER YOUR API KEY HERE!
	$url = $baseURL.'q='.urlencode($dataURL).$api;
	
	echo "<script type='text/javascript'>alert('$url');</script>";
	
	$result = file_get_contents ($url);
		
	return $result;
}

//			^CHANGE THIS TO THE PATH TO YOUR cartodbProxy.php
$queryURL = $_POST['qurl'];
$return = goProxy($queryURL);
echo $return;
?>