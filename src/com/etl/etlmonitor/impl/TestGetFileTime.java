package com.etl.etlmonitor.impl;
import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
/**
 * ������ļ�û�о����޸���õ����Ǵ���ʱ�� ����޸Ĺ���õ�������޸ĵ�ʱ��
 * 
 * @author iSoftStone
 */
public class TestGetFileTime {

	public static void main(String[] args) {

		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		File file = new File("D:/aaa.txt");
		// ������
		long modifiedTime = file.lastModified();
		//System.out.println(modifiedTime);
		// ͨ���������������� ���ɽ�������ת��Ϊ����
		Date d = new Date(modifiedTime);
		System.out.println(format.format(d));

	}

}