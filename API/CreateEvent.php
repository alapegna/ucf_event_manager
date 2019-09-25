<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com", "COP4710", "COP4710pass", "cop4710");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$eventName = mysqli_real_escape_string($conn,$inData["EventName"]);
		$eventType = mysqli_real_escape_string($conn,$inData["EventType"]);
		$eventCategory = mysqli_real_escape_string($conn,$inData["EventCategory"]);
		$eventRSO = mysqli_real_escape_string($conn,$inData["EventRSO"]);
		$eventDesc = mysqli_real_escape_string($conn,$inData["EventDesc"]);
		$eventLoc = mysqli_real_escape_string($conn,$inData["EventLoc"]);
		$eventStart = mysqli_real_escape_string($conn,$inData["EventStartTime"]);
		$eventEnd = mysqli_real_escape_string($conn,$inData["EventEndTime"]);
		$eventDate = mysqli_real_escape_string($conn,$inData["EventDate"]);
		$contactPhone = mysqli_real_escape_string($conn,$inData["ContactPhone"]);
		$contactEmail = mysqli_real_escape_string($conn,$inData["ContactEmail"]);


		$sql = "SELECT * FROM Event_Data where loc_name = '".$eventLoc."' AND event_date = '".$eventDate."' AND event_start BETWEEN '".$eventStart."' AND '".$eventEnd."'";
		$sql2 = "SELECT * FROM Event_Data where loc_name = '".$eventLoc."' AND event_date = '".$eventDate."' AND event_end BETWEEN '".$eventStart."' AND '".$eventEnd."'";
		$sql3 = "SELECT * FROM Event_Data where loc_name = '".$eventLoc."' AND event_date = '".$eventDate."' AND event_start <= '".$eventStart."' AND event_end >= '".$eventEnd."'";

		$result1 = $conn->query($sql);
		$result2 = $conn->query($sql2);
		$result3 = $conn->query($sql3);
  	
		
  		// Check if any time conflicts exist
		if ($result1-> num_rows > 0)
  		{
			userError("ERROR: Event times conflict with existing event.");
			$conn->close();
	    }
	    else if ($result2-> num_rows > 0)
	    {
	    	userError("ERROR: Event times conflict with existing event.");
			$conn->close();
	    }
	    else if($result3-> num_rows > 0)
	    {
	    	userError("ERROR: Event times conflict with existing event.");
			$conn->close();
	    }
			
		// create new Event
		else if($eventCategory != 'RSO')
		{
			$eventcreate = "INSERT INTO Event_Data (event_name,event_type,event_category,event_description,event_start,event_end,event_date,contact_phone,contact_email,loc_name) VALUES ('" . $eventName . "','" . $eventType ."','" . $eventCategory ."','" .$eventDesc."','" .$eventStart. "','" .$eventEnd. "','" .$eventDate. "','" .$contactPhone. "','" .$contactEmail. "','" .$eventLoc. "')";	
	
			if( $result = $conn->query($eventcreate) != TRUE )
			{
				returnWithError( $conn->error );
			}

			userError("Event Successfully Created");
		}
		else
		{
			$eventcreate = "INSERT INTO Event_Data (event_name,event_type,event_category,event_description,event_start,event_end,event_date,contact_phone,contact_email,loc_name,rso_name,approved) VALUES ('" . $eventName . "','" . $eventType ."','" . $eventCategory ."','" .$eventDesc."','" .$eventStart. "','" .$eventEnd. "','" .$eventDate. "','" .$contactPhone. "','" .$contactEmail. "','" .$eventLoc. "','" .$eventRSO."','1')";	
	
			if( $result = $conn->query($eventcreate) != TRUE )
			{
				returnWithError( $conn->error );
			}

			userError("Event Successfully Created");
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