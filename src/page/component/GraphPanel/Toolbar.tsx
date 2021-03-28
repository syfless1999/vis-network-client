import React, { useContext } from 'react';
import { GraphinContext, GraphinContextType } from '@antv/graphin';
import { Toolbar } from '@antv/graphin-components';
import { ToolBarItemType } from '@antv/graphin-components/lib/Toolbar';
import {
  ZoomOutOutlined, ZoomInOutlined, DownloadOutlined,
} from '@ant-design/icons';

interface IToolBarItemType extends ToolBarItemType {
  action?: () => void;
}

const Tool = () => {
  const { apis, graph } = useContext(GraphinContext);
  const { handleZoomIn, handleZoomOut } = apis;
  const handleClick = (context: GraphinContextType, option: IToolBarItemType) => {
    const { action } = option;
    if (action) {
      action();
    }
  };
  const options = [
    {
      key: 'zoomOut',
      name: <ZoomInOutlined />,
      action: handleZoomOut,
    },
    {
      key: 'zoomIn',
      name: <ZoomOutOutlined />,
      action: handleZoomIn,
    },
    {
      key: 'download',
      name: <DownloadOutlined />,
      action: () => {
        graph.downloadFullImage('visual-network-pic');
      },
    },
  ];
  return (
    <Toolbar direction="vertical" options={options} onChange={handleClick} />
  );
};
export default React.memo(Tool);
