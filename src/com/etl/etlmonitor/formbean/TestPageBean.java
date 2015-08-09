package com.etl.etlmonitor.formbean;

public class TestPageBean {

	int pageid;
	String pagetitle;
	String content;
	String dayT;
	String auther;

	public int getPageid() {
		return pageid;
	}
	public void setPageid(int pageid) {
		this.pageid = pageid;
	}
	public String getPagetitle() {
		return pagetitle;
	}
	public void setPagetitle(String pagetitle) {
		this.pagetitle = pagetitle;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getDayT() {
		return dayT;
	}
	public void setDayT(String dayT) {
		this.dayT = dayT;
	}
	public String getAuther() {
		return auther;
	}
	public void setAuther(String auther) {
		this.auther = auther;
	}
	

	public TestPageBean(int pageid,String pagetitle,String content,String auther,String dayT){
		super();
		this.pageid = pageid;
		this.pagetitle = pagetitle;
		this.content=content;
		this.auther = auther;
		this.dayT=dayT;
	}	
	public TestPageBean(){
		
	}
	
	
	
}
