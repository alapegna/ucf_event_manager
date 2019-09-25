// COP 4710
// Alex Lapegna

var urlBase = 'http://18.218.92.43/event_manager/API';
var extension = "php";

var userId;
var superAdmin;
var uniName;
var firstName;
var lastName;
var rsoList = [];
var rsoFlag = 0;
var currentEvent = 0;

function addUser() {
    var userId = 0;
    var firstName = "";
    var lastName = "";
    var newFirst = document.getElementById("newUserFirst").value;
    var newLast = document.getElementById("newUserLast").value;
    var newUniversity = document.getElementById("newUniversity");
	var newUniValue = newUniversity.options[newUniversity.selectedIndex].value;
    var newEmail = document.getElementById("newUserEmail").value;
    var newUser = document.getElementById("newUserName").value;
    var newPass = document.getElementById("newPassword").value;
    var newPassConf = document.getElementById("confirmPassword").value;
    var hashPass = md5(newPass);

    var flag = 1
    
    // check that all required fields are completed
    if (newFirst == "") {
        document.getElementById("firstNameAlert").innerHTML = "<b>Enter a First Name.</b><br>";
        flag = 0;
    }
    else
        document.getElementById("firstNameAlert").innerHTML = "";

    if (newLast == "") {
        document.getElementById("lastNameAlert").innerHTML = "<b>Enter a Last Name.</b><br>";
        flag = 0;
    }
    else
        document.getElementById("lastNameAlert").innerHTML = "";

    if (newUniValue == "Select a University") {
        document.getElementById("universityAlert").innerHTML = "<b>Please select a university.</b><br>";
        flag = 0;
    }
    else
        document.getElementById("universityAlert").innerHTML = "";


    if (newEmail == "") {
        document.getElementById("emailAlert").innerHTML = "<b>Enter a valid email.</b><br>";
        flag = 0;
    }
    else {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!filter.test(newEmail))
        {
            document.getElementById("emailAlert").innerHTML = "<b>Enter a valid email.</b><br>";
            flag = 0;
        }
        else
            document.getElementById("emailAlert").innerHTML = "";
    }

    if (newUser == "") {
        document.getElementById("usernameAlert").innerHTML = "<b>Enter a username.</b><br>";
        flag = 0;
    }
    else
        document.getElementById("usernameAlert").innerHTML = "";


    if (newPass == "") {
        document.getElementById("passAlert").innerHTML = "<b>Enter a password.</b><br>";
        flag = 0;
    }
    else
        document.getElementById("passAlert").innerHTML = "";


    if (newPassConf == "") {
        document.getElementById("confirmPassAlert").innerHTML = "<b>Confirm your password. </b><br>";
        flag = 0;
    }
    else {
        var n = newPass.localeCompare(newPassConf);
        if (n != 0) {
            flag = 0;
            document.getElementById("confirmPassAlert").innerHTML = "<b>Passwords do not match. </b><br>";
        }
        else
            document.getElementById("confirmPassAlert").innerHTML = "";
    }

    if (flag == 0)
        return false

    if (newUser != "" && newPass != "" && newFirst !="" && newLast != "") {

        // Register a new user
        var jsonPayload = '{"FirstName" : "' + newFirst + '", "LastName" : "' + newLast +  '", "Email" : "' + newEmail +'", "University" : "' + newUniValue + '", "Login" : "' + newUser + '", "Password" : "' + hashPass + '"}';
        var url = urlBase + '/Register.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("registerAlert").innerHTML = "<b>Your account has been successfully created </b><br>";
                }
            };

            xhr.send(jsonPayload);
            var jsonObject = JSON.parse( xhr.responseText);

            if(jsonObject !== "")
            {
                document.getElementById("registerAlert").innerHTML = "<b>Error Creating User: " + xhr.responseText + "</b><br>";
                return false;
            }
            else
            {
            	alert("Account created successfully!");
                window.location.replace("http://18.218.92.43/event_manager/login.html");
                return false; 
            }

        }
        catch (err) {
            document.getElementById("registerAlert").innerHTML = "<b>Username or Email already in use!</b><br>";
            return false;
        }
    }
}

function doLogin()
{
	userId = 0;
    superAdmin = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hashPass = md5(password);

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hashPass + '"}';
	var url = urlBase + '/Login.' + extension;
	
    // Send login data to database and check username and password are correct
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		uniName = jsonObject.uniName;
        superAdmin = jsonObject.superAdmin;

        document.cookie = "userId=" + userId +";";
		document.cookie = "uniName=" + uniName +";";
        document.cookie = "superAdmin=" + superAdmin;


		if( userId < 1 )
		{
		    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect<br>";
            return false;
		}
		
		firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        //alert("Successfully Logged In!");
        window.location.replace("http://18.218.92.43/event_manager/events.html");
        return false;

	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = "<b>Error Logging In: " + err.message + "</b><br>";
	}
}


