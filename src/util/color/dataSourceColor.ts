export const Color = {
  MAGENTA: 'magenta',
  RED: 'red',
  VOLCANO: 'volcano',
  ORANGE: 'orange',
  GOLD: 'gold',
  LIME: 'lime',
  GREEN: 'green',
  CYAN: 'cyan',
  BLUE: 'blue',
  GEEKBLUE: 'geekblue',
  PURPLE: 'purple',
};
const colorArr: Array<string> = [];

Object.entries(Color).forEach((v) => {
  colorArr.push(v[1]);
});

export const getRandomColor = () => {
  const len = colorArr.length;
  return colorArr[Math.floor(Math.random() * len)];
};
