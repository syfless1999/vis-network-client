import React, { useContext } from 'react';
import { GraphinContext } from '@antv/graphin';
import { ZoomOutOutlined, ZoomInOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface ToolbarOption {
  id: string,
  icon: JSX.Element,
  action: () => void,
}

const Toolbar = () => {
  const { apis, graph } = useContext(GraphinContext);
  const { handleZoomIn, handleZoomOut } = apis;
  const options: ToolbarOption[] = [
    {
      id: 'zoomIn',
      icon: <ZoomInOutlined />,
      action: () => {
        // API BUG: 这里反了
        handleZoomOut();
      },
    },
    {
      id: 'zoomOut',
      icon: <ZoomOutOutlined />,
      action: () => {
        handleZoomIn();
      },
    },
    {
      id: 'download',
      icon: <DownloadOutlined />,
      action: () => {
        graph.downloadFullImage('visual-network-pic');
      },
    },
  ];
  return (
    <>
      {options.map((item) => (
        <Button type="text" key={item.id} onClick={item.action}>{item.icon}</Button>
      ))}
    </>
  );
};
export default Toolbar;
