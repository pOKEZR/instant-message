package com.im.instant.message;

import java.util.List;

public class TchatRooms {

	private int idTchatRooms; 
	
	private String name;

	private int numberOfRegisteredUsers;

	private String errorMessage;
	
	private List<String> userRegisters;
	
	private boolean isSuppr;
	

	public TchatRooms(String name, int numberOfRegisteredUsers, String errorMessage) {
		this.name = name;
		this.numberOfRegisteredUsers = numberOfRegisteredUsers;
		this.errorMessage = errorMessage;
	}

	public TchatRooms() {

	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the numberOfRegisteredUsers
	 */
	public int getNumberOfRegisteredUsers() {
		return numberOfRegisteredUsers;
	}

	/**
	 * @param numberOfRegisteredUsers the numberOfRegisteredUsers to set
	 */
	public void setNumberOfRegisteredUsers(int numberOfRegisteredUsers) {
		this.numberOfRegisteredUsers = numberOfRegisteredUsers;
	}

	/**
	 * @return the errorMessage
	 */
	public String getErrorMessage() {
		return errorMessage;
	}

	/**
	 * @param errorMessage the errorMessage to set
	 */
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	/**
	 * @return the userRegisters
	 */
	public List<String> getUserRegisters() {
		return userRegisters;
	}

	/**
	 * @param userRegisters the userRegisters to set
	 */
	public void setUserRegisters(List<String> userRegisters) {
		this.userRegisters = userRegisters;
	}

	/**
	 * @return the id
	 */
	public int getIdTchatRooms() {
		return idTchatRooms;
	}

	/**
	 * @param id the id to set
	 */
	public void setIdTchatRooms(int idTchatRooms) {
		this.idTchatRooms = idTchatRooms;
	}

	/**
	 * @return the isSuppr
	 */
	public boolean isSuppr() {
		return isSuppr;
	}

	/**
	 * @param isSuppr the isSuppr to set
	 */
	public void setSuppr(boolean isSuppr) {
		this.isSuppr = isSuppr;
	}
}
