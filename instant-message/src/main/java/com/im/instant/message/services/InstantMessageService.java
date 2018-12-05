package com.im.instant.message.services;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.im.instant.message.IMResponse;
import com.im.instant.message.Message;

import ch.qos.logback.classic.Logger;

@Service
public class InstantMessageService {

	private final Logger log = (Logger) LoggerFactory.getLogger(InstantMessageService.class);

	final String linuxPath = "C:\\sauv\\";
	// final String linuxPath = "/local-git-clone/octopussy/instant-message/sauv/";
	// final String windowsPath = "";

	final String userFolderPath = linuxPath + "users\\";

	final String messagePath = linuxPath + "messages\\";

//	final String userFolderPath = linuxPath + "users/";
//
//	final String messagePath = linuxPath + "messages/";

	public IMResponse createRoom(String roomName) {

		boolean success = false;

		log.info("Creating the file with the path : " + messagePath + roomName + "/");

		File repertoire = new File(messagePath);
		File[] files = repertoire.listFiles();

		if (files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				if (roomName.equals(files[i].getName())) {
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

	public IMResponse createUser(String userName, String password) {

		boolean success = false;

		log.info("Creating user with the path : " + userFolderPath + userName + "/");

		File repertoire = new File(userFolderPath);
		File[] files = repertoire.listFiles();

		if (files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				if (userName.equals(files[i].getName())) {
					log.info("USER ALREADY CREATED");
					return new IMResponse(success, "USER ALREADY CREATED");
				} else {
					File userDir = new File(userFolderPath + userName + "/");
					userDir.mkdirs();
					File userLog = new File(userFolderPath + userName + "/" + userName + "login.txt");

					try {
						BufferedWriter writer = new BufferedWriter(new FileWriter(userLog));
						writer.write(userName);
						writer.write(System.lineSeparator());
						writer.write(password);
						writer.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		} else {
			File userDir = new File(userFolderPath + userName + "/");
			userDir.mkdirs();
			File userLog = new File(userFolderPath + userName + "/" + userName + "login.txt");

			try {
				BufferedWriter writer = new BufferedWriter(new FileWriter(userLog));
				writer.write(userName);
				writer.write(System.lineSeparator());
				writer.write(password);
				writer.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		success = true;

		log.info("User Created");

		return new IMResponse(success, "User Created");
	}

	public IMResponse eventSendMessage(Message message) {

		boolean success = false;
		String userName = message.getUser();
		String tchatRoom = message.getTchatRoom();

		if (message != null) {
			if (isUserExist(userName) == true) {
				if (isTchatRoomExist(tchatRoom) == true) {
//					File messageFile = new File(messagePath + tchatRoom + "/" + "message.txt");
					
					FileWriter fw = new FileWriter(messagePath + tchatRoom + "/" + "message.txt", true);

					try {
						
						BufferedWriter writer = new BufferedWriter(new FileWriter(messageFile));
						BufferedWriter bw = new BufferedWriter(fw);
					    PrintWriter out = new PrintWriter(bw))
						
						out.println("the text");
						writer.write(message.getUser());
						writer.write(message.getMessage());
						writer.write(message.getDate());
						writer.write(System.lineSeparator());
						writer.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				} else {
					log.info("TCHAT ROOM DOES NOT EXIST");
				}
			} else {
				log.info("USERNAME DOES NOT EXIST");
			}
		}
		success = true;

		return new IMResponse(success, "Message sent");
	}

	public boolean isUserExist(String userName) {

		if (userName != null) {
			File repertoire = new File(userFolderPath);
			File[] files = repertoire.listFiles();

			if (files.length != 0) {
				for (int i = 0; i < files.length; i++) {
					if (userName.equals(files[i].getName())) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public boolean isTchatRoomExist(String tchatRoomName) {

		File repertoire = new File(messagePath);
		File[] files = repertoire.listFiles();

		if (files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				if (tchatRoomName.equals(files[i].getName())) {
					return true;
				}
			}
		}
		return false;
	}

	public IMResponse listAllTchatRoomName() {

		IMResponse response = new IMResponse();
		List<String> allTchatRoomName = new ArrayList<String>();
		String tchatRoomName = "";

		File repertoire = new File(messagePath);
		File[] files = repertoire.listFiles();

		if (files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				tchatRoomName = files[i].getName();
				allTchatRoomName.add(tchatRoomName);
			}
			response.setTchatRoomName(allTchatRoomName);
		}

		response.setSuccess(true);

		return response;
	}

	public IMResponse listAllMessagesByTchatRoom(String tchatRoomName) {

		IMResponse response = new IMResponse();
		List<String> msgList = new ArrayList<String>();

		try {
			BufferedReader bufReader = new BufferedReader(
					new FileReader(messagePath + tchatRoomName + "\\message.txt"));

			String line = bufReader.readLine();
			while (line != null) {
				msgList.add(line);
				line = bufReader.readLine();
			}
			
			response.setMsgList(msgList);

			bufReader.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		response.setSuccess(true);
		
		return response;
	}

}
