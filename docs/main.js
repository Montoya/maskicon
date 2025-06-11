const body = document.querySelector('body')
for(let i = 0; i < 600; i++) {
  const circle = i % 2 === 0;
  const el = generateMaskicon(i, 100, circle)
  body.appendChild(el)
}