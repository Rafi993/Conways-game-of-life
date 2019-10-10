const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const x = 400;
const y = 400;

const createGrid = ({ x, y }) =>
  [...Array(x)].fill(0).map(() =>
    Array(y)
      .fill(0)
      .map(() => (Math.floor(Math.random() * 100) + 1 > 10 ? 1 : 0))
  );

let grid = createGrid({ x, y });
let shadowGrid = JSON.parse(JSON.stringify(grid));

//get DPI
const dpi = window.devicePixelRatio;

const scaleCanvas = () => {
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  scaleCanvas();

  grid.forEach((y, j) => {
    y.forEach((x, i) => {
      if (x) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "black";
      }
      ctx.fillRect(i * 5, j * 5, 100, 100);
    });
  });
};

const applyRules = () => {
  console.log("HEllo");
  grid.forEach((y, j) => {
    y.forEach((x, i) => {
      let livingNeighbours = 0;

      // Top Row
      {
        if (j > 0) {
          const topRow = grid[j - 1];

          if (i > 0) {
            livingNeighbours += topRow[i - 1]; // Top Left Cell
          }

          livingNeighbours += topRow[i]; // Top Center Cell

          if (topRow.length < i + 1) {
            livingNeighbours += topRow[i + 1];
          }
        }
      }

      // Current Row
      {
        const currentRow = grid[j];

        if (i > 0) {
          livingNeighbours += currentRow[i]; // Left Cell
        }

        if (currentRow.length < i + 1) {
          livingNeighbours += currentRow[i + 1];
        }
      }

      // Bottom Row
      {
        if (j + 1 < grid.length) {
          const bottomRow = grid[j + 1];

          if (i > 0) {
            livingNeighbours += bottomRow[i - 1]; // Bottom Left Cell
          }

          livingNeighbours += bottomRow[i]; // Bottom Center Cell

          if (bottomRow.length < i + 1) {
            livingNeighbours += bottomRow[i + 1];
          }
        }
      }

      if (x === 0 && livingNeighbours === 3) {
        shadowGrid[j][i] = 1; // Becomes alive
      } else if (x === 1 && livingNeighbours < 2) {
        shadowGrid[j][i] = 0; // Die of under population
      } else if (x === 1 && livingNeighbours > 3) {
        shadowGrid[j][i] = 0; // Die of over population
      }
    });
  });

  // Copy shadow grid to actual grid
  grid = JSON.parse(JSON.stringify(shadowGrid));
};

draw();

setInterval(() => {
  applyRules();
  draw();
}, 500);
