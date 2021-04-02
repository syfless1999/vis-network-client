const colorSets = [
  '#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16', '#e8684a', '#6dc8ec', '#9270CA', '#ff9d4d', '#269a99', '#ff99c3', '#ff5722',
];
export type ColorSeries = Record<string, string[]>;
const colorObject: ColorSeries = {
  blue: ['#00FFFF', '#5b8ff9', '#00BFFF', '#0000FF', '#00008B'],
  gray: ['#f7f1e3', '#aaa69d', '#d1ccc0', '#84817a', '#808e9b'],
  yellow: ['#ffc048', '#ffd32a', '#fffa65', '#fff200', '#fdcb6e'],
  green: ['#2ecc71', '#218c74', '#009432', '#2ed573', '#b8e994'],
  purple: ['#9b59b6', '#be2edd', '#ff99c3', '#9980FA', '#D980FA'],
  orange: ['#F79F1F', '#EE5A24', '#ff793f', '#ffaf40', '#f19066'],
  red: ['#c44569', '#b71540', '#eb2f06', '#e55039', '#b33939'],
};

export { colorSets, colorObject };
