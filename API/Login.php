<?php
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "sample";
	$lastName = "sample";

	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$login = mysqli_real_escape_string($conn,$inData["login"]);
		$password = mysqli_real_escape_string($conn,$inData["password"]);

		// return relevant user data for passed in login and password
		$sql = "SELECT user_id,fname,lname,uni_name,super_admin FROM Users where username='" . $login . "' and pass='" . $password . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstName = $row["fname"];
			$lastName = $row["lname"];
			$id = $row["user_id"];
			$uniName = $row["uni_name"];
			$superAdmin = $row["super_admin"];
			returnWithInfo($firstName, $lastName, $id, $uniName,$superAdmin);
		}
		else
		{
			returnWithError( "No Records Found" );
		}
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id, $uniName,$superAdmin)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","uniName":"' . $uniName .'","superAdmin":"' . $superAdmin .'","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>