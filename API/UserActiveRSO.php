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
		$userId = mysqli_real_escape_string($conn,$inData["UserID"]);

		$sql = "SELECT R.rso_name, R.rso_description, R.rso_admin FROM RSO R, RSO_Members M WHERE M.user_id = '".$userId."' AND M.rso_name = R.rso_name AND R.active = 1";
   
		$result = $conn->query($sql);
  
  		// Return all RSOs user is a member of and that have 5+ members
		if ($result-> num_rows > 0)
  		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["rso_name"] . '", "' .$row["rso_description"].'", "' .$row["rso_admin"].'"';
			}

			returnWithInfo( $searchResults );
	    }
	  	else
		{
			userError("Not a Member of any RSOs.");
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