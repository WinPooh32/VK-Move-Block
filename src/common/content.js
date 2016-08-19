// ==UserScript==
// @name Remove VK block
// @include http://vk.com/*
// @include https://vk.com/*
// ==/UserScript==

function updateNarrow() {
  var bar = ge('narrow_column'), pageBody = ge('page_body');
  if (browser.mobile || !bar || !pageBody) return;

  var wh = window.lastWindowHeight || 0, st = Math.min(scrollGetY(), bodyNode.clientHeight - wh), pos = 0,
      pl = ge('page_layout'), head = ge('page_header_wrap'), headH = getSize(head)[1],
      isFixed = getStyle(bar, 'position') == 'fixed',
      barH = getSize(bar)[1], barPos = isFixed ? getXY(bar)[1] : floatval(getStyle(bar, 'marginTop')),
      pageH = getSize(pageBody)[1], pagePos = pageBody.offsetTop, tooBig = barH >= pageH,
      lastSt = window.barLastSt || 0, lastStyles = window.barLastStyles || {}, styles, delta = 1;

  if (st - delta < 0 || tooBig || hasClass(bodyNode, 'body_im')) {
    styles = {
      position: 'relative',
      marginTop: 0
    };
  } else if (st - delta < Math.min(lastSt, barPos )) {
    styles = {
      position: 'fixed',
      top: headH
    };
  } else if (st + delta > Math.max(lastSt, barPos + barH - headH )) {
    styles = {
      position: 'fixed',
      bottom: wh - headH
    };
  } else {
    styles = {
      position: 'relative',
      marginTop: Math.min(barPos, pageH + pagePos - barH - headH)
    }
  }

  if (!compareScrollStyles(styles, lastStyles)) {
    var defaultStyles = {
      position: 'relative',
      marginTop: null,
      marginLeft: null,
      top: null,
      bottom: null
    };
    setStyle(bar, extend(defaultStyles, styles));
    window.barLastStyles = styles;
  }
  window.barLastSt = st;
}


var my_script = document.createElement("script");
my_script.async = false;
my_script.text = updateNarrow.toString();

console.log("replacing");
document.head.appendChild(my_script);
