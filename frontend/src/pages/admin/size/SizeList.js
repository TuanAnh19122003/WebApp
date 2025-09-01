import React from "react";
import { Table, Button, Popconfirm, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { formatDate } from "../../../utils/helpers";
const SizeList = ({ data, onEdit, onDelete, onView, pagination, onPageChange }) => {
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (
                <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
            )
        },
        { title: "Tên size", dataIndex: "name", key: "name" },
        { title: "Mô tả", dataIndex: "description", key: "description" },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => formatDate(createdAt),
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (updatedAt) => formatDate(updatedAt),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            shape="circle"
                            onClick={() => onView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            shape="circle"
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Popconfirm
                            title={`Bạn có chắc chắn xoá vai trò "${record.name}" không?`}
                            onConfirm={() => onDelete(record.id)}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                type="primary"
                                shape="circle"
                                danger
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: false,
                onChange: (page, pageSize) => onPageChange(page, pageSize)
            }}
        />
    )
}

export default SizeList