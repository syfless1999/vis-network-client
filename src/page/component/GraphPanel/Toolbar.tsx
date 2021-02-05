import React, { useContext } from 'react';
import { GraphinContext } from '@antv/graphin';
import {
  ZoomOutOutlined, ZoomInOutlined, DownloadOutlined,
} from '@ant-design/icons';
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
    // {
    //   id: 'fisheye',
    //   icon: <EyeOutlined />,
    //   action: () => {
    //     const fishEye = new G6.Fisheye({
    //       d: 1.5,
    //       r: 100,
    //       showLabel: false,
    //     });
    //     const escListener = (e: KeyboardEvent) => {
    //       if (e.code === 'Escape') {
    //         graph.removePlugin(fishEye);
    //         window.removeEventListener('keydown', escListener);
    //       }
    //     };
    //     graph.addPlugin(fishEye);
    //     window.addEventListener('keydown', escListener);
    //   },
    // },
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
