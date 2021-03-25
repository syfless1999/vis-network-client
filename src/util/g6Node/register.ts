import Graphin from '@antv/graphin';
import { ShapeOptions, IGroup, ModelConfig } from '@antv/g6';

const lightBlue = '#5b8ff9';
const lightOrange = '#5ad8a6';

const PIE_SIZE = 80;

export interface PieNodeInterface extends ModelConfig {
  inDegree?: number;
  degree?: number;
}
const customNodes: [string, ShapeOptions][] = [
  ['pie-node', {
    draw: (cfg: PieNodeInterface | undefined, group: IGroup | undefined) => {
      if (!cfg || !group) throw new Error('no pie node config / group');
      const { size: cfgSize = PIE_SIZE, inDegree = 0, degree = 360 } = cfg;
      let size: number[];
      if (typeof cfgSize === 'number') {
        size = [cfgSize, cfgSize];
      } else {
        size = cfgSize;
      }
      const radius = size[0] / 2; // node radius
      const inPercentage = inDegree / degree; // the ratio of indegree to outdegree
      const inAngle = inPercentage * Math.PI * 2; // the anble for the indegree fan
      const inArcEnd = [
        radius * Math.cos(inAngle),
        -radius * Math.sin(inAngle),
      ]; // the end position for the in -degree fan
      let isInBigArc = 0;
      let isOutBigArc = 1;
      if (inAngle > Math.PI) {
        isInBigArc = 1;
        isOutBigArc = 0;
      }
      // fan shape for the in degree
      const fanIn = group.addShape('path', {
        attrs: {
          path: [
            ['M', radius, 0],
            ['A', radius, radius, 0, isInBigArc, 0, inArcEnd[0], inArcEnd[1]],
            ['L', 0, 0],
            ['Z'],
          ],
          lineWidth: 0,
          fill: lightOrange,
          draggable: true,
        },
        name: 'in-fan-shape',
      });
      // draw the fan shape
      group.addShape('path', {
        attrs: {
          path: [
            ['M', inArcEnd[0], inArcEnd[1]],
            ['A', radius, radius, 0, isOutBigArc, 0, radius, 0],
            ['L', 0, 0],
            ['Z'],
          ],
          lineWidth: 0,
          fill: lightBlue,
          draggable: true,
        },
        name: 'out-fan-shape',
      });
      // 返回 keyshape
      return fanIn;
    },
  }],
];
const g6Register = () => {
  customNodes.forEach((cNode) => {
    const [name, cfg] = cNode;
    Graphin.registerNode(name, cfg);
  });
};
export default g6Register;
