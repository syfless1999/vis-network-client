import {
  Drawer, Form, Button, Col, Row, Input, Select, Switch, InputNumber,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { useRef, useState } from 'react';
import { DataScale } from 'src/model/datasource';

export interface AddDataSourceParam {
  name: string;
  url: string;
  nodeParam: string;
  edgeParam: string;
  scale: DataScale;
  needExpand: boolean;
  expandSourceUrl: string;
  updateCycle: number;
}

const { Option } = Select;

const AddDataSourceDrawer = (props: {
  visible: boolean,
  handleSubmit: (values: AddDataSourceParam) => void,
  handleCancel: () => void,
}) => {
  const { visible, handleSubmit, handleCancel } = props;
  const [needExpand, setNeedExpand] = useState(false);
  const formInstance = useRef<FormInstance>(null);
  const handleButtonClick = () => {
    if (formInstance.current) {
      formInstance.current.submit();
    }
  };
  return (
    <Drawer
      title="Add a new data source"
      width={480}
      visible={visible}
      onClose={handleCancel}
      bodyStyle={{ paddingBottom: 80 }}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleButtonClick} type="primary">
            Submit
          </Button>
        </div>
      )}
    >
      <Form layout="vertical" ref={formInstance} onFinish={handleSubmit}>
        <Row gutter={16}>
          {/* name */}
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter the name' }]}
            >
              <Input placeholder="symbol of the data source" />
            </Form.Item>
          </Col>
          {/* url */}
          <Col span={12}>
            <Form.Item
              name="url"
              label="Url"
              rules={[{ required: true, message: 'Please enter the api url' }]}
            >
              <Input placeholder="api url" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {/* node param */}
          <Col span={12}>
            <Form.Item
              name="nodeParam"
              label="node param"
              rules={[{ required: true, message: 'Please enter node\'s params' }]}
            >
              <Input placeholder="params of nodes" />
            </Form.Item>
          </Col>
          {/* edge param */}
          <Col span={12}>
            <Form.Item
              name="edgeParam"
              label="edge param"
              rules={[{ required: true, message: 'Please enter edge\'s params' }]}
            >
              <Input placeholder="params of edges" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {/* scale */}
          <Col span={12}>
            <Form.Item
              name="scale"
              label="Scale"
              rules={[{ required: true, message: 'Please select the scale of data' }]}
            >
              <Select placeholder="scale of the data">
                {Object.values(DataScale).map(
                  (value: string) => (<Option value={value} key={value}>{value}</Option>),
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="needExpand"
              label="expand or not"
            >
              <Switch checked={needExpand} onChange={() => setNeedExpand(!needExpand)} />
            </Form.Item>
          </Col>
        </Row>
        {
          needExpand && (
            <Row gutter={16}>
              {/* expand url */}
              <Col span={12}>
                <Form.Item
                  name="expandSourceUrl"
                  label="expandSourceUrl"
                  rules={[{ required: true, message: 'Please enter the api url' }]}
                >
                  <Input placeholder="api url" />
                </Form.Item>
              </Col>
              {/* updateCycle */}
              <Col span={12}>
                <Form.Item label="update cycle">
                  <Form.Item
                    noStyle
                    name="updateCycle"
                    rules={[{ required: true, message: 'Please choose how often to update' }]}
                  >
                    <InputNumber min={30} step={30} />
                  </Form.Item>
                  <span>minutes</span>
                </Form.Item>
              </Col>
            </Row>
          )
        }
      </Form>
    </Drawer>
  );
};

export default AddDataSourceDrawer;
