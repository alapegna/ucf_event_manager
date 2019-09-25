<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$userId = mysqli_real_escape_string($conn,$inData["UserID"]);
		$rsoName = mysqli_real_escape_string($conn,$inData["RsoName"]);

		$sql = "SELECT * FROM RSO_Members where user_id = '".$userId."' AND rso_name = '".$rsoName."'";
   
		$result = $conn->query($sql);
  
  		// Check if user is already a member of passed in RSO
		if ($result-> num_rows > 0)
  		{
			userError("Already a member of this RSO.");
	    }
	  	else
		{
			// Add a new RSO Member tuple
			$joinrso = "INSERT INTO RSO_Members (user_id,rso_name) VALUES ('" . $userId . "','" . $rsoName ."')";		
		
			if( $result = $conn->query($joinrso) != TRUE )
			{
				returnWithError( $conn->error );
			}
			
			userError("");
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

	function userError($err)
	{
		$myJSON = json_encode($err);
		echo $myJSON;

	}
?>