function doLogout()
{
    //logout the existing user
	userId = 0;
	firstName = "";
    lastName = "";

    window.location.replace("http://18.218.92.43/event_manager/login.html");
    return false;
}

function createRSO()
{
	userId = getCookie("userId");
	uniName = getCookie("uniName");
	var newRsoName = document.getElementById("newRsoName").value;
	var newRsoDesc = document.getElementById("newRsoDesc").value;
	var flag = 1;

    // check all required RSO fields have been completed
	if(newRsoName == "")
	{
		document.getElementById("newRsoNameAlert").innerHTML = "<b>Please enter an RSO name.</b><br>";
		flag = 0;
	}
	else
		document.getElementById("newRsoNameAlert").innerHTML = "";

	if(newRsoDesc == "")
	{
		document.getElementById("newRsoDescAlert").innerHTML = "<b>Please enter an RSO description.</b><br>";
		flag = 0;
	}
	else
		document.getElementById("newRsoDescAlert").innerHTML = "";

	if(flag == 0)
		return false;
	else
	{
		var jsonPayload = '{"RsoName" : "' + newRsoName + '", "RsoDesc" : "' + newRsoDesc + '", "UniName" : "' + uniName + '", "RsoAdmin" : "' + userId + '"}';
        var url = urlBase + '/CreateRSO.' + extension;
        
        // create new RSO
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    	try
		{
			xhr.send(jsonPayload);		
			var jsonObject = JSON.parse( xhr.responseText );


	        window.location.replace("http://18.218.92.43/event_manager/rso.html");
	        return false;

		}
		catch(err)
		{
			document.getElementById("createRsoAlert").innerHTML = "<b>Error Creating RSO: " + err.message + "</b><br>";
		}
		
	}
}

function UserRSO()
{
    checkSuper();
	getRSO();
	userId = getCookie("userId");
	var rowCount = 0;
    var url = urlBase + '/UserRSO.' + extension;
	var jsonSearch = '{"UserID" : "' + userId + '"}';

    // get all RSOs current user is a member of and populate table with contents
	var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
    {
        xhr.send(jsonSearch);

        var jsonObject = JSON.parse( xhr.responseText );
        var i;
	    var tableRef = document.getElementById("viewUserRSOs").getElementsByTagName('tbody')[0];
	    
	    tableRef.innerHTML = "";

        if(xhr.responseText == "Not a Member of any RSOs.")
            return false;

        for(i = 0; i < jsonObject.results.length; i+=3)
        {
        	var tr = document.createElement("tr");
        	tr.setAttribute('name',jsonObject.results[i]);
        	tr.innerHTML = '<td class="product"><strong>' + jsonObject.results[i] + '</strong></td>';
        	tr.innerHTML += '<td class="product">'+ jsonObject.results[i+1] + '</td>';

        	tableRef.appendChild(tr);
        }

        document.getElementById("viewRsoAlert").innerHTML = "";
        return false;
    }

    catch (err) 
    {
        document.getElementById("viewRsoAlert").innerHTML = "<b>Not a member of any RSOs.</b><br>";
    }
}


function getRSO()
{
	uniName = getCookie("uniName");
	var rowCount = 0;
    var url = urlBase + '/GetRSO.' + extension;
	var jsonSearch = '{"UniName" : "' + uniName + '"}';

    // get a list of all joinable RSOs
    if(rsoFlag == 0)
    {
    	var xhr = new XMLHttpRequest();
    	xhr.open("POST", url, false);
    	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try 
        {
            xhr.send(jsonSearch);

            var jsonObject = JSON.parse( xhr.responseText );
            var i,j = 0;
    	    var list = document.getElementById("rsoList");

            for(i = 0; i < jsonObject.results.length; i+=2)
            {
            	var opt = document.createElement("option");
            	opt.text = jsonObject.results[i];
            	opt.value = j;
            	rsoList[j] = jsonObject.results[i+1];
            	j++;
            	list.options.add(opt);
            }

            document.getElementById("getRsoAlert").innerHTML = "";
            rsoFlag = 1;
            return false;
        }

        catch (err) 
        {
            document.getElementById("getRsoAlert").innerHTML = "<b>Error in retrieving all RSOs: " + err.message + "</b><br>";
        }
    }
}

