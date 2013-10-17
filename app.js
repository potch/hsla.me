
var mainEl = document.querySelector('#main');
var stringInputs = document.querySelectorAll('[data-space]');
stringInputs = Array.prototype.slice.apply(stringInputs);
var valueInputs = document.querySelectorAll('[data-val]');
valueInputs = Array.prototype.slice.apply(valueInputs);

var c = new Color(mainEl.value);
var activeSpace = 'hex';

var previewEl = document.querySelector('.everything');

var spaceRegex = {
  'hex' : /^#([a-fA-F0-9]{6})$|^#([a-fA-F0-9]{3})$/,
  'rgb' : /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)$/,
  'per' : /^rgba?\(\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*(?:,\s*([\d\.]+)\s*)?\)$/,
  'hsl' : /^hsla?\(\s*(\d+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/,
  'keyword' : /(\D+)/
};

function guessSpace(string) {
  for (var space in spaceRegex) {
    if (string.match(spaceRegex[space])) {
      return space;
    }
  }
}

var urlTimeout;
function update(main) {

  previewEl.style.backgroundColor = c.rgbString();
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
      mainEl.value = c[activeSpace + 'String']();
    } else {
      mainEl.value = c.keyword() || c.rgbString();
    }
    urlTimeout = setTimeout(function() {
      if (history.replaceState) {
        history.replaceState(null, null, window.location.protocol + '//' + window.location.pathname + '?' + mainEl.value);
      }
    }, 100);
  }

}

function checkTicks(e) {
  var tgt = e.target;
  if (tgt.className === 'tick') {
    var amount = 1;
    if (tgt.getAttribute('data-val') === 'alpha') {
      amount = .01;
    }
    if (e.shiftKey) {
      amount *= 10;
    }
    if (e.keyCode === 38) {
      e.preventDefault();
      tgt.value = parseInt(tgt.value, 10) + amount;
      checkSliders(e);
    }
     if (e.keyCode === 40) {
      e.preventDefault();
      tgt.value = parseInt(tgt.value, 10) - amount;
      checkSliders(e);
    }
 }
}

function checkMain() {
  var val = mainEl.value;
  var space = guessSpace(val);
  if (space) {
    c = new Color(mainEl.value);
    activeSpace = space;
    update(true);
  }
}

function checkSliders(e) {
  var val = e.target.getAttribute('data-val');
  if (val) {
    c[val](e.target.value);
    update();
  }
}

mainEl.addEventListener('keydown', function() {
  setTimeout(checkMain, 0);
});

document.body.addEventListener('input', checkSliders);
document.body.addEventListener('change', checkSliders);

document.body.addEventListener('keydown', checkTicks);

window.addEventListener('load', function() {
  var base = window.location.search;
  if (base.length > 1) {
    base = base.substring(1);
    if (guessSpace(base)) {
      mainEl.value = base;
    }
  }
  checkMain();
});
