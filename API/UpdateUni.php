<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Update existing university profile

		$uniName= mysqli_real_escape_string($conn,$inData["UniName"]);
		$address = mysqli_real_escape_string($conn,$inData["Address"]);
		$city = mysqli_real_escape_string($conn,$inData["City"]);
		$state = mysqli_real_escape_string($conn,$inData["State"]);
		$zip = mysqli_real_escape_string($conn,$inData["Zip"]);
		$description = mysqli_real_escape_string($conn,$inData["Desc"]);
		$students = mysqli_real_escape_string($conn,$inData["Students"]);
		$logo = mysqli_real_escape_string($conn,$inData["Logo"]);

		$sql = "UPDATE University SET address = '".$address."', city = '".$city."', state = '".$state."', zip = '".$zip. 
		"', description = '".$description."', num_students = '".$students."', logo_url = '".$logo."'WHERE uni_name = '".$uniName."'";
   
		$result = $conn->query($sql);

		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}

		userError("");
		
		$conn->close();
    }

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function userError($err)
	{
		$myJSON = json_encode($err);
		echo $myJSON;

	}
?>