function getRSODesc()
{
	var list = document.getElementById("rsoList");
	var val = list.options[list.selectedIndex].value;
	var rsoData = document.getElementById("rsoDescData");

    // display description of currently selected RSO
	if(val == -1)
	{
		rsoData.innerHTML = "No RSO Selected"
	}
	else
		rsoData.innerHTML = rsoList[val];
}	

function joinRSO()
{
    userId = getCookie("userId");
    var list = document.getElementById("rsoList");
    var rsoName = list.options[list.selectedIndex].text;
    var joinAlert = document.getElementById("joinRsoAlert");

    if(rsoName == "Select an RSO to join")
    {
        joinAlert.innerHTML = "Error: No RSO has been selected";
        return false;
    }
    else
    {
        // join selected RSO
        var url = urlBase + '/JoinRSO.' + extension;
        var jsonSearch = '{"UserID" : "' + userId + '", "RsoName" : "' + rsoName + '"}';

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.send(jsonSearch);
            var jsonObject = JSON.parse(xhr.responseText);

            if(jsonObject !== "")
            {
                joinAlert.innerHTML = "Error joining RSO: " + xhr.responseText + "<br>";
                return false;
            }
            else
            {
                joinAlert.innerHTML = "Successfully joined RSO " + rsoName + ".";
                UserRSO();
                return false; 
            }
        }
        catch(err)
        {
            joinAlert.innerHTML = "Error in joining selected RSO: " + err.message + "<br>";
            return false;
        }
    }
}

function getUniData()
{
    getPending();
    uniName = getCookie("uniName");

    var url = urlBase + '/GetUni.' + extension;
    var jsonSearch = '{"UniName" : "' + uniName + '"}';
    var name = document.getElementById("uniName");
    var address = document.getElementById("uniAddress");
    var city = document.getElementById("uniCity");
    var state = document.getElementById("uniState");
    var zip = document.getElementById("uniZip");
    var desc = document.getElementById("uniDesc");
    var students = document.getElementById("uniStudents");
    var logo = document.getElementById("uniLogoUrl");
    var imgRow = document.getElementById("imgRow");

    // Get existing data for university profile
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonSearch);
        var jsonObject = JSON.parse(xhr.responseText);

        name.value = jsonObject.results[0];
        address.value = jsonObject.results[1];
        city.value = jsonObject.results[2];
        state.value = jsonObject.results[3];
        zip.value = jsonObject.results[4];
        desc.value = jsonObject.results[5];
        students.value = jsonObject.results[6];
        logo.value = jsonObject.results[7];
        
        var newTd = document.createElement("td");
        newTd.innerHTML = "<img src='"+ jsonObject.results[7] + "' width = '100' height = '100'>"
        imgRow.appendChild(newTd);
        return false;
    }
    catch(err)
    {
        document.getElementById("updateUniAlert").innerHTML = "<b>Error retrieving university data: " + err.message + "</b><br>";
    }
}

function updateUniData()
{
    uniName = getCookie("uniName");
    var address = document.getElementById("uniAddress").value;
    var city = document.getElementById("uniCity").value;
    var state = document.getElementById("uniState").value;
    var zip = document.getElementById("uniZip").value;
    var desc = document.getElementById("uniDesc").value;
    var students = document.getElementById("uniStudents").value;
    var logo = document.getElementById("uniLogoUrl").value;

    var url = urlBase + '/UpdateUni.' + extension;
    var jsonSearch = '{"UniName" : "' + uniName + '", "Address" : "' + address +'", "City" : "' + city +'", "State" : "' + state +'", "Zip" : "' + zip 
    +'", "Desc" : "' + desc +'", "Students" : "' + students +'", "Logo" : "' + logo +'"}';

    // Push updated data for university profile
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonSearch);
        document.getElementById("updateUniAlert").innerHTML = "<b>University profile updated!</b><br>";
        return false;
    }
    catch(err)
    {
        document.getElementById("updateUniAlert").innerHTML = "<b>Error updating university data: " + err.message + "</b><br>";
    }

    return false;
}

