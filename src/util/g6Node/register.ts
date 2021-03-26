import Graphin from '@antv/graphin';
import {
  ShapeOptions, IGroup, ModelConfig, IShape,
} from '@antv/g6';

const lightBlue = '#5b8ff9';
const lightOrange = '#5ad8a6';

const PIE_SIZE = 80;

export interface PieNodeInterface extends ModelConfig {
  inDegree?: number;
  degree?: number;
}
export interface PieNode2Interface extends ModelConfig {
  degrees?: number[];
  colors?: string[];
}
const customNodes: [string, ShapeOptions][] = [
  ['pie-node', {
    draw: (cfg?: PieNode2Interface, group?: IGroup) => {
      if (!cfg || !group) throw new Error('no pie node config / group');
      const { size = PIE_SIZE, degrees, colors } = cfg;
      if (!(typeof size === 'number')) throw new Error('size must be a number');
      if (!degrees) throw new Error('degrees undefined');
      if (!colors) throw new Error('colors undefined');
      const sum = degrees.reduce((a, b) => a + b, 0);
      const radius = size / 2;
      let curAngle = 0;
      let prevPoint = [radius, 0];
      const shapes: IShape[] = [];
      degrees.forEach((d, index) => {
        const nowPer = d / sum;
        const nowAngle = nowPer * Math.PI * 2;
        curAngle += nowAngle;
        const nowPoint = [
          radius * Math.cos(curAngle),
          -radius * Math.sin(curAngle),
        ];
        const isBigArc = nowAngle > Math.PI ? 1 : 0;
        const s = group.addShape('path', {
          attrs: {
            path: [
              ['M', prevPoint[0], prevPoint[1]],
              ['A', radius, radius, 0, isBigArc, 0, nowPoint[0], nowPoint[1]],
              ['L', 0, 0],
              ['Z'],
            ],
            lineWidth: 0,
            fill: colors[index % colors.length],
          },
        });
        shapes.push(s);
        prevPoint = nowPoint;
      });
      return shapes[0];
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
