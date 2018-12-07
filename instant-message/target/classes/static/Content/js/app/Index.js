var listTchatRoom; // Contient la liste des tchatrooms
var currentTchatRoom; // Tchatroom actuelle de l'utilisateur, récupérable en cookie ou bien au switch de tchatroom
var username; // Contient l'username de l'utilisateur, soit récupéré en cookie soit à la connexion
var oldMessages = []; // Récupération du cookie contenant les anciens messages

$(document).ready(function () {
    rgpd(); // Fct légale pour afficher le RGPD (utilisation des cookies)
    $('#loginModal').modal({ backdrop: 'static', keyboard: false })
    reloadUser();
    getAllTchatRoom();
    $('#currentGrpName').text(currentTchatRoom)
    getAllMessagesByTchatRoomName(currentTchatRoom);
    $('#grpMsgContainer').animate({ scrollTop: 100000 }, 1000);
    $("#addGrp").click(function () {
        $('#myModal').modal('show');
    });
    $('#sendMessageImg').click(function () {
        sendMessagePicture();
    })

    $('#registerUser').click(function () {
        createUser();
    });

    $("#createRoom").click(function () {
        createTchatRoom();
        $('#myModal').modal('hide');
    });

    $('#loginUser').click(function () {
        loginUser();
    });
    $('#sendImg').click(function () {
        $('#imgModal').modal('show');
    })

    $('body').on('click', '.groupBorder', function (param) {
        switchGrp(this.attributes[0].value);
        currentTchatRoom = this.attributes[0].value;
        $('#grpMsgContainer').animate({ scrollTop: 100000 }, 1000);

    });

    $('#sendMsg').click(function () {
        sendMessage();
    });

    $('.disconnectBtn').click(function () {
        disconnectedUser();
    });
    window.setInterval(function () {
         getAllMessagesByTchatRoomName(currentTchatRoom);
        getAllTchatRoomAndLastMessage();
        $('#grpMsgContainer').animate({ scrollTop: 100000 }, 1000);
    }, 1000);

});

// -- GESTION DES EVENEMENTS 

function getAllTchatRoom() {
    $('.grpSelector').empty();
    $.ajax({
        url: '/listTchatRoomName',
        type: 'GET',
        async: false,
        success: function (data) {
            listTchatRoom = data.tchatRoomName;
        }
    });

    if (listTchatRoom.length != 0) {
        // Dans ce cas là on va préparer à append la liste des groupes
        var html = "";
        for (var i = 0; i < listTchatRoom.length; i++) {
            html += '<div grpName="' + listTchatRoom[i] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
				</div>\
				<div class="col-xs-9">\
					<p class="grpName">'+ listTchatRoom[i] + '</p>\
					<p class="lastMsgGrp"></p>\
					<p class="lastMsgTime"></p>\
				</div></div></div>';
        }
        $('.grpSelector').append(html);
        if ($.cookie("tchatRoomNameCookie") != null) {
            currentTchatRoom = $.cookie("tchatRoomNameCookie")

        } else {
            currentTchatRoom = listTchatRoom[0];
        }
    }

}


