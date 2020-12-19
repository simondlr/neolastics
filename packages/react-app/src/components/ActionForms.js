import React from "react";
import { Form, Input, InputNumber, Button } from 'antd';

function ActionForms(props) {
    console.log('action props', props);
    const [changePriceForm] = Form.useForm();
    const [withdrawSomeDepositForm] = Form.useForm();
    const [topupDepositForm] = Form.useForm();
    const [withdrawWholeDepositForm] = Form.useForm();

    const changePrice = (values) => {
      console.log('price', values);
      props.changePrice(values);
    };

    const topupDeposit = (values) => {
      console.log('topup', values);
      props.topupDeposit(values);
    };

    const withdrawSomeDeposit = (values) => {
      console.log('some', values);
      props.withdrawSomeDeposit(values);
    };

    const withdrawWholeDeposit = (values) => {
      console.log('whole', values);
      props.withdrawWholeDeposit(values);
    };
  
    return (
      <div>
        <Form layout="inline" size="small" form={changePriceForm} name="control-hooks" onFinish={changePrice}
          initialValues={{v: props.v}}
        >
          {/* Change Price*/}
          <Form.Item noStyle name="v" >
            <Input type='hidden'/>
          </Form.Item>
          <Form.Item label="Change Price" rules={[{required: true}]}> 
          <Form.Item name= "newPrice" noStyle rules={[
              { required: true,  message: "New Price Required!"}
              ]}>
            <InputNumber /> 
          </Form.Item> <span>ETH</span>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
            Change Price 
            </Button>
          </Form.Item>
        </Form><br />

        {/* Top up Deposit*/}
        <Form layout="inline" size="small" form={topupDepositForm} name="control-hooks" onFinish={topupDeposit}
          initialValues={{v: props.v}}
        >
          <Form.Item noStyle name="v" >
            <Input type='hidden'/>
          </Form.Item>
          <Form.Item label="Add To Deposit" rules={[{required: true}]}> 
          <Form.Item name= "topupDeposit" noStyle rules={[
              { required: true,  message: "Additional Deposit Required!"}
              ]}>
            <InputNumber /> 
          </Form.Item> <span>ETH</span>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Top Up Deposit
            </Button>
          </Form.Item>
        </Form><br />

        {/*Withdraw Some Deposit*/}
        <Form layout="inline" size="small" form={withdrawSomeDepositForm} name="control-hooks" onFinish={withdrawSomeDeposit}
          initialValues={{v: props.v}}
        >
          <Form.Item noStyle name="v" >
            <Input type='hidden'/>
          </Form.Item>
          <Form.Item label="Withdraw Deposit" rules={[{required: true}]}> 
          <Form.Item name= "withdrawSomeDeposit" noStyle rules={[
              { required: true,  message: "Amount Required!"}
              ]}>
            <InputNumber /> 
          </Form.Item> <span>ETH</span>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Withdraw Some Deposit
            </Button>
          </Form.Item>
        </Form><br />
        {/*Withdraw Whole Deposit*/}
        <Form layout="inline" size="small" form={withdrawWholeDepositForm} name="control-hooks" onFinish={withdrawWholeDeposit}
        initialValues={{v: props.v}}
        >
          <Form.Item noStyle name="v" >
            <Input type='hidden'/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Withdraw Whole Deposit And Foreclose
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
}

export default ActionForms;
