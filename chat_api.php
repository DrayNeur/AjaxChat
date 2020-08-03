<?php
$serverName = "TestChat";
if(isset($_GET['a']) && !empty($_GET['a'])) {
    if($_GET['a'] == "getServerInfo") {
        echo $serverName;
    } else if($_GET['a'] == "sendMessage") {
        if(isset($_GET['b']) && !empty($_GET['b']) && isset($_GET['c']) && !empty($_GET['c']) && !preg_match("/{$_GET['c']}/i", "<script>")) {
            $edit_file = fopen("temp.txt", 'w');
	
            fwrite($edit_file, rand(100, 999) . ":" . $_GET['b'] . ":" . $_GET['c']);
            fclose($edit_file);
            echo "ok";
        }
    } else if($_GET['a'] == "getNewMessage") {
        $myfile = fopen("temp.txt", "r") or die("invalid_request");
        echo "receive:" . fread($myfile,filesize("temp.txt"));
        fclose($myfile);
    } else {
        echo "invalid_request";
    }
} else {
    echo "invalid_request";
}

?>