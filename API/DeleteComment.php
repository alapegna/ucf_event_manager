<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// delete selected comment from database
		$commentId= mysqli_real_escape_string($conn,$inData["CommentId"]);

		$sql = "DELETE FROM Event_Comments WHERE comment_id = '".$commentId."'";
   
		$result = $conn->query($sql);

		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}

		userError("Successfully deleted comment");
		
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