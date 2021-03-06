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
import com.im.instant.message.services.InstantMessageService;


@RestController
public class InstantMessageController {

	
	@Autowired
	InstantMessageService instantMessageService;

	@RequestMapping(value = "/createTchatRoom", method = RequestMethod.POST)
	public ResponseEntity<IMResponse> createTchatRoom(@RequestBody String tchatRoomName) {

		if (tchatRoomName != null) {
			
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
	public ResponseEntity<IMResponse> createUser(@RequestBody String userName, @RequestBody String password) {

		if (userName != null) {
			
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
}