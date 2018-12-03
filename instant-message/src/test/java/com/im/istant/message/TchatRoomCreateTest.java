package com.im.istant.message;

import java.io.File;

public class TchatRoomCreateTest {

	public static void main(String[] args) {
		
		final String linuxPath = "/developpement/local-git-clone/octopussy/instant-message/sauv/";
		//final String windowsPath = "";
		final String roomName = "test"; // roomName ici est bouchonné
		
		String messagePath = linuxPath + "messages/";	
		String fileName = "";
		
		File repertoire = new File(messagePath);
		File[] files = repertoire.listFiles();
		
		if(files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				fileName = files[i].getName();
				System.out.println(roomName);
				if(roomName.equals(files[i].getName())){
					System.out.println("Room is already Created");
				} else {
					System.out.println("HELLOE");
					File tchatRoomDir = new File(messagePath + roomName + "/");
					tchatRoomDir.mkdirs();
				}
			}
		} else {
			System.out.println("HELLOE");
			File tchatRoomDir = new File(messagePath + roomName + "/");
			tchatRoomDir.mkdirs();
		}
	}

}
