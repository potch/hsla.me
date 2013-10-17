
var mainEl = document.querySelector('#main');
var stringInputs = document.querySelectorAll('[data-space]');
stringInputs = Array.prototype.slice.apply(stringInputs);
var valueInputs = document.querySelectorAll('[data-val]');
valueInputs = Array.prototype.slice.apply(valueInputs);

var c = new Color(mainEl.value);

update();

mainEl.addEventListener('keydown', function() {
  setTimeout(function() {
    c = new Color(mainEl.value);
    update();
  }, 0);
});

function update(main) {

  document.body.style.backgroundColor = c.rgbString();
  if (c.luminosity() < .5) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  stringInputs.forEach(function (i) {
    i.value = c[i.getAttribute('data-space') + 'String']();
  });

  valueInputs.forEach(function (i) {
    i.value = c[i.getAttribute('data-val')]() || 0;
  });

}

document.body.addEventListener('input', checkSliders);
document.body.addEventListener('change', checkSliders);

function checkSliders(e) {
  var val = e.target.getAttribute('data-val');
  if (val) {
    c[val](e.target.value);
    update();
  }
}