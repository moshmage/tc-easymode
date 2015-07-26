<?php
	header('Access-Control-Allow-Origin: *');

	$CIDS = ["m","i","c","h","u","a","s","j","x","e","z"];
	$result = false;
	$opts = array('http'=>array());
	$pid = false;

	if (!empty($_GET['pid']) || !empty($_POST['pid'])) {
		if (!empty($_GET)) preg_match("/(\d+)/i", $_GET['pid'], $pid);
		if (!empty($_POST)) preg_match("/(\d+)/i", $_POST['pid'], $pid);

		if ($pid) {
      $thisPid = $pid[0];
      $allPids = file_get_contents('./pids.prices.json');
      $allPids = json_decode($allPids);
      if (empty($allPids)) $allPids = [];

      if ($allPids->$thisPid) {
        $allPids->$thisPid += 1;
      } else {
        $allPids[$thisPid] = 1;
      }

			$opts = array(
				'http'=>array('header'=>"Origin: http://www.torn.com/profiles.php?XID=$thisPid")
			);

			file_put_contents('pids.prices.json',json_encode($allPids));
		}
	}

	if (!empty($_GET['c'])) {
		$cid = $_GET['c'];
		$exists = in_array($cid,$CIDS);
		if ($exists) $string = "?c=$cid";
	} else if (!empty($_POST['update'])) {
		$fields_string = '';
		$url = 'http://travelrun.torncentral.com/update2.php';
		$fields = array('data' => urlencode($_POST['update']));
		foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
        rtrim($fields_string, '&');
        $ch = curl_init();

        //set the url, number of POST vars, POST data
        curl_setopt($ch,CURLOPT_URL, $url);
        if ($thisPid) curl_setopt($ch, CURLOPT_REFERER, "http://www.torn.com/profiles.php?XID=$thisPid");
        curl_setopt($ch,CURLOPT_POST, count($fields));
        curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

        //execute post
        $result = curl_exec($ch);

        //close connection
        curl_close($ch);
	}

	if (!empty($string)) {
		$dom = new DOMDocument;
		$html = file_get_contents("http://travelrun.torncentral.com/index.php$string",false,stream_context_create($opts));
		$dom->loadHTMLFile("http://travelrun.torncentral.com/index.php$string");
		$divs = $dom->getElementsByTagName('div');
		foreach($divs as $div) {
			if ($div->getAttribute('class') === 'itemdata') {
        $result = $dom->saveHTML($div);
			}
		}
	}

	if (!empty($result)) echo $result;
?>