function createNewEvent()
{
    userId = getCookie("userId");
    var flag = 1;
    var eventName = document.getElementById("eventName");
    var eventType = document.getElementById("eventType");
    var eventCategory = document.getElementById("eventCategory");
    var eventRSO = document.getElementById("eventRSO");
    var eventDesc = document.getElementById("eventDesc");
    var eventLocation = document.getElementById("locationList");
    var eventStartTime = document.getElementById("eventStartTime");
    var eventEndTime = document.getElementById("eventEndTime");
    var eventDate = document.getElementById("eventDate");
    var contactPhone = document.getElementById("contactPhone");
    var contactEmail = document.getElementById("contactEmail");

    // check all required event fields are filled in
    if(eventName.value == "")
    {
        document.getElementById("eventNameAlert").innerHTML = "<b>Please enter an event name.</b>";
        flag = 0;
    }
    else
        document.getElementById("eventNameAlert").innerHTML = "";

    if(eventType.options[eventType.selectedIndex].text == "Select an Event Type")
    {
        document.getElementById("eventTypeAlert").innerHTML = "<br><b>Please select an event type.</b>";
        flag = 0;
    }
    else
        document.getElementById("eventTypeAlert").innerHTML = "";

    if(eventCategory.options[eventCategory.selectedIndex].text == "Select an Event Category")
    {
        document.getElementById("eventCategoryAlert").innerHTML = "<br><b>Please select an event category.</b>";
        flag = 0;
    }   
    else if(eventCategory.options[eventCategory.selectedIndex].text == "RSO")
    {
        document.getElementById("eventCategoryAlert").innerHTML = "";

        if(eventRSO.options[eventRSO.selectedIndex].text == "Select an RSO")
        {
            document.getElementById("eventRSOAlert").innerHTML ="<br><b>Please select an RSO.</b>";
            flag = 0;
        }
        else if(eventRSO.options[eventRSO.selectedIndex].value != userId)
        {
            document.getElementById("eventRSOAlert").innerHTML ="<br><b>Not an admin for this RSO.</b>";
            flag = 0;
        }
        else
            document.getElementById("eventRSOAlert").innerHTML ="";   
    }
    else
    {
        document.getElementById("eventCategoryAlert").innerHTML = "";
        document.getElementById("eventRSOAlert").innerHTML ="";       
    }

    if(eventDesc.value == "")
    {
        document.getElementById("eventDescAlert").innerHTML = "<b>Please enter an event description.</b>";
        flag = 0;
    }
    else
        document.getElementById("eventDescAlert").innerHTML = "";


    if(eventLocation.options[eventLocation.selectedIndex].text == "Select a Location")
    {
        document.getElementById("eventListAlert").innerHTML = "<br><b>Please select a Location </b>";
        flag = 0;
    }
    else
        document.getElementById("eventListAlert").innerHTML = "";

    if(eventStartTime.value == "")
    {
        document.getElementById("eventStartAlert").innerHTML = "<b>Please enter an event start time.</b>";
        flag = 0;
    }
    else
        document.getElementById("eventStartAlert").innerHTML = "";

    if(eventEndTime.value == "")
    {
        document.getElementById("eventEndAlert").innerHTML = "<b>Please enter an event end time.</b>";
        flag = 0;
    }
    else
        document.getElementById("eventEndAlert").innerHTML = "";

    if(eventStartTime.value > eventEndTime.value)
    {
        document.getElementById("eventStartAlert").innerHTML = ""
        document.getElementById("eventEndAlert").innerHTML = "<b>Event cannot end before it begins.</b>";
        flag = 0;
    }
    else
    {
        document.getElementById("eventStartAlert").innerHTML = ""
        document.getElementById("eventEndAlert").innerHTML = "";
    }

    if(eventDate.value == "")
    {
        document.getElementById("eventDateAlert").innerHTML = "<b>Please enter an event date.</b>";
        flag = 0;
    }
    else
        document.getElementById("eventDateAlert").innerHTML = "";

    if(contactPhone.value == "")
    {
        document.getElementById("contactPhoneAlert").innerHTML = "<b>Please enter an contact phone number.</b>";
        flag = 0;
    }
    else
        document.getElementById("contactPhoneAlert").innerHTML = "";

    if(contactEmail.value == "")
    {
        document.getElementById("contactEmailAlert").innerHTML = "<b>Please enter an contact phone number.</b>";
        flag = 0;
    }
    else
        document.getElementById("contactEmailAlert").innerHTML = "";

    if(flag == 1)
    {
        var eveTypeVal = eventType.options[eventType.selectedIndex].text;
        var eveCatVal = eventCategory.options[eventCategory.selectedIndex].text;
        var eveRSOVal = eventRSO.options[eventRSO.selectedIndex].text;
        var eveLocVal = eventLocation.options[eventLocation.selectedIndex].text;
        if(eveRSOVal == 'Select an RSO')
            eveRSOVal = "";

        var url = urlBase + '/CreateEvent.' + extension;
        var jsonSearch = '{"EventName" : "' + eventName.value + '", "EventType" : "' + eveTypeVal +'", "EventCategory" : "' + eveCatVal +'", "EventRSO" : "' + eveRSOVal +
            '", "EventLoc" : "' + eveLocVal +'", "EventDesc" : "' + eventDesc.value +'", "EventStartTime" : "' + eventStartTime.value +'", "EventEndTime" : "' + eventEndTime.value +'", "EventDate" : "' + eventDate.value +
            '", "ContactPhone" : "' + contactPhone.value +'", "ContactEmail" : "' + contactEmail.value +'"}';

        // create a new event
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.send(jsonSearch);

            document.getElementById("createEventAlert").innerHTML= "<b>" + xhr.responseText + "</b>";
            return false
        }
        catch(err)
        {
            document.getElementById("createEventAlert").innerHTML="<b>Error creating Event: "  + err.message + "</b>";
        }
    }


    return false;
}

 function getPending()
 {
    uniName = getCookie("uniName");

    var rowCount = 0;
    var url = urlBase + '/GetPending.' + extension;
    var jsonSearch = '{"UniName" : "' + uniName + '"}';

    // get all events not currently marked as approved
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
         xhr.send(jsonSearch);
         var jsonObject = JSON.parse(xhr.responseText);
         var tableRef = document.getElementById("pendingTable").getElementsByTagName('tbody')[0];
         tableRef.innerHTML = "";

         for(i = 0; i < jsonObject.results.length; i +=11)
         {
            rowCount++;
            var tr = document.createElement("tr");
            tr.innerHTML = "<td><b>"+jsonObject.results[i]+"</b></td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+1]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+2]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+3]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+4]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+5]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+6]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+7]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+8]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+9]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+10]+"</td>";
            var td = document.createElement("td");
            td.setAttribute('eventId',jsonObject.results[i]);
            td.style.backgroundColor = 'lime';
            td.innerHTML = "<button type = 'button'><b>Approve</b></button>";
            var td2 = document.createElement("td");
            td2.setAttribute('eventId',jsonObject.results[i]);
            td2.style.backgroundColor = 'red';
            td2.innerHTML = "<button type = 'button'><b>Decline</b></button>";
            tr.appendChild(td);
            tr.appendChild(td2);
            tableRef.appendChild(tr);
         }
         for (i = 0; i < tableRef.rows.length; i++)
         {
            tableRef.rows[i].cells[11].onclick = function () { approvePending(this.getAttribute("eventId")); };
            tableRef.rows[i].cells[12].onclick = function () { declinePending(this.getAttribute("eventId")); };
         }

         return false;
    }
    catch(err)
    {
        document.getElementById("pendingTableAlert").innerHTML = "<b>No pending events found.</b>";
    }
 }