function getAllTchatRoomAndLastMessage() {
    // Fonction qui est appellé chaque seconde, rafraichissement des tchatrooms et affichage du dernier message
    // Au format HH:MM
    $('.grpSelector').empty(); // On vide l'html pour pouvoir le remplacer
    var html = "";

    // Récupération de toutes les tchatrooms
    $.ajax({
        url: '/listTchatRoomName',
        type: 'GET',
        async: false,
        success: function (data) {
            listTchatRoom = data.tchatRoomName;
        }
    });

    // On parcours la liste des tchatrooms et on va récupérer le dernier message de chacune
    var listTchatRoomComplete = [];
    var listNewTchatRoom = [];
    for (var i = 0; i < listTchatRoom.length; i++) {
        // On va créer une seconde liste qu'on va push dans la première pour pouvoir
        // contenir le nom de la tchatroom en position 0 et le split du message en 1 2 et 3
        var locList = [];
        locList.push(listTchatRoom[i]);

        var dataToSend = {
            'roomName': listTchatRoom[i],
        }
        $.ajax({
            url: '/listMessagesByTchatRoom',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            async: false,
            data: JSON.stringify(dataToSend),
            success: function (data) {
                msg = data.msgList;
            }
        });

        // Vérification du contenu récupéré
        if (msg != null) {
            // On récupère alors le dernier message qu'on split 
            var lastMsg = msg[msg.length - 1];
            var fullMsg = lastMsg.split('|');
            // Maintenant on envoi le message complet dans l'arraylist locList 
            locList.push(fullMsg);
        }
        listTchatRoomComplete.push(locList);
       // listNewTchatRoom.push(locList);
    }

    // On récupère la valeur de notre cookie oldMessage pour comparer avec notre liste actuelle
    var oldMessages = $.cookie("oldMessages");

    if(oldMessages != null) {
    	alert('aaa');
    } else {
    	// Première visite ou alors cookie expiré : on en peut pas comparer, tous les messages viennent en gras
    	for (var i = 0; i < listTchatRoomComplete.length;i++) {
    		var displayMsg = "";
    		try {
    		var roomTitle = listTchatRoomComplete[i][0];
    		var lastPosterName = listTchatRoomComplete[i][1][0];
    		var lastPosterMsg = listTchatRoomComplete[i][1][1];
    		var lastPosterTime = listTchatRoomComplete[i][1][2];
    		
    		if(lastPosterMsg.charAt(0) == "<") {
    			// Ouverture de balise img on va modifier le displayMsg
    			displayMsg = lastPosterName + " a envoyé une image";
    		} else {
    			displayMsg = lastPosterName + " : " + lastPosterMsg;
    		}
    		} catch(error) {
    			var roomTitle = listTchatRoomComplete[i][0];
    			var lastPosterName = "";
    			var lastPosterMsg = "";
    			var lastPosterTime = "";
    			
    		}
    		
    		 html += '<div grpName="' + roomTitle + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
 						<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
    		 		  </div>\
    		 		  <div class="col-xs-9">\
		        			<p class="grpName">'+ roomTitle + '</p>\
		        <p class="lastMsgGrp">' + displayMsg + '</p>\
	            <p class="lastMsgTime">' + lastPosterTime + '</p>\
	        </div></div></div>';
    	}
    	
//    	for(var i = 0 ; listNewTchatRoom.length;i++) {
//    		 html += '<div grpName="'+ listNewTchatRoom[i] +'" class="groupBorder col-xs-12">\
//    		 	<div class="row"><div class="col-xs-3 grpPicture">\
//				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
//	 		  </div>\
//	 		  <div class="col-xs-9">\
//     			<p class="grpName"></p>\
//     <p class="lastMsgGrp"></p>\
//     <p class="lastMsgTime"></p>\
// </div></div></div>';
//    	}
    }
    $('.grpSelector').append(html);

    
    
    
    return;
    // Ce n'est pas la première visite ou alors le cookie n'a pas expiré au bout d'1 jour : on va comparer
    if (oldMessages != null) {
        for (var i = 0; i < listTchatRoomComplete.length; i++) {
            if (listTchatRoomComplete[i][0] == oldMessages[i][0]) {
                alert('aaa');
            }
        }
    } else {
        var html = "";
       
        // Première visite de l'utilisateur ou alors le cookie à expiré : on met tout en gras asuf la tchatroom dans laquelle il est.
        for (var i = 0; i < listTchatRoomComplete.length; i++) {
        	 displayMessage = "";
             //                 displayMessage += listTchatRoomComplete[i][1][0] + " : " + listTchatRoomComplete[i][1][1] 
             var temp = listTchatRoomComplete[i][1][1];
             if (temp.charAt(0) == "<") {
                 displayMessage = listTchatRoomComplete[i][1][0] + " : a envoyé une image";
             }
             time = "";
        	
        	
        	
        	if (listTchatRoom[i][0] == currentTchatRoom) {
                time = listTchatRoomComplete[i][1][2];
                html += '<div grpName="' + listTchatRoomComplete[i][0] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
                			<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
			            </div>\
			            <div class="col-xs-9">\
					        <p class="grpName">'+ listTchatRoomComplete[i][0] + '</p>\
					        <p class="lastMsgGrp">' + displayMessage + '</p>\
				            <p class="lastMsgTime">' + time + '</p>\
				        </div></div></div>';
            } else {
                displayMessage += listTchatRoomComplete[i][1][0] + " : " + listTchatRoomComplete[i][1][1] 
                time = displayMessage += listTchatRoomComplete[i][1][2];

                  // L'utilisateur n'est pas sur la tchatroom on va afficher le message en gras pour lui signifier qu'il doit regarder
                html += '<div grpName="' + listTchatRoomComplete[i][0] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
				</div>\
				<div class="col-xs-9">\
					<p class="grpName">'+ listTchatRoomComplete[i][0] + '</p>\
					<p class="bold lastMsgGrp">' + displayMessage + '</p>\
					<p class="bold lastMsgTime">' + time + '</p>\
				</div></div></div>';
            }
        }
    }
    $('.grpSelector').append(html);
    $.cookie("oldMessages", listTchatRoomComplete);

}
        // Première visite : tous les messages sauf celui de sa room sont affichés en gras
