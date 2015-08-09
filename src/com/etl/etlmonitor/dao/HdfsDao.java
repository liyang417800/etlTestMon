package com.etl.etlmonitor.dao;

import java.util.List;


public interface HdfsDao {

	List getHdfsList();
	List getHdfsList(String hdfs_date);
	List getHdfsList(String hdfs_path,String hdfs_date);
}