function approvePending(eventId)
{
    var url = urlBase + '/ApproveEvent.' + extension;
    var jsonSearch = '{"EventId" : "' + eventId + '"}';

    // Change selected event to approved
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonSearch);
        getPending();
        return false;
    }
    catch(err)
    {
        document.getElementById("pendingTableAlert").innerHTML = "<b>Error in approving event: " + err.message +"</b>";
    }

    return false;
}

function declinePending(eventId)
{
    var url = urlBase + '/RemoveEvent.' + extension;
    var jsonSearch = '{"EventId" : "' + eventId + '"}';

    // Delete selected event from database
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonSearch);
        getPending();
        return false;
    }
    catch(err)
    {
        document.getElementById("pendingTableAlert").innerHTML = "<b>Error in declining event: " + err.message +"</b>";
    }

    return false;
}

function checkEventCategory()
{
    var eveCat = document.getElementById("eventCategory");
    var eveCatVal = eveCat.options[eveCat.selectedIndex].value;

    // hide/show RSO list on Create Event page
    if(eveCatVal == "RSO")
    {
        document.getElementById("eventRSO").disabled = false;
    }
    else
    {
        document.getElementById("eventRSO").disabled = true;
    }
    
}

function getCookie(cname) 
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}
	
	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

function checkSuper()
{
    // check if current user is a super admin
    superAdmin = getCookie("superAdmin");
    if(superAdmin != 1)
    {
        hideOrShow("superLink", false)
    }
    else
    {
        hideOrShow("superLink", true)
    }
}

function checkSuperEvent()
{
    superAdmin = getCookie("superAdmin");
    if(superAdmin != 1)
    {
        hideOrShow("superLink", false)
    }
    else
    {
        hideOrShow("superLink", true)
    }

    getLocations();
    getActiveRSO();

}

