const ctx = document.getElementById("canvas").getContext("2d");

const x = 10;
const y = 10;

const createGrid = ({ x, y }) =>
  [...Array(x)].fill(0).map(() =>
    Array(y)
      .fill(0)
      .map(() => (Math.floor(Math.random() * 2) === 1 ? 1 : 0))
  );

const grid = createGrid({ x, y });

const draw = () => {
  ctx.clearRect(x, y);
};

console.log(grid);
