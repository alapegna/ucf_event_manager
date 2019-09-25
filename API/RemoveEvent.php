<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// delete event with passed in event Id
		$eventId= mysqli_real_escape_string($conn,$inData["EventId"]);

		$sql = "DELETE FROM Event_Data WHERE event_id = '".$eventId."'";
   
		$result = $conn->query($sql);

		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}

		userError("Successfully Removed Event");
		
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