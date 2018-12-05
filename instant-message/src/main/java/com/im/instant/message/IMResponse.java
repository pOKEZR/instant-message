package com.im.instant.message;

import java.util.List;

public class IMResponse {

	private boolean success;
	
	private String errorMessage;
	
	private List<String> tchatRoomName;
	
	private List<String> msgList;
	
	public IMResponse() {
	}

	public IMResponse(boolean success, String errorMessage) {
		
		this.success = success;
		this.errorMessage = errorMessage;
	}


	public IMResponse(String errorMessage) {
		success = false;
		this.errorMessage = errorMessage;
	}
	
	public IMResponse(boolean success) {
		success = false;
	}

	public boolean isSuccess() {
		return success;
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
	 * @param success the success to set
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}

	public List<String> getMsgList() {
		return msgList;
	}

	public void setMsgList(List<String> msgList) {
		this.msgList = msgList;
	}
	/**
	 * @return the tchatRoomName
	 */
	public List<String> getTchatRoomName() {
		return tchatRoomName;
	}

	/**
	 * @param tchatRoomName the tchatRoomName to set
	 */
	public void setTchatRoomName(List<String> tchatRoomName) {
		this.tchatRoomName = tchatRoomName;
	}

}
