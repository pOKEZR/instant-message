var listTchatRoom;
var currentTchatRoom;
var username = 'jper';

$( document ).ready(function() {
	getAllTchatRoom();
	$('#currentGrpName').text(currentTchatRoom)
	getAllMessagesByTchatRoomName(currentTchatRoom);
	
	$( "#addGrp" ).click(function() {
		$('#myModal').modal('show');
	});
	
	
	$( "#createRoom" ).click(function() {
		createTchatRoom();
		$('#myModal').modal('hide');
	});
	
	$('body').on('click', '.groupBorder', function(param) {
	  switchGrp(this.attributes[0].value);
	});
	
	$('#sendMsg').click(function () {
		sendMessage();
	});
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
		currentTchatRoom = listTchatRoom[0];
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
	
	// Création de la date formaté HH:MM
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	console.log(hours + ":" + minutes);

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
	    }
	});
}

function createUser() {

	var dataToSend = {
			'userName': 'jper',
			'password': 'patate',
	}
	$.ajax({
	    url: '/createUser',
	    dataType : "json",
	    contentType: "application/json; charset=utf-8",
	    type: 'POST',
	    async:false,
	    data: JSON.stringify(dataToSend),
	    success: function(data) { 
	    	console.log(data);
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
			html += '	<div class="bubble">\
							<p class="textMessage">' + listOfMessages[i] +'</p>\
							<p class="textMessageTime">NaN</p>\
						</div>';
		}
		$('#grpMsgContainer').append(html);
	}
}

function switchGrp(tchatRoomName) {
	$('#currentGrpName').text(tchatRoomName);
	getAllMessagesByTchatRoomName(tchatRoomName);

}