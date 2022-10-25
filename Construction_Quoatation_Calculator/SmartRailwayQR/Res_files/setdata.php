<?php

$con=mysqli_connect("database-smartrailwayqr.czojpx6knnte.ap-south-1.rds.amazonaws.com","admin","RajISlov2","smartrailwayqr")or die("connection not successful");


mysqli_select_db($con,"smartrailwayqr")or die("database not found");

if(isset($_POST['pnr'])&& isset($_POST['name'])&& isset($_POST['trainname'])&& isset($_POST['trainno'])
	&& isset($_POST['state'])&& isset($_POST['city'])&& isset($_POST['source'])&& isset($_POST['destination']) 
&& isset($_POST['date']) && isset($_POST['aadhaar'])&& isset($_POST['mobile']))
{
	


$pnr=$_POST['pnr'];
$name=$_POST['name'];
$trainname=$_POST['trainname'];
$trainno=$_POST['trainno'];
$state=$_POST['state'];
$city=$_POST['city'];
$source=$_POST['source'];
$destination=$_POST['destination'];
$date=$_POST['date'];
$aadhaar=$_POST['aadhaar'];
$mobile=$_POST['mobile'];



$qry="insert into passengers (pnr,name,trainname,trainno,state,city,source,destination,date,aadhaar,mobile) values('$pnr','$name','$trainname','$trainno',
'$state','$city','$source','$destination','$date','$aadhaar','$mobile')";

mysqli_query($con,$qry)or die("Query Problem");
}
else
{
echo "waiting for data...";
}
?>