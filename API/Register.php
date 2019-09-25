<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$firstName = mysqli_real_escape_string($conn,$inData["FirstName"]);
		$lastName = mysqli_real_escape_string($conn,$inData["LastName"]);
		$email = mysqli_real_escape_string($conn,$inData["Email"]);
		$login = mysqli_real_escape_string($conn,$inData["Login"]);
		$password = mysqli_real_escape_string($conn,$inData["Password"]);
		$university = mysqli_real_escape_string($conn,$inData["University"]);

		$sql = "SELECT username, email FROM Users where username = '".$login."' or email = '".$email."'";
   
		$result = $conn->query($sql);
  
  		// Check if username or email already taken
		if ($result-> num_rows > 0)
  		{
	 		 while ($row = $result->fetch_assoc())
	 		 {
				if ($row[UserName] == $email or $row[Email] == $email)
				{
					userError("Username or Email already taken");
				}
			}
	    }
	  	else
		{
			// create new User
			$usercreate = "INSERT INTO Users (username,pass,fname,lname,email,uni_name) VALUES ('" . $login . "','" . $password ."','" . $firstName ."','" . $lastName . "','" .$email."','" .$university. "')";		
		
			if( $result = $conn->query($usercreate) != TRUE )
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