(()=>{"use strict";const t=document.getElementById("myTextCanvas"),n=t.getContext("2d");t.width=800,t.height=1050,n.fillStyle="#007733",n.fillRect(0,0,800,1050),function(t,n){return e=this,o=void 0,f=function*(){console.log(t,"\n");const e=yield fetch(t).then((t=>t.text())),o="#ffffff";n.fillStyle=o,n.font="30px Garamond";let l=!1,f="",i="",c="",a=1,r=0;for(var d of e)"*"===d?(i=""===i?"bold ":"",n.font=c+i+30+"px Garamond"):"~"===d?(c=""===c?"italic ":"",n.font=c+i+30+"px Garamond"):"#"===d?(f="#",l=!0):"{"===d?(l=!1,n.fillStyle=f):"}"===d?(f="",n.fillStyle=o):l?f+=d:"\n"===d?(a++,r=0):(n.fillText(d,10+r,50+35*a),r+=n.measureText(d).width)},new((l=void 0)||(l=Promise))((function(t,n){function i(t){try{a(f.next(t))}catch(t){n(t)}}function c(t){try{a(f.throw(t))}catch(t){n(t)}}function a(n){var e;n.done?t(n.value):(e=n.value,e instanceof l?e:new l((function(t){t(e)}))).then(i,c)}a((f=f.apply(e,o||[])).next())}));var e,o,l,f}("src/text/txt3.txt",n).catch((t=>console.error(t)))})();