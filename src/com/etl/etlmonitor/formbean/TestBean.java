package com.etl.etlmonitor.formbean;

public class TestBean {

	int id;
	String title;
	String contenta;
	String contentb;
	String checkcase;
	

	String dayT;
	String Time;
	String auther;
	String PageId;


	public String getPageId() {
		return PageId;
	}
	public void setPageId(String pageId) {
		PageId = pageId;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContenta() {
		return contenta;
	}
	public void setContenta(String contenta) {
		this.contenta = contenta;
	}
	public String getContentb() {
		return contentb;
	}
	public void setContentb(String contentb) {
		this.contentb = contentb;
	}
	public String getCheckcase() {
		return checkcase;
	}
	public void setCheckcase(String checkcase) {
		this.checkcase = checkcase;
	}
	
	public String getdayT() {
		return dayT;
	}
	public void setdayT(String dayT) {
		this.dayT = dayT;
	}
	public String getTime() {
		return Time;
	}
	public void setTime(String time) {
		Time = time;
	}
	public String getAuther() {
		return auther;
	}
	public void setAuther(String auther) {
		this.auther = auther;
	}
	
	
	public TestBean(int i,String title,String contenta,String contentb,String checkcase,String dayT,String Time,String auther,String PageId){
		super();
		this.id = i;
		this.title = title;
		this.contenta = contenta;
		this.contentb = contentb;
		this.checkcase = checkcase;
		this.dayT = dayT;
		this.Time = Time;
		this.auther = auther;
		this.PageId = PageId;
	}	
	public TestBean(){
		
	}
	
	
	
}