//    } else {
//        for (var i = 0; i < listTchatRoomComplete.length; i++) {

//            var temp = listTchatRoom[i];
//            var displayMessage = ""; // Variable qu'on va renvoyer à l'écran : a parser
//            var time = "";
//            if (temp[1].charAt(0) == "<") {
//                // C'est une image donc on va renvoyer un texte disant que l'utilisateur a envoyé une image
//                displayMessage = detailMessage[0] + " a envoyé une image";
//                time = detailMessage[2];
//            } else {
//                displayMessage = detailMessage[1];
//                time = detailMessage[2];
//            }
//            //			} else {
//            //				displayMessage = "";
//            //				time = "";
//            //			}


//            if (currentTchatRoom == listTchatRoom[i]) {

//                html += '<div grpName="' + listTchatRoom[i] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
//				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
//				</div>\
//				<div class="col-xs-9">\
//					<p class="grpName">'+ listTchatRoom[i] + '</p>\
//					<p class="lastMsgGrp">' + displayMessage + '</p>\
//					<p class="lastMsgTime">' + time + '</p>\
//				</div></div></div>';
//            } else {
//                // L'utilisateur n'est pas sur la tchatroom on va afficher le message en gras pour lui signifier qu'il doit regarder
//                html += '<div grpName="' + listTchatRoom[i] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
//				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
//				</div>\
//				<div class="col-xs-9">\
//					<p class="grpName">'+ listTchatRoom[i] + '</p>\
//					<p class="bold lastMsgGrp">' + displayMessage + '</p>\
//					<p class="bold lastMsgTime">' + time + '</p>\
//				</div></div></div>';
//            }
//        }

//    }
//}


//// Pour finir on envoi notre liste généré au cookie pour l'évaluer au prochain appel
//$.cookie("oldMessages", listTchatRoomComplete, { expires: 1 }); // Le cookie expire au bout d'1 jour
//// Fonction qui est appellé chaque seconde, rafraichi le nom des tchats rooms et affiche le dernier message + HH:MM
//$('.grpSelector').empty();
//$.ajax({
//    url: '/listTchatRoomName',
//    type: 'GET',
//    async: false,
//    success: function (data) {
//        listTchatRoom = data.tchatRoomName;
//    }
//});

//if (listTchatRoom.length != 0) {
//    // Dans ce cas là on va préparer à append la liste des groupes
//    var html = "";
//    for (var i = 0; i < listTchatRoom.length; i++) {
//        var msg;
//        var dataToSend = {
//            'roomName': listTchatRoom[i],
//        }
//        $.ajax({
//            url: '/listMessagesByTchatRoom',
//            dataType: "json",
//            contentType: "application/json; charset=utf-8",
//            type: 'POST',
//            async: false,
//            data: JSON.stringify(dataToSend),
//            success: function (data) {
//                msg = data.msgList;
//            }
//        });
//        if (msg != null) {


//            // Parsing pour rendre la prévisualisation propre.
//            var allMessage = msg[msg.length - 1];
//            var detailMessage = allMessage.split('|'); // On split grace au PIPE
//            var displayMessage = ""; // Variable qu'on va renvoyer à l'écran : a parser
//            var time = "";
//            if (detailMessage[1].charAt(0) == "<") {
//                // C'est une image donc on va renvoyer un texte disant que l'utilisateur a envoyé une image
//                displayMessage = detailMessage[0] + " a envoyé une image";
//                time = detailMessage[2];
//            } else {
//                displayMessage = detailMessage[1];
//                time = detailMessage[2];
//            }
//        } else {
//            displayMessage = "";
//            time = "";
//        }


//        if (currentTchatRoom == listTchatRoom[i]) {

//            html += '<div grpName="' + listTchatRoom[i] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
//				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
//				</div>\
//				<div class="col-xs-9">\
//					<p class="grpName">'+ listTchatRoom[i] + '</p>\
//					<p class="lastMsgGrp">' + displayMessage + '</p>\
//					<p class="lastMsgTime">' + time + '</p>\
//				</div></div></div>';
//        } else {
//            // L'utilisateur n'est pas sur la tchatroom on va afficher le message en gras pour lui signifier qu'il doit regarder
//            html += '<div grpName="' + listTchatRoom[i] + '" class="groupBorder col-xs-12"><div class="row"><div class="col-xs-3 grpPicture">\
//				<i class="fa fa-user-circle-o fa-3x grpIcon" aria-hidden="true"></i>\
//				</div>\
//				<div class="col-xs-9">\
//					<p class="grpName">'+ listTchatRoom[i] + '</p>\
//					<p class="bold lastMsgGrp">' + displayMessage + '</p>\
//					<p class="bold lastMsgTime">' + time + '</p>\
//				</div></div></div>';
//        }
//    }
//    $('.grpSelector').append(html);
//    if ($.cookie("tchatRoomNameCookie") != null) {
//        currentTchatRoom = $.cookie("tchatRoomNameCookie")