function getActiveRSO()
{
    userId = getCookie("userId");
    var rowCount = 0;
    var url = urlBase + '/UserActiveRSO.' + extension;
    var jsonSearch = '{"UserID" : "' + userId + '"}';

    // get all RSOs for that university with 5+ members
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
    {
        xhr.send(jsonSearch);

        var jsonObject = JSON.parse( xhr.responseText );
        var i;
        var list = document.getElementById("eventRSO");

        for(i = 0; i < jsonObject.results.length; i+=3)
        {
            var opt = document.createElement("option");
            opt.text = jsonObject.results[i];
            opt.value = jsonObject.results[i+2];
            list.options.add(opt);
        }

        document.getElementById("getRsoAlert").innerHTML = "";
        
        return false;
    }

    catch (err) 
    {
        //document.getElementById("viewRsoAlert").innerHTML = "<b>Error in retrieving your RSOs: " + err.message + "</b><br>";
    }
}

function checkSuperView()
{
    superAdmin = getCookie("superAdmin");
    if(superAdmin != 1)
    {
        hideOrShow("superLink", false)
    }
    else
    {
        hideOrShow("superLink", true)
    }

    initMap();
    getLocations();
    getActiveRSO();
    hideOrShow("uniList",true);
    hideOrShow("locationList",false);
    hideOrShow("eventRSO",false);
    getEvents();
}

function getEvents()
{
    userId = getCookie("userId");
    uniName = getCookie("uniName");

    var rowCount = 0;
    var cat = document.getElementById("eventCat");
    var catVal = cat.options[cat.selectedIndex].text;

    var public = document.getElementById("uniList");
    var publicVal = public.options[public.selectedIndex].text;
    var private = document.getElementById("locationList");
    var privateVal = private.options[private.selectedIndex].text;
    var rso = document.getElementById("eventRSO");
    var rsoVal = rso.options[rso.selectedIndex].text;
    document.getElementById("getEventsAlert").innerHTML = "";


    var url = urlBase + '/GetEvents.' + extension;
    var search = "";

    // get filter criteria
    if(catVal == "Public")
    {
        if(publicVal == "Show All Universities")
            search = "All";
        else
            search = publicVal;
    }
    else if(catVal == "Private")
    {
        if(privateVal == "Show All Locations")
            search = "All";
        else
            search = privateVal;
    }
    else if(catVal == "RSO")
    {
        if(rsoVal == "Show All RSOs")
            search = "All";
        else
            search = rsoVal;
    }

    // get all approved events which match filter criteria
    var jsonSearch = '{"UserId" : "' + userId + '", "UniName" : "' + uniName +'", "Category" : "' + catVal + '", "Search" : "' + search + '"}';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
         xhr.send(jsonSearch);
    
         var jsonObject = JSON.parse(xhr.responseText);
         var tableRef = document.getElementById("eventTable").getElementsByTagName('tbody')[0];
         tableRef.innerHTML = "";

         for(i = 0; i < jsonObject.results.length; i +=14)
         {
            rowCount++;
            var tr = document.createElement("tr");
            tr.innerHTML = "<td><b>"+jsonObject.results[i+1]+"</b></td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+2]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+3]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+4]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+5]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+6]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+7]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+8]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+9]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+10]+"</td>";
            tr.innerHTML += "<td>"+jsonObject.results[i+11]+"</td>";

            
            var td = document.createElement("td");
            td.setAttribute('latitude',jsonObject.results[i+12]);
            td.setAttribute('longitude',jsonObject.results[i+13]);
            td.style.backgroundColor = 'lightblue';
            td.innerHTML = "<button type = 'button'><b>View on Map</b></button>";

            var td2 = document.createElement("td");
            td2.setAttribute('eventId',jsonObject.results[i]);
            td2.style.backgroundColor = 'tan';
            td2.innerHTML = "<button type = 'button'><b>View Comments</b></button>";

            tr.appendChild(td);
            tr.appendChild(td2);
            tableRef.appendChild(tr);

         }
         for (i = 0; i < tableRef.rows.length; i++)
         {
            tableRef.rows[i].cells[11].onclick = function () { updateMap(this.getAttribute("latitude"),this.getAttribute("longitude")); };
            tableRef.rows[i].cells[12].onclick = function () { openComments(this.getAttribute("eventId")); };
         }
         return false;
    }
    catch(err)
    {
        document.getElementById("getEventsAlert").innerHTML = "<b>No Events matching search filters found.</b>";
    }

    return false;
}

