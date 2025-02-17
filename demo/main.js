const jazzicon = generateIdenticon; 

const body = document.querySelector('body')
for(let i = 0; i < 600; i++) {
  const circle = i % 2 === 0;
  const el = jazzicon(100, i, circle)
  body.appendChild(el)
}