import {
  Drawer, Form, Button, Col, Row, Input, Select, Switch, InputNumber, Radio,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { RadioChangeEvent } from 'antd/lib/radio';
import React, { useRef, useState } from 'react';
import DataSource from 'src/model/datasource';
import { TaskClusterType } from 'src/model/task';
import { getDataSourceList } from 'src/service/datasource';
import useList from 'src/util/hook/useList';

const { Option } = Select;

const AddTaskDrawer = (props: {
  visible: boolean,
  handleSubmit: (values: any) => void,
  handleCancel: () => void,
}) => {
  const { visible, handleSubmit, handleCancel } = props;
  const [dsList] = useList<DataSource>(async () => {
    const { list } = await getDataSourceList();
    return list;
  });
  const [needCustomizeSimilarityApi, setNeedCustomizeSimilarityApi] = useState(false);
  const [paramWeightInputVisible, setParamWeightInputVisible] = useState(false);
  const [topologyWeightInputVisible, setTopologyWeightInputVisible] = useState(false);
  const [param, setParam] = useState<string[]>([]);
  const formInstance = useRef<FormInstance>(null);
  const handleDataSourceChange = (value: string) => {
    // eslint-disable-next-line no-underscore-dangle
    const ds = (dsList as DataSource[]).find((ds) => ds._id === value);
    if (ds) {
      setParam(ds.node.param);
    }
  };
  const handleClusterTypeChange = (e: RadioChangeEvent) => {
    switch (e.target.value) {
      case TaskClusterType.PARAM_AND_TOPOLOGY:
        setParamWeightInputVisible(true);
        setTopologyWeightInputVisible(true);
        break;
      case TaskClusterType.PARAM_ONLY:
        setParamWeightInputVisible(true);
        break;
      case TaskClusterType.TOPOLOGY_ONLY:
        setTopologyWeightInputVisible(true);
        break;
      default:
        break;
    }
  };
  const handleButtonClick = () => {
    if (formInstance.current) {
      formInstance.current.submit();
    }
  };
  return (
    <Drawer
      title="Build a new task"
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
              name="datasourceId"
              label="Datasource"
              rules={[{ required: true, message: 'choose which datasource you want to analyse' }]}
            >
              <Select
                onChange={handleDataSourceChange}
                placeholder="Select a option and change input text above"
              >
                {(dsList as DataSource[]).map(
                  // eslint-disable-next-line no-underscore-dangle
                  (ds) => (<Option value={ds._id} key={ds._id}>{ds.name}</Option>),
                )}
              </Select>
            </Form.Item>
          </Col>
          {/* updateCycle */}
          <Col span={12}>
            <Form.Item label="update cycle">
              <Form.Item noStyle name="updateCycle" initialValue={0}>
                <InputNumber min={0} step={30} />
              </Form.Item>
              <span>minutes</span>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {/* cluster type */}
          <Col span={12}>
            <Form.Item
              name="clusterType"
              label="cluster type"
              rules={[{ required: true, message: 'select cluster type' }]}
            >
              <Radio.Group buttonStyle="solid" onChange={handleClusterTypeChange}>
                {Object.values(TaskClusterType).map(
                  (type) => (
                    <Radio.Button key={type} value={type}>{type}</Radio.Button>
                  ),
                )}
              </Radio.Group>
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={16}>
          {/* need Customize Similarity Api */}
          <Col span={12}>
            <Form.Item
              name="needCustomizeSimilarityApi"
              label="if need customize similarity api"
            >
              <Switch
                checked={needCustomizeSimilarityApi}
                onChange={() => setNeedCustomizeSimilarityApi(!needCustomizeSimilarityApi)}
              />
            </Form.Item>
          </Col>
          {
            needCustomizeSimilarityApi && (
              <Col span={12}>
                <Form.Item
                  name="similarityApi"
                  label="similarity api"
                  rules={[{ required: true, message: 'enter the api url' }]}
                >
                  <Input placeholder="similarity api url" />
                </Form.Item>
              </Col>
            )
          }
        </Row>
      </Form>
    </Drawer>
  );
};

export default AddTaskDrawer;
