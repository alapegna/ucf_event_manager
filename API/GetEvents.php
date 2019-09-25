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
		$userId = mysqli_real_escape_string($conn,$inData["UserId"]);
		$uniName = mysqli_real_escape_string($conn,$inData["UniName"]);
		$category = mysqli_real_escape_string($conn,$inData["Category"]);
		$search = mysqli_real_escape_string($conn,$inData["Search"]);

		// check what filters were passed in to get corresponding SQL statement

		if($category == "Public")
		{
			if($search == "All")
				$sql = "SELECT * FROM Event_Data E, Locations L WHERE E.approved = 1 AND E.event_category = 'Public' AND E.loc_name = L.loc_name ORDER BY uni_name,event_date";
			else
				$sql = "SELECT * FROM Event_Data E, Locations L WHERE E.approved = 1 AND E.event_category = 'Public' AND E.loc_name = L.loc_name AND L.uni_name = '".$search."' ORDER BY uni_name,event_date";
		}

		if($category == "Private")
		{
			if($search == "All")
				$sql = "SELECT * FROM Event_Data E, Locations L WHERE E.approved = 1 AND E.event_category = 'Private' AND E.loc_name = L.loc_name AND L.uni_name = '".$uniName."' ORDER BY uni_name,event_date";
			else
				$sql = "SELECT * FROM Event_Data E, Locations L WHERE E.approved = 1 AND E.event_category = 'Private' AND E.loc_name = L.loc_name AND L.loc_name = '".$search."' AND L.uni_name = '".$uniName."' ORDER BY uni_name,event_date";
		}

		if($category == "RSO")
		{
			if($search == "All")
				$sql = "SELECT * FROM Event_Data E, Locations L, RSO_Members M, RSO R WHERE E.event_category = 'RSO' AND E.rso_name = M.rso_name AND E.loc_name = L.loc_name AND M.user_id = '".$userId."'AND M.rso_name = R.rso_name AND R.active = 1 ORDER BY L.uni_name,event_date";
			else
				$sql = "SELECT * FROM Event_Data E, Locations L, RSO_Members M, RSO R WHERE E.event_category = 'RSO' AND E.rso_name = M.rso_name AND E.loc_name = L.loc_name AND M.user_id = '".$userId."'AND M.rso_name = R.rso_name AND R.active = 1 AND R.rso_name ='".$search."' ORDER BY L.uni_name,event_date";
		}
   
		$result = $conn->query($sql);
  
  		// Return all filtered events
		if ($result-> num_rows > 0)
  		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["event_id"]. '", "' . $row["event_name"] . '", "' .$row["event_type"].'", "' .$row["rso_name"].'", "' .$row["event_description"].'", "' .$row["event_date"].'", "' .$row["uni_name"].'", "' .$row["loc_name"].'", "' .$row["event_start"].'", "' .$row["event_end"].'", "' .$row["contact_phone"].'", "' .$row["contact_email"].'", "' .$row["latitude"].'", "' .$row["longitude"].'"';
			}

			returnWithInfo( $searchResults );
	    }
	  	else
		{
			userError("No events found matching search criteria.");
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