import { initialGrid } from "./initialGrid";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete

  let alive = false;
  let timer = null;
  const boxHeight = 15;
  const boxWidth = 15;

  const canvasListener = event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;

    if (y >= 0) {
      const indexX = Math.floor(x / boxWidth);
      const indexY = Math.floor(y / boxHeight);
      const value = grid[indexY][indexX];

      if (value === 1) {
        grid[indexY][indexX] = 0;
        shadowGrid[indexY][indexX] = 0;
      } else {
        grid[indexY][indexX] = 1;
        shadowGrid[indexY][indexX] = 1;
      }
      console.log(grid);
      draw();
    }
  };

  document.addEventListener("mousedown", canvasListener);
  document.getElementById("state").addEventListener("mousedown", () => {
    alive = !alive;
    const img = document.getElementById("alive");
    if (alive) {
      img.src = "static/alive.gif";
      img.title = "Stop Animation";
      timer = setInterval(() => {
        applyRules();
        draw();
      }, 10);
      document.addEventListener("mousedown", canvasListener);
    } else {
      img.src = "static/dead.png";
      img.title = "Start Animation";
      clearInterval(timer);
      document.removeEventListener("click", canvasListener);
    }
  });

  let grid = initialGrid;
  console.log(grid);
  let shadowGrid = JSON.parse(JSON.stringify(grid));

  const scaleCanvas = () => {
    //get DPI
    const dpi = window.devicePixelRatio;

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

    // scaleCanvas();

    grid.forEach((y, j) => {
      y.forEach((x, i) => {
        if (x) {
          ctx.fillStyle = "white";
        } else {
          ctx.fillStyle = "black";
        }
        ctx.fillRect(i * boxWidth, j * boxHeight, boxWidth, boxHeight);
      });
    });
  };

  const applyRules = () => {
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
});
