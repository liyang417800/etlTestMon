package com.etl.etlmonitor.impl;
import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
/**
 * 如果是文件没有经过修改则得到的是创建时间 如果修改过则得到是最后修改的时间
 * 
 * @author iSoftStone
 */
public class TestGetFileTime {

	public static void main(String[] args) {

		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		File file = new File("D:/aaa.txt");
		// 毫秒数
		long modifiedTime = file.lastModified();
		//System.out.println(modifiedTime);
		// 通过毫秒数构造日期 即可将毫秒数转换为日期
		Date d = new Date(modifiedTime);
		System.out.println(format.format(d));

	}

}