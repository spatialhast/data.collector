<?php
session_cache_limiter('nocache');
$cache_limiter = session_cache_limiter();
function goProxy($dataURL) 
{
	$baseURL = 'http://hast.cartodb.com/api/v2/sql?';
	//  					^ CHANGE THE 'CARTODB-USER-NAME' to your cartoDB url!
	$api = '&api_key=7708ad268e39ba4a775429954120026ccd51de0a';
	//				 ^ENTER YOUR API KEY HERE!
	$url = $baseURL.'q='.urlencode($dataURL).$api;
	
	echo "<script type='text/javascript'>alert('$url');</script>";
	
	$result = file_get_contents ($url);
		
	return $result;
}
?>