import css from './style.css'
import img from './m1.png'

import './print.js'
import _ from 'lodash'

console.log(img)
function sayHi() {
  const box = document.querySelector('.box')
  console.log(box)
  box.style.backgroundImage = `url(${img})`

  console.log('hello worldsss')
}

sayHi()
