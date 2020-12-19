import React from "react";
import { Form, Input, InputNumber, Button } from 'antd';

function BuyForm(props) {
    const [form] = Form.useForm();

      const onFinish = (values) => {
        console.log(values);
        props.BuyArt(values);
      };
    
      return (
        <Form layout="vertical" size="small" form={form} name="control-hooks" onFinish={onFinish}
          initialValues={{v: props.v}}
        >
          <Form.Item noStyle name="v" >
            <Input type='hidden'/>
          </Form.Item>

          <Form.Item label="New Sale Price" rules={[{required: true}]}> 
          <Form.Item name= "newSalePrice" noStyle rules={[
              { required: true,  message: "ETH Price Required!"}
              ]}>
            <InputNumber /> 
          </Form.Item> <span>ETH</span>
          </Form.Item>
          <Form.Item label="Deposit" rules={[{ required: true }]}>
          <Form.Item name="deposit" noStyle rules={[
              { required: true,  message: "Deposit Required!"}
              ]}>
            <InputNumber /> 
          </Form.Item> <span>ETH</span>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Buy Artwork
            </Button>
          </Form.Item>
        </Form>
      );
}

export default BuyForm;
