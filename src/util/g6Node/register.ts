import Graphin from '@antv/graphin';
import {
  ShapeOptions, IGroup, ModelConfig,
} from '@antv/g6';

const PIE_SIZE = 80;
export interface Petal {
  r: number;
  v: number;
  color: string;
}
const getCirclePoint = (r: number, a: number): [number, number] => ([
  r * Math.cos(a),
  -r * Math.sin(a),
]);
const drawPetals = (group: IGroup, petals: Petal[]): void => {
  const sum = petals.reduce((c, p) => c + p.v, 0);
  let curAngle = 0;
  petals.forEach((p) => {
    const { r, v, color } = p;
    const nowPer = v / sum;
    const nowAngle = nowPer * Math.PI * 2;
    const isBigArc = nowAngle > Math.PI ? 1 : 0;
    const prevPoint = getCirclePoint(r, curAngle);
    curAngle += nowAngle;
    const curPoint = getCirclePoint(r, curAngle);
    group.addShape('path', {
      attrs: {
        path: [
          ['M', prevPoint[0], prevPoint[1]],
          ['A', r, r, 0, isBigArc, 0, curPoint[0], curPoint[1]],
          ['L', 0, 0],
          ['Z'],
        ],
        fill: color,
      },
      name: 'rose-path',
      draggable: true,
    });
  });
};

export interface PieNodeInterface extends ModelConfig {
  degrees?: number[];
  colors?: string[];
}
export interface PetalInfo {
  text: string;
  height: number;
  color: string;
}
export interface RoseNodeInterface extends ModelConfig {
  petals?: PetalInfo[];
}
const customNodes: [string, ShapeOptions, string | undefined][] = [
  ['pie-node', {
    draw: (cfg?: PieNodeInterface, group?: IGroup) => {
      if (!cfg || !group) throw new Error('no pie node config / group');
      const {
        size = PIE_SIZE, degrees, colors, style,
      } = cfg;
      if (!(typeof size === 'number')) throw new Error('size must be a number');
      if (!degrees || !colors || !style) throw new Error('sth undefined');
      const r = size / 2;

      const petals = degrees.map((d, i) => ({
        r,
        v: d,
        color: colors[i % colors.length],
      }));
      drawPetals(group, petals);
      const shape = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: size / 4,
          fill: style.fill || '#000',
        },
        name: 'rose-circle',
        draggable: true,
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
          name: 'rose-text',
          draggable: true,
        });
      }
      return shape;
    },
  }, 'single-node'],
  ['rose-node', {
    draw: (cfg?: RoseNodeInterface, group?: IGroup) => {
      if (!cfg || !group) throw new Error('no pie node config / group');
      const { petals, style, size } = cfg;
      if (!(typeof size === 'number')) throw new Error('size must be a number');
      if (!petals || !style) throw new Error('sth undefined');

      const sum = petals.reduce((cur, p) => cur + p.height, 0);
      const pArr = petals.map((p) => {
        const { height, color } = p;
        const r = (height / sum) * (size / 2) * petals.length;
        return {
          r,
          v: 1,
          color,
        };
      });
      drawPetals(group, pArr);
      const shape = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: size / 4,
          fill: style.fill || '#000',
        },
        name: 'pie-circle',
        draggable: true,
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
          name: 'pie-text',
          draggable: true,
        });
      }
      return shape;
    },
  }, 'single-node'],
];
const g6Register = () => {
  customNodes.forEach((cNode) => {
    const [name, cfg] = cNode;
    Graphin.registerNode(name, cfg);
  });
};
export default g6Register;
