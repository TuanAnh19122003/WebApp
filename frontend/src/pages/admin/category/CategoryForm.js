import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const CategoryForm = ({ initialValues, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues || {}}
            onFinish={handleFinish}
        >
            <Form.Item
                name="name"
                label="Tên danh mục"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                        Lưu
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Hủy
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default CategoryForm;