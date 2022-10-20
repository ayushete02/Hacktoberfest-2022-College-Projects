    <?php
$con=mysqli_connect("database-smartrailwayqr.czojpx6knnte.ap-south-1.rds.amazonaws.com","admin","RajISlov2","smartrailwayqr")or die("connection not successful");


mysqli_select_db($con,"smartrailwayqr")or die("database not found");
     
    $sql = "select pnr from passengers";

    $res = mysqli_query($con,$sql);
     
    $result = array();
     
    while($row = mysqli_fetch_array($res))
{
    array_push($result,
    array('pnr'=>$row[0],
    ));
    }
    echo json_encode(array("result"=>$result));
     
    mysqli_close($con);
    ?> 
	
	
	