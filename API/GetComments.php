<?php
	$inData = getRequestInfo();
	$searchCount = 0;
	$searchResults = "";
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$userId = mysqli_real_escape_string($conn,$inData["UserId"]);
		$eventId = mysqli_real_escape_string($conn,$inData["EventId"]);

		$sql = "SELECT * FROM Event_Comments E, Users U WHERE E.event_id = '".$eventId."'AND E.user_id = U.user_id";
   
		$result = $conn->query($sql);
  
  		// Return comments for specified event Id
		if ($result-> num_rows > 0)
  		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["username"] .'", "' . $row["comment_id"] .'", "' . $row["user_id"] .'", "' . $row["comment_content"] .'", "' . $row["rating"] .'"';
			}

			returnWithInfo( $searchResults );
	    }
	  	else
		{
			userError("No comments found for this event.");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function userError($err)
	{
		$myJSON = json_encode($err);
		echo $myJSON;

	}
?>