//    } else {
//        currentTchatRoom = listTchatRoom[0];
//    }
//}
function createTchatRoom() {
    var TchatRooms = {
        "roomName": $('#createRoomTxt').val(),
    }
    $.ajax({
        url: '/createTchatRoom',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        async: false,
        data: JSON.stringify(TchatRooms),
        success: function (data) {
            getAllTchatRoom();
        }
    });
}

function sendMessage() {
    if ($('#msgArea').val() == "") {
        return;
    }
    if ($('#msgArea').val().length > 60) {
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
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        async: false,
        data: JSON.stringify(dataToSend),
        success: function (data) {
            getAllMessagesByTchatRoomName(currentTchatRoom);
            $('#msgArea').val("");
            $('#grpMsgContainer').animate({ scrollTop: 100000 }, 1000);
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
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        async: false,
        data: JSON.stringify(dataToSend),
        success: function (data) {
            if (data.success == true) {
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
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        async: false,
        data: JSON.stringify(dataToSend),
        success: function (data) {
            if (data.success) {
                username = dataToSend.userName;
                $('#loginModal').modal('hide');
                $.cookie("pseudo", username, { expires: 1 });
                $('.disconnectBtn').removeClass('hidden');
            }
        },
        error: function (data) {
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
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        async: false,
        data: JSON.stringify(dataToSend),
        success: function (data) {
            listOfMessages = data.msgList;
        }
    });

    // Parcours de la liste des messages et affichage 
    var html = "";
    $('#grpMsgContainer').empty();
    if (listOfMessages != null) {

        for (var i = 0; i < listOfMessages.length; i++) {

            var temp = listOfMessages[i].split('|');

            if(username == temp[0]) {
                        html += '	<div class="bubble">\
							<p class="bold textMessage">'+ temp[0] + ' : </p>\
							<p class="textMessage">' + temp[1] + '</p>\
							<p class="textMessageTime">' + temp[2] + '</p>\
						</div>';
        	} else {
        	    html += '	<div class="tresSale grayBubble bubble">\
					<p class="bold textMessage">'+ temp[0] + ' : </p>\
					<p class="textMessage">' + temp[1] + '</p>\
					<p class="textMessageTime">' + temp[2] + '</p>\
				</div>';

        	}
        }
        $('#grpMsgContainer').append(html);
    }
}

function switchGrp(tchatRoomName) {
    $('#currentGrpName').text(tchatRoomName);
    getAllMessagesByTchatRoomName(tchatRoomName);
    getAllTchatRoomAndLastMessage();
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
    var cookieOldMessages = $.cookie("oldMessages");

    if (cookieValue != null) {
        toastr.success("Bon retour parmi nous !", "Hello !");
        username = cookieValue;
        $('#loginModal').modal("hide")
    } else {
        $('.disconnectBtn').addClass('hidden');
    }
    if (cookieOldMessages != null) {
        oldMessages = cookieOldMessages;
    } else {
        oldMessages = null;
    }

}

function sendMessagePicture() {
    // Format acceptés : jpeg, jpg, gif, png, webp
    var link = $('#linkTxt').val()
    extension = link.split('.').pop();

    if (extension == "jpeg" || extension == "jpg" || extension == "gif" || extension == "png" || extension == "webp") {
        var msgLink = "<img class='maxWidthImg' src='" + $('#linkTxt').val() + "'</img>";

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
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            async: false,
            data: JSON.stringify(dataToSend),
            success: function (data) {
                getAllMessagesByTchatRoomName(currentTchatRoom);
                if (data.success) {
                    $('#linkTxt').val(""); // Clear du texte
                    $('#imgModal').modal('hide');
                    $('#grpMsgContainer').animate({ scrollTop: 100000 }, 1000);
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
    if (document.cookie) {
        var cookieString = document.cookie;
        var cookieList = cookieString.split(";");
        // if cookie named OKCookie is found, return
        for (x = 0; x < cookieList.length; x++) {
            if (cookieList[x].indexOf("OKCookie") != -1) { return };
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

    function closeCookie() {
        var cookieExpire = new Date();
        cookieExpire.setFullYear(cookieExpire.getFullYear() + 2);
        document.cookie = "OKCookie=1; expires=" + cookieExpire.toGMTString() + ";";
        docRoot.removeChild(okC);
    }
}