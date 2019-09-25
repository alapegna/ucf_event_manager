<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$userId = mysqli_real_escape_string($conn,$inData["UserId"]);
		$eventId = mysqli_real_escape_string($conn,$inData["EventId"]);
		$commentText = mysqli_real_escape_string($conn,$inData["CommentContent"]);
		$rating = mysqli_real_escape_string($conn,$inData["Rating"]);


		// Add new comment
		$sql = "INSERT INTO Event_Comments (event_id,user_id,comment_content,rating) VALUES ('" . $eventId . "','" . $userId  ."','" . $commentText ."','" . $rating ."')";		
		
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}

		userError("Comment Successfully Added!");
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