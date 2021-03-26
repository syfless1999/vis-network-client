import Graphin from '@antv/graphin';
import {
  ShapeOptions, IGroup, ModelConfig, IShape,
} from '@antv/g6';
import { getRandomValue } from '../array';
import { colorSets } from '../color/graphColor';

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
      const {
        size = PIE_SIZE, degrees, colors, style,
      } = cfg;
      if (!(typeof size === 'number')) throw new Error('size must be a number');
      if (!degrees || !colors || !style) throw new Error('sth undefined');
      const sum = degrees.reduce((a, b) => a + b, 0);
      const radius = size / 2;
      let curAngle = 0;
      let prevPoint = [radius, 0];
      degrees.forEach((d, index) => {
        const nowPer = d / sum;
        const nowAngle = nowPer * Math.PI * 2;
        curAngle += nowAngle;
        const nowPoint = [
          radius * Math.cos(curAngle),
          -radius * Math.sin(curAngle),
        ];
        const isBigArc = nowAngle > Math.PI ? 1 : 0;
        group.addShape('path', {
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
        prevPoint = nowPoint;
      });
      const shape = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: size / 4,
          fill: style.fill || '#000',
        },
      });
      if (cfg.label) {
        const fontSize = size / 4;
        group.addShape('text', {
          attrs: {
            x: 0,
            y: 0,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.label,
            fill: '#fff',
            fontSize,
          },
        });
      }
      return shape;
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
