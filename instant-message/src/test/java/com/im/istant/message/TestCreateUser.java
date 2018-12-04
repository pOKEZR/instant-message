package com.im.istant.message;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.slf4j.LoggerFactory;

import com.im.instant.message.IMResponse;
import com.im.instant.message.services.InstantMessageService;

import ch.qos.logback.classic.Logger;

public class TestCreateUser {

	private final static Logger log = (Logger) LoggerFactory.getLogger(TestCreateUser.class);
	
	public static void main(String[] args) {
		

	
		String userName = "jper";
		String password = "patate";
		
		final String linuxPath = "/developpement/local-git-clone/octopussy/instant-message/sauv/";
		
		String userFolderPath = linuxPath + "users/";
	
		log.info("Creating user with the path : " + userFolderPath + userName + "/");

		File repertoire = new File(userFolderPath);
		File[] files = repertoire.listFiles();

		if (files.length != 0) {
			for (int i = 0; i < files.length; i++) {
				if (userName.equals(files[i].getName())) {
					log.info("USER ALREADY CREATED");
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

		log.info("User Created");

	}

}
