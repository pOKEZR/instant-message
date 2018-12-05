var listTchatRoom;
var currentTchatRoom;
var username;

$( document ).ready(function() {
	rgpd();
	$('#loginModal').modal({backdrop: 'static', keyboard: false})  
		reloadUser();
	getAllTchatRoom();
	$('#currentGrpName').text(currentTchatRoom)
	getAllMessagesByTchatRoomName(currentTchatRoom);
	$('#grpMsgContainer').animate({scrollTop: 100000},1000);
	$( "#addGrp" ).click(function() {
		$('#myModal').modal('show');
	});
	$('#sendMessageImg').click(function () {
		sendMessagePicture();
	})
	
	$('#registerUser').click(function () {
		createUser();
	});
	
	$( "#createRoom" ).click(function() {
		createTchatRoom();
		$('#myModal').modal('hide');
	});
	
	$('#loginUser').click(function () {
		loginUser();
	});
	$('#sendImg').click(function () {
		$('#imgModal').modal('show');
	})
	
	$('body').on('click', '.groupBorder', function(param) {
	  switchGrp(this.attributes[0].value);
	  currentTchatRoom = this.attributes[0].value;
		$('#grpMsgContainer').animate({scrollTop: 100000},1000);

	});
	
	$('#sendMsg').click(function () {
		sendMessage();
	});
	
	$('.disconnectBtn').click(function () {
		disconnectedUser();
	});
	window.setInterval(function(){
		getAllMessagesByTchatRoomName(currentTchatRoom);
		}, 1000);
	
});

// -- GESTION DES EVENEMENTS 

function getAllTchatRoom() {
	$('.grpSelector').empty();
	$.ajax({
	    url: '/listTchatRoomName',
	    type: 'GET',
	    async:false,
	    success: function(data) { 
	    	listTchatRoom = data.tchatRoomName;
	    	}
	});
	
	if(listTchatRoom.length != 0) {
		// Dans ce cas là on va préparer à append la liste des groupes
		var html = "";
		for (var i = 0; i < listTchatRoom.length;i++) {
			html +='<div grpName="' + listTchatRoom[i] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
				</div>\
				<div class="col-xs-9">\
					<p class="grpName">'+ listTchatRoom[i] +'</p>\
					<p class="lastMsgGrp"></p>\
					<p class="lastMsgTime"></p>\
				</div></div></div>';
		}
		$('.grpSelector').append(html);
		if(	$.cookie("tchatRoomNameCookie") != null) {
			currentTchatRoom = 	$.cookie("tchatRoomNameCookie")

		} else {
			currentTchatRoom = listTchatRoom[0];
		}
	}

}

function createTchatRoom() {
	var TchatRooms = {
			"roomName": $('#createRoomTxt').val(),
	}
	$.ajax({
	    url: '/createTchatRoom',
	    dataType : "json",
	    contentType: "application/json; charset=utf-8",
	    type: 'POST',
	    async:false,
	    data: JSON.stringify(TchatRooms),
	    success: function(data) { 
	    	getAllTchatRoom();
	    	}
	});
}

function sendMessage() {
	if($('#msgArea').val() == "") {
		return;
	}
	if($('#msgArea').val().length > 60) {
		toastr.error('Erreur : maximum de 60 charactères autorisé')
		return;
	}
	// Création de la date formaté HH:MM
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();

	var dataToSend = {
			'message': $('#msgArea').val(),
			'user': username,
			'tchatRoom': currentTchatRoom,
			'date': hours + ":" + minutes,
	}
	
	
	$.ajax({
	    url: '/createEventSendMessage',
	    dataType : "json",
	    contentType: "application/json; charset=utf-8",
	    type: 'POST',
	    async:false,
	    data: JSON.stringify(dataToSend),
	    success: function(data) { 
	    	getAllMessagesByTchatRoomName(currentTchatRoom);
	    	$('#msgArea').val("");
	    	$('#grpMsgContainer').animate({scrollTop: 100000},1000);
	    }
	});
}

function createUser() {

	var dataToSend = {
			'userName': $('#loginTxt').val(),
			'password': $('#passwordTxt').val(),
	}
	$.ajax({
	    url: '/createUser',
	    dataType : "json",
	    contentType: "application/json; charset=utf-8",
	    type: 'POST',
	    async:false,
	    data: JSON.stringify(dataToSend),
	    success: function(data) { 
	    	if(data.success == true) {
	    		loginUser();
	    	}
	    	}
	});
}

function loginUser() {
	var dataToSend = {
			'userName': $('#loginTxt').val(),
			'password': $('#passwordTxt').val(),
	}
	
	$.ajax({
	    url: '/eventCheckIsUserExist',
	    dataType : "json",
	    contentType: "application/json; charset=utf-8",
	    type: 'POST',
	    async:false,
	    data: JSON.stringify(dataToSend),
	    success: function(data) { 
	    	if(data.success) {
	    		username = dataToSend.userName;
	    		$('#loginModal').modal('hide');
	    		$.cookie("pseudo", username, { expires : 1 });
	    		$('.disconnectBtn').removeClass('hidden');
	    	}
	    	},
		error: function(data) {
    		toastr.error('Nom d\'utilisateur ou mot de passe incorrect', 'Erreur')
		}
	});
}



