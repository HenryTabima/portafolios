smoothScroll.init()

var element = document.querySelector('.chart')
new EasyPieChart(element, {
  barColor: "#673AB7",
  lineWidth: 6,
  scaleColor: false
})

var botonUp = document.getElementById('volver-arriba')
var estadoBotonUp
var alto = 500
var scrolled
if (document.body.scrollTop >= alto) {
  estadoBotonUp = true
  botonUp.classList.remove('hidden')
}else {
  estadoBotonUp = false
}
window.onscroll = function() {
  scrolled = document.body.scrollTop
  if (scrolled >= alto && estadoBotonUp == false) {
    estadoBotonUp = true
    botonUp.classList.remove('hidden')
  }
  else if (scrolled < alto && estadoBotonUp == true) {
    estadoBotonUp = false
    botonUp.classList.add('hidden')
  }
}
