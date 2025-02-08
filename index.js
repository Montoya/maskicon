function generateIdenticon(size, seed) {
  const svgns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgns, 'svg')
  svg.setAttributeNS(null, 'x', '0')
  svg.setAttributeNS(null, 'y', '0')
  svg.setAttributeNS(null, 'width', size)
  svg.setAttributeNS(null, 'height', size)

  let str = `${seed}`
  str = str.length < 6 ? str.padEnd(6, ' ') : str

  // SDBM hash algorithm
  let hash = 0
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
  }

  // Color pairs
  const colorPairs = [
      ['#013330', '#EAC2FF'],
      ['#EAC2FF', '#013330'],
      ['#CCE7FF', '#661800'],
      ['#661800', '#CCE7FF'],
      ['#3D065F', '#E5FFC3'],
      ['#E5FFC3', '#3D065F'],
      ['#FFA680', '#190066'],
      ['#190066', '#FFA680'],
      ['#013330', '#CCE7FF'],
      ['#CCE7FF', '#013330']
  ]

  // Select colors based on hash
  const colorPairIndex = Math.abs(hash) % colorPairs.length
  const [bgColor, fgColor] = colorPairs[colorPairIndex]

  // SVG setup
  const grid = 4
  const cellSize = size / grid

  svg.setAttributeNS(null, 'viewBox', `0 0 ${size} ${size}`)
  svg.style.backgroundColor = bgColor

  // Create single path element for all shapes
  const path = document.createElementNS(svgns, 'path')
  path.setAttribute('fill', fgColor)
  let pathData = ''


    // Create grid to track filled cells
    const filledGrid = Array(grid).fill().map(() => Array(grid).fill(false));

    // Start from center to ensure connectivity
    const startX = Math.floor(grid/2);
    const startY = Math.floor(grid/2);
    const stack = [[startX, startY]];
    filledGrid[startX][startY] = true;

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const cellHash = Math.abs(hash >> (x * 3 + y * 5)) & 15;
        
        // Get available neighbors
        const neighbors = [];
        const directions = [[0,1], [1,0], [0,-1], [-1,0]];
        
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < grid && newY >= 0 && newY < grid && !filledGrid[newX][newY]) {
                neighbors.push([newX, newY]);
            }
        }

        // Add random unvisited neighbors to stack
        while (neighbors.length > 0) {
            const idx = Math.abs(cellHash + neighbors.length) % neighbors.length;
            const [nextX, nextY] = neighbors.splice(idx, 1)[0];
            stack.push([nextX, nextY]);
            filledGrid[nextX][nextY] = true;
        }

        // Draw shape
        const rotation = (cellHash % 4) * 90; // 0, 90, 180, or 270 degrees
        const isSquare = cellHash % 5 === 0; // 20% chance of square
        
        if (isSquare) {
            // Square
            pathData += `M${x * cellSize},${y * cellSize} h${cellSize} v${cellSize} z `;
        } else {
            // Right triangle with rotation
            const cx = x * cellSize;
            const cy = y * cellSize;
            
            if (rotation === 0) {
                pathData += `M${cx},${cy} h${cellSize} v${cellSize}z `;
            } else if (rotation === 90) {
                pathData += `M${cx + cellSize},${cy} v${cellSize} h-${cellSize}z `;
            } else if (rotation === 180) {
                pathData += `M${cx + cellSize},${cy + cellSize} h-${cellSize} v-${cellSize}z `;
            } else { // 270
                pathData += `M${cx},${cy + cellSize} v-${cellSize} h${cellSize}z `;
            }
        }
    }

  path.setAttribute('d', pathData)
  svg.appendChild(path)
  return svg
}
