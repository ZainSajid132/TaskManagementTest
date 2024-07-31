import React, { useState } from "react";
import { Table } from "antd";

const DataTable = ({ props, columns, dataSource, isLoading }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <Table
      key={props}
      className="table datanew dataTable no-footer"
      rowSelection={rowSelection}
      columns={columns}
      loading={isLoading}
      dataSource={dataSource}
      rowKey={(record) => record.id}
    />
  );
};

export default DataTable;