function getAllMessagesByTchatRoomName(tchatRoomName) {
	var listOfMessages;
	var dataToSend = {
		'roomName': tchatRoomName,
	}
	$.ajax({
	    url: '/listMessagesByTchatRoom',
	    dataType : "json",
	    contentType: "application/json; charset=utf-8",
	    type: 'POST',
	    async:false,
	    data: JSON.stringify(dataToSend),
	    success: function(data) { 
	    		listOfMessages = data.msgList;
	    	}
	});
	
		// Parcours de la liste des messages et affichage 
		var html = "";
		$('#grpMsgContainer').empty();
		if(listOfMessages != null) {

		for (var i = 0; i < listOfMessages.length;i++) {
			
			var temp = listOfMessages[i].split('|');
			
			html += '	<div class="bubble">\
							<p class="bold textMessage">'+ temp[0]+' : </p>\
							<p class="textMessage">' + temp[1] +'</p>\
							<p class="textMessageTime">' + temp[2] +'</p>\
						</div>';
		}
		$('#grpMsgContainer').append(html);
	}
}

function switchGrp(tchatRoomName) {
	$('#currentGrpName').text(tchatRoomName);
	getAllMessagesByTchatRoomName(tchatRoomName);
	$.cookie("tchatRoomNameCookie", tchatRoomName)

}

function keyPress() {
	var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
    	sendMessage();
    }
}

function validPassword() {
	var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
    	loginUser();
    }
	
}

function reloadUser() {
	// Fonction qui va récupérer le cookie de l'utilisateur (pseudo) et le logger automatiquement.
	var cookieValue = $.cookie("pseudo");
	
	if(cookieValue != null) {
		toastr.success("Bon retour parmi nous !","Hello !");
		username = cookieValue;
		$('#loginModal').modal("hide")
	} else {
		$('.disconnectBtn').addClass('hidden');
	}
}

function sendMessagePicture() {
	// Format acceptés : jpeg, jpg, gif, png, webp
	var link = $('#linkTxt').val()
	extension = link.split('.').pop();

	if(extension == "jpeg" || extension == "jpg" || extension == "gif" || extension == "png" || extension == "webp") {
	var msgLink = "<img class='maxWidthImg' src='"+ $('#linkTxt').val()+"'</img>";
	
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();

	var dataToSend = {
			'message': msgLink,
			'user': username,
			'tchatRoom': currentTchatRoom,
			'date': hours + ":" + minutes,
	}
	
	
	$.ajax({
	    url: '/createEventSendMessage',
	    dataType : "json",
	    contentType: "application/json; charset=utf-8",
	    type: 'POST',
	    async:false,
	    data: JSON.stringify(dataToSend),
	    success: function(data) { 
	    	getAllMessagesByTchatRoomName(currentTchatRoom);
	    	if(data.success) {
	    		$('#linkTxt').val(""); // Clear du texte
	    		$('#imgModal').modal('hide');
	    		$('#grpMsgContainer').animate({scrollTop: 100000},1000);
	    	}
	    }
	});
	} else {
		toastr.error("Format non supporté", "Erreur");
	}
}

function disconnectedUser() {
	$.removeCookie("pseudo");
	window.location.reload();
}


function rgpd() {
	//Change these values
	  var msg = "Nous utilisons les cookies pour faire fonctionner le site. Vous n'avez pas le choix";
	  var closeBtnMsg = "OK";
	  var privacyBtnMsg = "Conditions d'utilisation";
	  var privacyLink = "https://www.youtube.com/embed/9i3alzuVFXo?autoplay=1";
	  
	  //check cookies 
	  if(document.cookie){
	   var cookieString = document.cookie;
	   var cookieList = cookieString.split(";");
	   // if cookie named OKCookie is found, return
	   for(x = 0; x < cookieList.length; x++){
	     if (cookieList[x].indexOf("OKCookie") != -1){return}; 
	   }
	  }
	  
	  var docRoot = document.body;
	  var okC = document.createElement("div");
	  okC.setAttribute("id", "okCookie");
	  var okCp = document.createElement("p");
	  var okcText = document.createTextNode(msg); 
	  
	  //close button
	  var okCclose = document.createElement("a");
	  var okcCloseText = document.createTextNode(closeBtnMsg);
	  okCclose.setAttribute("href", "#");
	  okCclose.setAttribute("id", "okClose");
	  okCclose.appendChild(okcCloseText);
	  okCclose.addEventListener("click", closeCookie, false);
	 
	  //privacy button
	  var okCprivacy = document.createElement("a");
	  var okcPrivacyText = document.createTextNode(privacyBtnMsg);
	  okCprivacy.setAttribute("href", privacyLink);
	  okCprivacy.setAttribute("id", "okCprivacy");
	  okCprivacy.appendChild(okcPrivacyText);
	  
	  //add to DOM
	  okCp.appendChild(okcText);
	  okC.appendChild(okCp);
	  okC.appendChild(okCclose);
	  okC.appendChild(okCprivacy);
	  docRoot.appendChild(okC);
	  
	  okC.classList.add("okcBeginAnimate");
	  
	  function closeCookie(){
	    var cookieExpire = new Date();
	    cookieExpire.setFullYear(cookieExpire.getFullYear() +2);
	    document.cookie="OKCookie=1; expires=" + cookieExpire.toGMTString() + ";";
	    docRoot.removeChild(okC);
	  }
}