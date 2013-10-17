
var mainEl = document.querySelector('#main');
var stringInputs = document.querySelectorAll('[data-space]');
stringInputs = Array.prototype.slice.apply(stringInputs);
var valueInputs = document.querySelectorAll('[data-val]');
valueInputs = Array.prototype.slice.apply(valueInputs);

var c = new Color(mainEl.value);
var activeSpace;

checkMain();

var spaceRegex = {
  'hex' : /^#([a-fA-F0-9]{6})$|^#([a-fA-F0-9]{3})$/,
  'rgb' : /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)$/,
  'per' : /^rgba?\(\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*(?:,\s*([\d\.]+)\s*)?\)$/,
  'hsl' : /^hsla?\(\s*(\d+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/,
  'keyword' : /(\D+)/
};

mainEl.addEventListener('keydown', function() {
  setTimeout(checkMain, 0);
});

function checkMain() {
  var val = mainEl.value;
  var space = guessSpace(val);
  if (space) {
    c = new Color(mainEl.value);
    activeSpace = space;
    update(true);
  }
}

function guessSpace(string) {
  for (var space in spaceRegex) {
    if (string.match(spaceRegex[space])) {
      return space;
    }
  }
}

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

  if (!main) {
    if (activeSpace != 'keyword') {
      document.title = activeSpace;
      mainEl.value = c[activeSpace + 'String']();
    } else {
      mainEl.value = c.keyword() || c.rgbString();
    }
  }

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