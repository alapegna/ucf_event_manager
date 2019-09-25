<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$rsoName = mysqli_real_escape_string($conn,$inData["RsoName"]);
		$rsoDesc = mysqli_real_escape_string($conn,$inData["RsoDesc"]);
		$uniName = mysqli_real_escape_string($conn,$inData["UniName"]);
		$rsoAdmin = mysqli_real_escape_string($conn,$inData["RsoAdmin"]);

		$sql = "SELECT rso_name FROM RSO where rso_name = '".$rsoName."'";
   
		$result = $conn->query($sql);
  
  		// Check if RSO name already exists
		if ($result-> num_rows > 0)
  		{
	 		 while ($row = $result->fetch_assoc())
	 		 {
				if ($row[UserName] == $email or $row[Email] == $email)
				{
					userError("RSO already exists.");
				}
			}
	    }
	  	else
		{
			// create new RSO
			$rsoCreate = "INSERT INTO RSO (rso_name,rso_description,uni_name,rso_admin) VALUES ('" . $rsoName . "','" . $rsoDesc ."','" . $uniName ."','" . $rsoAdmin ."')";		
			
			if( $result = $conn->query($rsoCreate) != TRUE )
			{
				returnWithError( $conn->error );
			}

			// insert new tuple into RSO Members table
			$rsoCreate = "INSERT INTO RSO_Members (rso_name,user_id) VALUES('". $rsoName ."','" . $rsoAdmin ."')";	
			
			if( $result = $conn->query($rsoCreate) != TRUE )
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