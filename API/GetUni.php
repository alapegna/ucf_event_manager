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

		$sql = "SELECT * FROM University WHERE uni_name = '".$uniName."'";
   
		$result = $conn->query($sql);
  
  		// Return university profile data
		if ($result-> num_rows > 0)
  		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["uni_name"] . '", "' .$row["address"].'", "' .$row["city"].'", "' .$row["state"].'", "' .$row["zip"].'", "' .$row["description"].'", "' .$row["num_students"].'", "' .$row["logo_url"].'"';
			}

			returnWithInfo( $searchResults );
	    }
	  	else
		{
			userError("No profile found for this university.");
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