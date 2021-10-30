const drawTreeMap = (data) => {
  const graphWidth = 1200
  const graphHeight = 450
  const paddingBottom = 125
  const paddingLeft = 80
  const paddingRight = 50
  const paddingTop = 50
  const rectPadding = 30
  const svgWidth = graphWidth + paddingLeft + paddingRight
  const svgHeight = graphHeight + paddingBottom + paddingTop + rectPadding

  const svg = d3.select('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
  const colors = {
    'Wii': '#4c92c3',
    'DS': '#bed2ed',
    'X360': '#ff993e',
    'GB': '#ffc993',
    'PS3': '#56b356',
    'NES': '#ade5a1',
    'PS2': '#de5253',
    '3DS': '#ffadab',
    'PS4': '#a985ca',
    'SNES': '#d1c0dd',
    'PS': '#a3786f',
    'N64': '#d0b0a9',
    'GBA': '#e992ce',
    'XB': '#f9c5db',
    'PC': '#999999',
    '2600': '#d2d2d2',
    'PSP': '#c9ca4e',
    'XOne': '#e2e2a4',
  }

  const colorScale = d3.scaleOrdinal()
                       .domain(Object.keys(colors))
                       .range(Object.values(colors))

  const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value)
  const treemap = d3.treemap()
                    .size([graphWidth, graphHeight])
                    .padding(1)

  treemap(root)

  console.log(root)
  const graph = svg.append('g')
    .attr('id', 'graph')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${paddingRight}, ${paddingTop})`)

  const rects = graph.selectAll('g')
    .data(root.leaves())
    .join('g')
    .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
  rects.append('rect')
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style("fill", d => colorScale(d.data.category))

  rects.append('text')
    .text(d => d.data.name)
    .attr('font-size', '11px')
    .attr('y', 11)
    .attr('x', 3)

  const legendWidth = graphWidth / 2
  const legendHeight = paddingBottom
  
  const legend = svg.append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${svgWidth/3}, ${svgHeight - legendHeight})`)
    .attr('height', legendHeight)
    .attr('width', legendWidth)
    .selectAll('g.legend')
    .data(root.children.map(d => d.data.name))
    .join('g')
    .classed('legend', true)
    .attr('transform', (_, i) => `translate(${i%3 * (legendWidth/3)}, ${parseInt(i/3) * legendHeight/6 })`)
  legend.append('rect')
    .attr('width', 16)
    .attr('height', 16)
    .attr('fill', d => colorScale(d))
    .attr('transform', () => {
      return `translate(-20, -12)`
    })
  legend.append('text')
    .text(d => d)
    .style('font-size', '0.9rem')
    .attr('text-anchor', 'start')
    .attr('dy', 'center')
}


fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
  .then(resp => resp.json())
  .then(resp => {
    drawTreeMap(resp)
  })