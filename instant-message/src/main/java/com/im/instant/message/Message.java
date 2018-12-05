package com.im.instant.message;

public class Message {

	private String message;
	
	private String user;
	
	private String tchatRoom;
	
	private String date;

	
	public Message() {
		
	}
	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * @param message the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * @return the user
	 */
	public String getUser() {
		return user;
	}

	/**
	 * @param user the user to set
	 */
	public void setUser(String user) {
		this.user = user;
	}

	/**
	 * @return the tchatRoom
	 */
	public String getTchatRoom() {
		return tchatRoom;
	}

	/**
	 * @param tchatRoom the tchatRoom to set
	 */
	public void setTchatRoom(String tchatRoom) {
		this.tchatRoom = tchatRoom;
	}

	/**
	 * @return the date
	 */
	public String getDate() {
		return date;
	}

	/**
	 * @param date the date to set
	 */
	public void setDate(String date) {
		this.date = date;
	}
	
	
}
