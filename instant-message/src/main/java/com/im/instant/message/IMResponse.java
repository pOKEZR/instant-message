package com.im.instant.message;

public class IMResponse {

	private boolean success;
	
	private String errorMessage;
	
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

}