function updateMap(mapLat,mapLong)
{
    // update google map with passed in lat,long
    var uniLat = parseFloat(mapLat);
    var uniLong = parseFloat(mapLong);

    var base = {lat: uniLat, lng: uniLong}
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 16,
        center: base
    });

    var marker = new google.maps.Marker({position: base, map: map});
}

function openComments(eventId)
{
    // open Comments modal for event
    var modal = document.getElementById("commentModal");
    var span = document.getElementsByClassName("close")[0];
    currentEvent = eventId;

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    }

    document.getElementById("getCommentsAlert").innerHTML = "";
    document.getElementById("addCommentsAlert").innerHTML = "";
    getComments(eventId);
}

function getComments(eventId)
{
    // get comments for that event
    userId = getCookie("userId");
    var rowCount = 0;
    var url = urlBase + '/GetComments.' + extension;
    var jsonSearch = '{"UserId" : "' + userId + '", "EventId" : "' + eventId +'"}';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonSearch);

        if(xhr.responseText == 'No comments found for this event."')
        {
            document.getElementById("getCommentsAlert").innerHTML = "<b>No comments found for this event.</b>";
            return false;
        }
        else
        {
             var jsonObject = JSON.parse(xhr.responseText);
             var tableRef = document.getElementById("commentTable").getElementsByTagName('tbody')[0];
             tableRef.innerHTML = "";

             //alert(xhr.responseText);
             for(i = 0; i < jsonObject.results.length; i +=5)
             {
                rowCount++;
                var tr = document.createElement("tr");
                tr.innerHTML = "<td><b>"+jsonObject.results[i]+"</b></td>";
                if(userId != jsonObject.results[i+2])
                {
                    tr.innerHTML += "<td><input type='text' id='comment"+ jsonObject.results[i+1] +"' value='"+jsonObject.results[i+3]+"'disabled></td>";
                    tr.innerHTML += "<td><input type='text' id='rating"+ jsonObject.results[i+1] +"' value='"+jsonObject.results[i+4]+"'disabled></td>";  
 
                }
                else
                {
                    tr.innerHTML += "<td><input type='text' id='comment"+ jsonObject.results[i+1] +"' value='"+jsonObject.results[i+3]+"'></td>";
                    tr.innerHTML += "<td><input type='text' id='rating"+ jsonObject.results[i+1] +"' value='"+jsonObject.results[i+4]+"'></td>"; 
                }
                

                var td = document.createElement("td");
                td.setAttribute('userId',jsonObject.results[i+2]);
                td.setAttribute('commentId',jsonObject.results[i+1]);
                td.style.backgroundColor = 'yellow';
                td.innerHTML = "<button type = 'button'><b>Update Comment</b></button>";

                var td2 = document.createElement("td");
                td2.setAttribute('userId',jsonObject.results[i+2]);
                td2.setAttribute('commentId',jsonObject.results[i+1]);
                td2.style.backgroundColor = 'red';
                td2.innerHTML = "<button type = 'button'><b>Delete Comment</b></button>";

                tr.appendChild(td);
                tr.appendChild(td2);
                tableRef.appendChild(tr);
             }
             
             for (i = 0; i < tableRef.rows.length; i++)
             {
                tableRef.rows[i].cells[3].onclick = function () { updateComment(this.getAttribute("userId"),this.getAttribute("commentId")); };
                tableRef.rows[i].cells[4].onclick = function () { deleteComment(this.getAttribute("userId"),this.getAttribute("commentId")); };
             }
        }
            
    }
    catch(err)
    {
        document.getElementById("getCommentsAlert").innerHTML = "<b>No comments found for selected event.</b>";
    }
}

function addComment()
{
    // Add new comments to an event

    userId = getCookie("userId");
    var newCommentText = document.getElementById("newCommentText").value;
    var newCommentRating = document.getElementById("ratingSelect").options[document.getElementById("ratingSelect").selectedIndex].text;
    var flag = 1;

    if(newCommentText == "")
    {
        document.getElementById("newCommentTextAlert").innerHTML = "<br><b>Please enter your comment text.</b>";
        flag = 0;
    }
    else
        document.getElementById("newCommentTextAlert").innerHTML = "";

    if(newCommentRating == "Select a Rating")
    {
        document.getElementById("newCommentRatingAlert").innerHTML = "<br><b>Please select a rating.</b>";
        flag = 0;
    }
    else
        document.getElementById("newCommentRatingAlert").innerHTML = "";

    if(flag == 0)
        return false;
    else
    {
        var jsonPayload = '{"UserId" : "' + userId + '", "EventId" : "' + currentEvent + '", "CommentContent" : "' + newCommentText + '", "Rating" : "' + newCommentRating + '"}';
        var url = urlBase + '/AddComment.' + extension;
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.send(jsonPayload);      
            document.getElementById("addCommentsAlert").innerHTML = "<b>"+xhr.responseText+"</b>";

            getComments(currentEvent);
            return false;

        }
        catch(err)
        {
            document.getElementById("addCommentsAlert").innerHTML = "<b>Error Adding Comment: " + err.message + "</b><br>";
        }
        
    }
    return false;
}

