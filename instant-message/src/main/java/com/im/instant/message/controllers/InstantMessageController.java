package com.im.instant.message.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.im.instant.message.IMResponse;
import com.im.instant.message.Message;
import com.im.instant.message.Strings;
import com.im.instant.message.TchatRooms;
import com.im.instant.message.Users;
import com.im.instant.message.services.InstantMessageService;


@RestController
public class InstantMessageController {

	
	@Autowired
	InstantMessageService instantMessageService;

	@RequestMapping(value = "/createTchatRoom", method = RequestMethod.POST)
	public ResponseEntity<IMResponse> createTchatRoom(@RequestBody TchatRooms tchatRoom) {

		if (tchatRoom != null) {
			
			String tchatRoomName = tchatRoom.getRoomName();
			IMResponse response = instantMessageService.createRoom(tchatRoomName);
			
			if (!response.isSuccess()) {
				return new ResponseEntity<IMResponse>(response, HttpStatus.EXPECTATION_FAILED);
			} else {
				return new ResponseEntity<IMResponse>(response, HttpStatus.OK);
			}
		} else {
			return new ResponseEntity<IMResponse>(new IMResponse(Strings.NULL_REQUEST), HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(value = "/createUser", method = RequestMethod.POST)
	public ResponseEntity<IMResponse> createUser(@RequestBody Users user) {

		if (user != null) {
			
			String userName = user.getUserName();
			String password = user.getPassword();
			IMResponse response = instantMessageService.createUser(userName, password);
			
			if (!response.isSuccess()) {
				return new ResponseEntity<IMResponse>(response, HttpStatus.EXPECTATION_FAILED);
			} else {
				return new ResponseEntity<IMResponse>(response, HttpStatus.OK);
			}
		} else {
			return new ResponseEntity<IMResponse>(new IMResponse(Strings.NULL_REQUEST), HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(value = "/createEventSendMessage", method = RequestMethod.POST)
	public ResponseEntity<IMResponse> createEventSendMessage(@RequestBody Message message) {

		if (message != null) {
			
			IMResponse response = instantMessageService.eventSendMessage(message);
			
			if (!response.isSuccess()) {
				return new ResponseEntity<IMResponse>(response, HttpStatus.EXPECTATION_FAILED);
			} else {
				return new ResponseEntity<IMResponse>(response, HttpStatus.OK);
			}
		} else {
			return new ResponseEntity<IMResponse>(new IMResponse(Strings.NULL_REQUEST), HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(value = "/listTchatRoomName", method = RequestMethod.GET)
	public ResponseEntity<IMResponse> listTchatRoomName() {

			
			IMResponse response = instantMessageService.listAllTchatRoomName();
			
			if (!response.isSuccess()) {
				return new ResponseEntity<IMResponse>(response, HttpStatus.EXPECTATION_FAILED);
			} else {
				return new ResponseEntity<IMResponse>(response, HttpStatus.OK);
			}
		}
	
	@RequestMapping(value = "/listMessagesByTchatRoom", method = RequestMethod.POST)
	public ResponseEntity<IMResponse> listMessagesByTchatRoom(@RequestBody TchatRooms tchat) {

		if (tchat != null) {
			
			String tchatRoomName = tchat.getRoomName();
			IMResponse response = instantMessageService.listAllMessagesByTchatRoom(tchatRoomName);
			
			if (!response.isSuccess()) {
				return new ResponseEntity<IMResponse>(response, HttpStatus.EXPECTATION_FAILED);
			} else {
				return new ResponseEntity<IMResponse>(response, HttpStatus.OK);
			}
		}else {
			return new ResponseEntity<IMResponse>(new IMResponse(Strings.NULL_REQUEST), HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(value = "/eventCheckIsUserExist", method = RequestMethod.POST)
	public ResponseEntity<IMResponse> eventCheckIsUserExist(@RequestBody Users user) {

		if (user != null) {
			
			String userName = user.getUserName();
			String userPassword = user.getPassword();
			IMResponse response = instantMessageService.checkIsUserExist(userName, userPassword);
			
			if (!response.isSuccess()) {
				return new ResponseEntity<IMResponse>(response, HttpStatus.EXPECTATION_FAILED);
			} else {
				return new ResponseEntity<IMResponse>(response, HttpStatus.OK);
			}
		}else {
			return new ResponseEntity<IMResponse>(new IMResponse(Strings.NULL_REQUEST), HttpStatus.BAD_REQUEST);
		}
	}
}