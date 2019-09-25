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
		$uniName = mysqli_real_escape_string($conn,$inData["UniName"]);

		$sql = "SELECT * FROM Event_Data E, Locations L WHERE E.approved = 0 AND E.loc_name = L.loc_name AND L.uni_name = '".$uniName."' ORDER BY event_date";
   
		$result = $conn->query($sql);
  
  		// Return all unapproved events for the passed in university
		if ($result-> num_rows > 0)
  		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["event_id"]. '", "' . $row["event_name"] . '", "' .$row["event_type"].'", "' .$row["event_category"].'", "' .$row["event_description"].'", "' .$row["event_start"].'", "' .$row["event_end"].'", "' .$row["event_date"].'", "' .$row["contact_phone"].'", "' .$row["contact_email"].'", "' .$row["loc_name"].'"';
			}

			returnWithInfo( $searchResults );
	    }
	  	else
		{
			userError("No pending events for this university.");
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