function updateComment(commentUserId,commentId)
{
    // update an existing comment for an event
    userId = getCookie("userId");
    if(userId != commentUserId)
    {
        document.getElementById("addCommentsAlert").innerHTML = "<b>Cannot update other user's comments.</b><br>";
        return false;
    }
    else
    {
        var tableRef = document.getElementById("commentTable").getElementsByTagName('tbody')[0];
        var rowIndex = 0;

        for(i = 0; i < tableRef.rows.length; i++)
        {
            if(tableRef.rows[i].cells[3].getAttribute("commentId") == commentId)
                rowIndex = i;
        }

        var textId = "comment"+commentId;
        var ratingId = "rating"+commentId;
        var text = document.getElementById(textId).value;
        var rating = document.getElementById(ratingId).value;

        var jsonPayload = '{"CommentId" : "' + commentId + '", "CommentContent" : "' + text + '", "Rating" : "' + rating + '"}';
        var url = urlBase + '/UpdateComment.' + extension;
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.send(jsonPayload);      
            document.getElementById("addCommentsAlert").innerHTML = "<b>"+xhr.responseText+"</b>";

            getComments(currentEvent);
            return false;

        }
        catch(err)
        {
            document.getElementById("addCommentsAlert").innerHTML = "<b>Error Updating Comment: " + err.message + "</b><br>";
        }
    }
}

function deleteComment(commentUserId,commentId)
{
    // remove existing comment from an event
    userId = getCookie("userId");
    if(userId != commentUserId)
    {
        document.getElementById("addCommentsAlert").innerHTML = "<b>Cannot delete other user's comments.</b><br>";
        return false;
    }
    else
    {
        var jsonPayload = '{"CommentId" : "' + commentId + '"}';
        var url = urlBase + '/DeleteComment.' + extension;
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.send(jsonPayload);      
            document.getElementById("addCommentsAlert").innerHTML = "<b>"+xhr.responseText+"</b>";

            getComments(currentEvent);
            return false;

        }
        catch(err)
        {
            document.getElementById("addCommentsAlert").innerHTML = "<b>Error Deleting Comment: " + err.message + "</b><br>";
        }
    }
}

function showCat()
{
    // show/hide appropriate filter lists on events page
    var cat = document.getElementById("eventCat");
    var catVal = cat.options[cat.selectedIndex].text;

    if(catVal == "Public")
    {
        hideOrShow("uniList",true);
        hideOrShow("locationList",false);
        hideOrShow("eventRSO",false);

    }
    else if(catVal == "Private")
    {
        hideOrShow("uniList",false);
        hideOrShow("locationList",true);
        hideOrShow("eventRSO",false);
    }
    else if(catVal == "RSO" )
    {
        hideOrShow("uniList",false);
        hideOrShow("locationList",false);
        hideOrShow("eventRSO",true);
    }

}

function initMap()
{
    // initialize google map on events page
    var uniLat = 28.602068;
    var uniLong = -81.200445;

    uniName = getCookie("uniName");
    if(uniName == "University of South Florida")
    {
        uniLat = 28.064027;
        uniLong = -82.413270;
    }


    var base = {lat: uniLat, lng: uniLong}
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 16,
        center: base
    });

    var marker = new google.maps.Marker({position: base, map: map});
}

function getLocations()
{       
    // get list of locations for current university
    uniName = getCookie("uniName");

    var rowCount = 0;
    var url = urlBase + '/GetLocation.' + extension;
    var jsonSearch = '{"UniName" : "' + uniName + '"}';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
    {
        
        xhr.send(jsonSearch);

        var jsonObject = JSON.parse( xhr.responseText );
        var i;
        var list = document.getElementById("locationList");

        for(i = 0; i < jsonObject.results.length; i++)
        {
            var opt = document.createElement("option");
            opt.text = jsonObject.results[i];
            list.options.add(opt);
        }

        document.getElementById("locationListAlert").innerHTML = "";
        return false;


    }

    catch (err) 
    {
        //document.getElementById("viewRsoAlert").innerHTML = "<b>Error in retrieving your RSOs: " + err.message + "</b><br>";
    }
}