(()=>{"use strict";class t{constructor(t,i,e){this.family=t,this.value=i,this.red=e,this.imgFront=new Image,this.imgBack=new Image,this.imgGray=new Image,this.img=new Image,this.imgSrc="",this.tilt=0,this.setImgSrc()}getFamily(){return this.family}getValue(){return this.value}isEqual(t,i){return this.family===t&&this.value===i}isRed(){return this.red}compare(t){return this.family!==t.family?this.family<t.family?-1:1:this.value!==t.value?this.value<t.value?-1:1:0}isLessThan(t){return this.family<t.family||this.family===t.family&&this.value<=t.value}setTilt(){this.tilt=.04*(1-2*Math.random())}drawTile(t,i,e,s,n=!1,l=0,h=!1,r=!0){const a=75*s,o=100*s,c=a/2,u=o/2;t.save(),t.translate(i+c,e+u),t.rotate(l+(r?this.tilt:0));const d=-.92*a/2,g=-.92*o/2;if(t.drawImage(this.imgGray,d,g,a,o),n)t.drawImage(this.imgBack,-c,-u,a,o);else{t.drawImage(this.imgFront,-c,-u,a,o);const i=.9,e=a*i,n=o*i,l=-68*s/2,r=-90*s/2;t.drawImage(this.img,l,r,e,n),h&&t.drawImage(this.imgGray,-c,-u,a,o)}t.restore()}cleanup(){[this.imgFront,this.imgBack,this.imgGray,this.img].forEach((t=>{t.onload=null,t.onerror=null}))}preloadImg(){return t=this,i=void 0,s=function*(){const t=[{img:this.imgFront,src:"img/Regular/Front.svg"},{img:this.imgBack,src:"img/Regular/Back.svg"},{img:this.imgGray,src:"img/Regular/Gray.svg"},{img:this.img,src:this.imgSrc}];yield Promise.all(t.map((({img:t,src:i})=>this.loadImg(t,i))))},new((e=void 0)||(e=Promise))((function(n,l){function h(t){try{a(s.next(t))}catch(t){l(t)}}function r(t){try{a(s.throw(t))}catch(t){l(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(h,r)}a((s=s.apply(t,i||[])).next())}));var t,i,e,s}loadImg(t,i){return new Promise(((e,s)=>{t.onload=()=>e(),t.onerror=()=>s(),t.src=i}))}setImgSrc(){if(this.imgSrc="img/Regular/",this.family<=3){const t=["","Man","Pin","Sou"];this.imgSrc+=t[this.family]+String(this.value),this.red&&(this.imgSrc+="-Dora")}else if(4===this.family){const t=["","Ton","Nan","Shaa","Pei"];this.imgSrc+=t[this.value]}else if(5===this.family){const t=["","Chun","Hatsu","Haku"];this.imgSrc+=t[this.value]}this.imgSrc+=".svg"}}class i{constructor(t,i,e){this.tiles=t,this.stolenFrom=i,this.belongsTo=e}push(t){this.tiles.push(t)}pop(){return this.tiles.pop()}getTiles(){return this.tiles}compare(t){const i=this.tiles[0].compare(t.tiles[0]);return 0!==i?i:this.tiles[1].compare(t.tiles[1])}drawGroup(t,i,e,s,n,l,h){t.save(),t.translate(525,525),t.rotate(l),t.translate(-525,-525);const r=75*n,a=90*n,o=25*n/2,c=(this.belongsTo-this.stolenFrom-1+4)%4,u=void 0===h?-1:h.getFamily(),d=void 0===h?0:h.getValue(),g=(i,e,s,l)=>{i.drawTile(t,e,s,n,!1,l,i.isEqual(u,d))},m=Math.PI/2;switch(c){case 0:g(this.tiles[0],i,e+o,m),g(this.tiles[1],i+a,e,0),g(this.tiles[2],i+a+r+s*n,e,0);break;case 1:g(this.tiles[0],i,e,0),g(this.tiles[1],i+a,e+o,-m),g(this.tiles[2],i+a+r+3*s*n,e,0);break;case 2:g(this.tiles[0],i,e,0),g(this.tiles[1],i+r+s*n,e,0),g(this.tiles[2],i+a+r+s*n,e+o,-m);break;default:console.error(`Position non prise en charge: ${c}`)}t.restore()}}const e="m",s=1,n="p",l=2,h="s",r=3,a="w",o=4,c="d",u=5;class d{constructor(i){this.tiles=i.map((i=>new t(i.getFamily(),i.getValue(),i.isRed()))),this.sort()}sort(){this.tiles.sort(((t,i)=>t.isLessThan(i)?-1:1))}find(t,i){const e=this.findTileIndex(t,i);if(-1!==e){[this.tiles[e],this.tiles[0]]=[this.tiles[0],this.tiles[e]];const t=this.tiles.shift();return this.sort(),t}}findTileIndex(t,i){return this.tiles.findIndex((e=>e.getFamily()===t&&e.getValue()===i))}count(t,i){return this.tiles.filter((e=>e.getFamily()===t&&e.getValue()===i)).length}findGroups(t=!1){if(0===this.tiles.length)return[];const i=this.tiles.pop(),e=i.getFamily(),s=i.getValue();if(this.count(e,s)>=1&&!t){const t=this.tryFormPair(i);if(t)return t}if(this.count(e,s)>=2){const e=this.tryFormTriplet(i,t);if(e)return e}if(e<=3){const n=this.count(e,s-1)>0,l=this.count(e,s-2)>0;if(n&&l){const e=this.tryFormSequence(i,t);if(e)return e}}this.tiles.push(i),this.sort()}tryFormPair(t){const e=this.find(t.getFamily(),t.getValue()),s=this.findGroups(!0);if(this.tiles.push(e),this.sort(),void 0!==s)return this.tiles.push(t),this.sort(),s.push(new i([t,e],0,0)),s}tryFormTriplet(t,e){const s=this.find(t.getFamily(),t.getValue()),n=this.find(t.getFamily(),t.getValue()),l=this.findGroups(e);if(this.tiles.push(s),this.tiles.push(n),this.sort(),void 0!==l)return l.push(new i([t,s,n],0,0)),this.tiles.push(t),this.sort(),l}tryFormSequence(t,e){const s=this.find(t.getFamily(),t.getValue()-1),n=this.find(t.getFamily(),t.getValue()-2),l=this.findGroups(e);if(this.tiles.push(s),this.tiles.push(n),this.sort(),void 0!==l)return l.push(new i([n,s,t],0,0)),this.tiles.push(t),this.sort(),l}}class g{constructor(t=""){this.isolate=!1,this.tiles=[],this.initializeFromString(t)}initializeFromString(t){for(let i=0;i<t.length-1;i++){const e=t.substring(i,i+2),s=e[0],n=Number(e[1]);this.isValidTileCode(s,n)&&this.addTileFromCode(s,n)}}isValidTileCode(t,i){return t===e||t===n||t===h||t===a||t===c}addTileFromCode(i,d){const g={[e]:s,[n]:l,[h]:r,[a]:o,[c]:u}[i];void 0!==g&&this.tiles.push(new t(g,d,!1))}getTiles(){return this.tiles}length(){return this.tiles.length}push(t){this.tiles.push(t)}pop(){return this.tiles.pop()}find(t,i){const e=this.findTileIndex(t,i);if(-1!==e){[this.tiles[e],this.tiles[0]]=[this.tiles[0],this.tiles[e]];const t=this.tiles.shift();return this.sort(),t}}findTileIndex(t,i){return this.tiles.findIndex((e=>e.getFamily()===t&&e.getValue()===i))}eject(t){if(t<0||t>=this.tiles.length)throw new Error("Invalid tile index");[this.tiles[0],this.tiles[t]]=[this.tiles[t],this.tiles[0]];const i=this.tiles.shift();return this.sort(),i}get(t){if(!(void 0===t||t<0||t>=this.tiles.length))return this.tiles[t]}sort(){this.tiles.sort(((t,i)=>t.isLessThan(i)?-1:1))}count(t,i){return this.tiles.filter((e=>e.getFamily()===t&&e.getValue()===i)).length}toGroup(t=!1){return new d(this.tiles).findGroups(t)}drawHand(t,i,e,s,n,l=void 0,h=!1,r=0){const a=(75+s)*n,o=Math.cos(r)*a,c=Math.sin(r)*a;for(let s=0;s<this.tiles.length;s++){const a=s===this.tiles.length-1&&this.isolate?10:0;let u=i+s*o+a*n*Math.cos(r),d=e+s*c+a*n*Math.sin(r);s===l&&(u+=25*n*Math.sin(r),d-=25*n*Math.cos(r)),this.tiles[s].drawTile(t,u,d,n,h,r)}}preload(){return t=this,i=void 0,s=function*(){yield Promise.all(this.tiles.map((t=>t.preloadImg())))},new((e=void 0)||(e=Promise))((function(n,l){function h(t){try{a(s.next(t))}catch(t){l(t)}}function r(t){try{a(s.throw(t))}catch(t){l(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(h,r)}a((s=s.apply(t,i||[])).next())}));var t,i,e,s}cleanup(){this.tiles.forEach((t=>t.cleanup())),this.tiles=[]}}class m{constructor(t=!1){this.tiles=[],this.tileIndexMap=new Map,this.initTiles(t)}displayFamilies(t,i,e,s,n=0,l=0){let h=i,r=e;const a=[{family:1,start:1,end:9},{family:2,start:1,end:9},{family:3,start:1,end:9},{family:4,start:1,end:4},{family:5,start:1,end:3}];for(const e of a){for(let i=e.start;i<=e.end;i++){const l=this.find(e.family,i);l&&(l.drawTile(t,h,r,s,!1,0,!1),h+=(75+n)*s)}h=i,r+=(100+l)*s}}length(){return this.tiles.length}pop(){if(0===this.tiles.length)throw new Error("Cannot pop from an empty deck");const t=this.tiles.pop(),i=this.getTileKey(t.getFamily(),t.getValue()),e=this.tileIndexMap.get(i);return e&&e.length>0&&(e.pop(),0===e.length?this.tileIndexMap.delete(i):this.tileIndexMap.set(i,e)),t}push(t){const i=this.tiles.length;this.tiles.push(t);const e=this.getTileKey(t.getFamily(),t.getValue()),s=this.tileIndexMap.get(e)||[];s.push(i),this.tileIndexMap.set(e,s)}find(t,i){const e=this.getTileKey(t,i),s=this.tileIndexMap.get(e);if(!s||0===s.length)return;const n=s[0];if(n>=this.tiles.length)return this.rebuildIndexMap(),this.find(t,i);[this.tiles[n],this.tiles[0]]=[this.tiles[0],this.tiles[n]],this.updateIndicesAfterSwap(0,n);const l=this.tiles.shift();return this.decrementIndicesAfterShift(),l}count(t,i){const e=this.getTileKey(t,i),s=this.tileIndexMap.get(e);return s?s.length:0}shuffle(){for(let t=this.tiles.length-1;t>0;t--){const i=Math.floor(Math.random()*(t+1));[this.tiles[t],this.tiles[i]]=[this.tiles[i],this.tiles[t]]}this.rebuildIndexMap()}getRandomHand(){const t=new g;if(this.shuffle(),this.tiles.length<13)throw new Error("Not enough tiles in deck to create a hand");for(let i=0;i<13;i++)t.push(this.pop());return t}cleanup(){this.tiles.forEach((t=>t.cleanup())),this.tiles=[],this.tileIndexMap.clear()}preload(){return t=this,i=void 0,s=function*(){const t=this.tiles.map((t=>t.preloadImg()));yield Promise.all(t)},new((e=void 0)||(e=Promise))((function(n,l){function h(t){try{a(s.next(t))}catch(t){l(t)}}function r(t){try{a(s.throw(t))}catch(t){l(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(h,r)}a((s=s.apply(t,i||[])).next())}));var t,i,e,s}getTileKey(t,i){return`${t}-${i}`}updateIndicesAfterSwap(t,i){if(t===i)return;const e=this.tiles[t],s=this.tiles[i],n=this.getTileKey(e.getFamily(),e.getValue()),l=this.getTileKey(s.getFamily(),s.getValue()),h=this.tileIndexMap.get(n)||[],r=this.tileIndexMap.get(l)||[],a=h.indexOf(i),o=r.indexOf(t);-1!==a&&(h[a]=t),-1!==o&&(r[o]=i),this.tileIndexMap.set(n,h),this.tileIndexMap.set(l,r)}decrementIndicesAfterShift(){var t;for(const[i,e]of this.tileIndexMap.entries())this.tileIndexMap.set(i,e.filter((t=>0!==t)).map((t=>t>0?t-1:t))),0===(null===(t=this.tileIndexMap.get(i))||void 0===t?void 0:t.length)&&this.tileIndexMap.delete(i)}rebuildIndexMap(){this.tileIndexMap.clear();for(let t=0;t<this.tiles.length;t++){const i=this.tiles[t],e=this.getTileKey(i.getFamily(),i.getValue()),s=this.tileIndexMap.get(e)||[];s.push(t),this.tileIndexMap.set(e,s)}}initTiles(i){for(let e=1;e<=3;e++)for(let s=1;s<=9;s++){const n=5===s&&i;for(let i=0;i<3;i++)this.push(new t(e,s,!1));this.push(new t(e,s,n))}for(let i=1;i<=4;i++)for(let e=0;e<4;e++)this.push(new t(4,i,!1));for(let i=1;i<=3;i++)for(let e=0;e<4;e++)this.push(new t(5,i,!1))}}const f=Math.PI;class p{constructor(t,i,e,s,n){this.vy=50,this.tile=t,this.x=i,this.y=e,this.orientation=s,this.momentum=n}update(t){this.vy+=100*t,this.y+=t*this.vy,this.orientation+=t*this.momentum}isOutside(){return this.y>1100}getTile(){return this.tile}drawFallingTile(t){var i;null===(i=this.tile)||void 0===i||i.drawTile(t,this.x,this.y,1,!1,this.orientation,!1,!1)}}const y=new class{constructor(){this.tiles=[],this.tileAddTimer=0,this.deck=new m(!0)}update(t){let i=this.tiles.length;for(;i--;){const e=this.tiles[i];e.update(t),e.isOutside()&&(this.deck.push(e.getTile()),this.tiles.splice(i,1))}this.tileAddTimer+=t,this.tileAddTimer>=1/.75?(this.addFallingTile(),this.tileAddTimer=0):Math.random()<.75*t&&this.addFallingTile()}addFallingTile(){if(0===this.deck.length())return;this.deck.length()>1&&this.deck.shuffle();const t=new p(this.deck.pop(),Math.floor(1e3*Math.random()),-150,Math.random()*f,1*(2*Math.random()-1));this.tiles.push(t)}drawRain(t){for(const i of this.tiles)i.drawFallingTile(t)}preloadRain(){return t=this,i=void 0,s=function*(){console.log("preload rain"),yield this.deck.preload()},new((e=void 0)||(e=Promise))((function(n,l){function h(t){try{a(s.next(t))}catch(t){l(t)}}function r(t){try{a(s.throw(t))}catch(t){l(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(h,r)}a((s=s.apply(t,i||[])).next())}));var t,i,e,s}};let v,w=0,I=0;const x=[],F=1/60,T=document.getElementById("myCanvas"),M=T.getContext("2d",{alpha:!1});T.width=1050,T.height=1050;const S=document.createElement("canvas"),V=S.getContext("2d",{alpha:!1});function k(t){if(!w)return w=t,void(v=requestAnimationFrame(k));const i=t-w;w=t,i<100&&function(t){if(M){for(I+=t/1e3;I>=F;)y.update(F),I-=F;V.fillStyle="#007730",V.fillRect(0,0,1050,1050),y.drawRain(V),M.drawImage(S,0,0)}}(i),v=requestAnimationFrame(k)}function P(){cancelAnimationFrame(v),x.forEach((t=>t()))}S.width=T.width,S.height=T.height,"undefined"!=typeof window&&function(){return t=this,i=void 0,s=function*(){if(M){console.log("Load beginning");try{yield y.preloadRain(),console.log("Loading completed"),function(){const t=()=>{document.hidden?(cancelAnimationFrame(v),w=0):(w=performance.now(),v=requestAnimationFrame(k))};document.addEventListener("visibilitychange",t),x.push((()=>{document.removeEventListener("visibilitychange",t)}))}(),w=performance.now(),v=requestAnimationFrame(k),window.cleanup=P}catch(t){console.error("Erreur lors de l'initialisation:",t)}}else console.error("Context canvas indisponible")},new((e=void 0)||(e=Promise))((function(n,l){function h(t){try{a(s.next(t))}catch(t){l(t)}}function r(t){try{a(s.throw(t))}catch(t){l(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(h,r)}a((s=s.apply(t,i||[])).next())}));var t,i,e,s}().catch(console.error)})();