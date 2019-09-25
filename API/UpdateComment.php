<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$commentId = mysqli_real_escape_string($conn,$inData["CommentId"]);
		$commentText = mysqli_real_escape_string($conn,$inData["CommentContent"]);
		$rating = mysqli_real_escape_string($conn,$inData["Rating"]);


		// Update existing comment
		$sql = "UPDATE Event_Comments SET comment_content = '".$commentText."', rating = '".$rating."' WHERE comment_id = '".$commentId."'";		
		
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}

		userError("Comment Successfully Updated!");
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