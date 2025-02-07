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

  // Generate shapes
  for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
          const cellHash = Math.abs(hash >> (x * 3 + y * 5)) & 15
          const shouldDrawShape = cellHash < 6

          if (shouldDrawShape) {
              const shapeType = cellHash & 1

              if (shapeType === 0) {
                  const cx = x * cellSize
                  const cy = y * cellSize

                  // Define the corners of the parallelogram
                  pathData += `M${cx},${cy} `                       // Starting point (bottom-left corner)
                  pathData += `L${cx + cellSize},${cy} `             // Move to bottom-right corner
                  pathData += `L${cx + cellSize + cellSize / 2},${cy - cellSize} `  // Top-right corner (skewed)
                  pathData += `L${cx + cellSize / 2},${cy - cellSize} `             // Top-left corner (skewed)
                  pathData += `z `                                   // Close the path
              } else {
                  const cx = x * cellSize
                  const cy = y * cellSize

                  pathData += `M${cx + cellSize / 2},${cy + cellSize} `  // Start at bottom-left corner (skewed)
                  pathData += `L${cx + cellSize + cellSize / 2},${cy + cellSize} ` // Bottom-right corner (skewed)
                  pathData += `L${cx + cellSize},${cy} `                   // Top-right corner
                  pathData += `L${cx},${cy} `                              // Top-left corner
                  pathData += `z `
              }
          }
      }
  }

  path.setAttribute('d', pathData)
  svg.appendChild(path)
  return svg
}
