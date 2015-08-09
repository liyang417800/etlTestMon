package com.etl.etlmonitor.formbean;

public class HdfsBean {

	String table;
	String filecount;
	String tbcount;
	String filesize;
	String tbsize;
	String szsize;

	public String getTable() {
		return table;
	}
	public void setTable(String table) {
		this.table = table;
	}
	public String getFilecount() {
		return filecount;
	}
	public void setFilecount(String filecount) {
		this.filecount = filecount;
	}
	public String getTbcount() {
		return tbcount;
	}
	public void setTbcount(String tbcount) {
		this.tbcount = tbcount;
	}
	public String getFilesize() {
		return filesize;
	}
	public void setFilesize(String filesize) {
		this.filesize = filesize;
	}
	
	public String getTbsize() {
		return tbsize;
	}
	public void setTbsize(String tbsize) {
		this.tbsize = tbsize;
	}
	public String getSzsize() {
		return szsize;
	}
	public void setSzsize(String szsize) {
		this.szsize = szsize;
	}	
	public HdfsBean(String table, String filecount, String tbcount, String filesize, 
			String tbsize, String szsize) {
		super();
		this.table = table;
		this.filecount = filecount;
		this.tbcount = tbcount;
		this.filesize = filesize;
		this.tbsize = tbsize;
		this.szsize = szsize;
	}	
	public HdfsBean(){
		
	}
}
