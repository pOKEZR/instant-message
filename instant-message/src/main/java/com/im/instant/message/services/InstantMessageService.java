package com.im.instant.message.services;

import java.io.File;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.im.instant.message.IMResponse;

import ch.qos.logback.classic.Logger;

@Service
public class InstantMessageService {
	
	private final Logger log = (Logger) LoggerFactory.getLogger(InstantMessageService.class);
	
	final String linuxPath = "/developpement/local-git-clone/octopussy/instant-message/sauv/";
	//final String windowsPath = "";

	public IMResponse createRoom(String roomName) {
		
		String messagePath = linuxPath + "messages/";
		boolean success = false;
		
		log.info("Creating the file with the path : " + messagePath + roomName + "/");
		
		File repertoire = new File(messagePath);
		File[] files = repertoire.listFiles();
		
		if(files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				if(roomName.equals(files[i].getName())){
					log.info("ROOM ALREADY CREATED");
					return new IMResponse(success, "ROOM ALREADY CREATED");
				} else {
					File tchatRoomDir = new File(messagePath + roomName + "/");
					tchatRoomDir.mkdirs();
				}
			}
		} else {
			File tchatRoomDir = new File(messagePath + roomName + "/");
			tchatRoomDir.mkdirs();
		}
		
		success = true;
		
		log.info("TchatRoom Created");
		
		return new IMResponse(success, "TchatRoom Created");
	}

	public IMResponse createUser(String userName) {
		
		String userFolderPath = linuxPath + "users/";
		boolean success = false;
		
		
		log.info("Creating user with the path : " + userFolderPath + userName + "/");
		
		File repertoire = new File(userFolderPath);
		File[] files = repertoire.listFiles();
		
		if(files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				if(userName.equals(files[i].getName())){
					log.info("USER ALREADY CREATED");
					return new IMResponse(success, "USER ALREADY CREATED");
				} else {
					File tchatRoomDir = new File( userFolderPath + userName + "/");
					tchatRoomDir.mkdirs();
				}
			}
		} else {
			File tchatRoomDir = new File( userFolderPath + userName + "/");
			tchatRoomDir.mkdirs();
		}
		
		success = true;
		
		log.info("TchatRoom Created");
		
		return new IMResponse(success, "TchatRoom Created");
	}
	
}
