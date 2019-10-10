const ctx = document.getElementById("canvas").getContext("2d");

const x = 400;
const y = 400;

const createGrid = ({ x, y }) =>
  [...Array(x)].fill(0).map(() =>
    Array(y)
      .fill(0)
      .map(() => (Math.floor(Math.random() * 2) === 1 ? 1 : 0))
  );

const grid = createGrid({ x, y });

//get DPI
const dpi = window.devicePixelRatio;

scaleCanvas = () => {
  const style_height = parseInt(
    getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2),
    10
  );

  //get CSS width
  const style_width = parseInt(
    getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2),
    10
  );
  //scale the canvas
  canvas.setAttribute("height", style_height * dpi);
  canvas.setAttribute("width", style_width * dpi);
};

const draw = () => {
  scaleCanvas();

  grid.forEach((x, i) => {
    x.forEach((y, j) => {
      if (y) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "black";
      }
      ctx.fillRect(i * 5, j * 5, 150, 100);
    });
  });
};

draw();
