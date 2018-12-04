var listTchatRoom;

$( document ).ready(function() {
	getAllTchatRoom();
	
	$( "#addGrp" ).click(function() {
		$('#myModal').modal('show');
	});
	
	
	$( "#createRoom" ).click(function() {
		createTchatRoom();
		$('#myModal').modal('hide');
	});
});

// -- GESTION DES EVENEMENTS 

function getAllTchatRoom() {
	$('.grpSelector').empty();
	var listTchatRoom = [];
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
			html +='<div class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
				</div>\
				<div class="col-xs-9">\
					<p class="grpName">'+ listTchatRoom[i] +'</p>\
					<p class="lastMsgGrp"></p>\
					<p class="lastMsgTime"></p>\
				</div></div></div>';
		}
		$('.grpSelector').append(html);
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
	var dataToSend = {
			'message': 'Bonjour',
			'user':'jper',
			'tchatRoom': 'bjr',
			'date': new Date().getTime(),
	}
	
	
	$.ajax({
	    url: '/createEventSendMessage',
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