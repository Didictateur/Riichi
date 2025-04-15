(()=>{"use strict";class t{constructor(t,i,s){this.family=t,this.value=i,this.red=s,this.imgFront=new Image,this.imgBack=new Image,this.imgGray=new Image,this.img=new Image,this.imgSrc="",this.tilt=0,this.setImgSrc()}getFamily(){return this.family}getValue(){return this.value}isEqual(t,i){return this.family===t&&this.value===i}isRed(){return this.red}compare(t){return this.family!==t.family?this.family<t.family?-1:1:this.value!==t.value?this.value<t.value?-1:1:0}isLessThan(t){return this.family<t.family||this.family===t.family&&this.value<=t.value}setTilt(){this.tilt=.04*(1-2*Math.random())}drawTile(t,i,s,e,h=!1,n=0,a=!1,l=!0){const r=75*e,o=100*e,c=r/2,d=o/2;t.save(),t.translate(i+c,s+d),t.rotate(n+(l?this.tilt:0));const u=-.92*r/2,f=-.92*o/2;if(t.drawImage(this.imgGray,u,f,r,o),h)t.drawImage(this.imgBack,-c,-d,r,o);else{t.drawImage(this.imgFront,-c,-d,r,o);const i=.9,s=r*i,h=o*i,n=-68*e/2,l=-90*e/2;t.drawImage(this.img,n,l,s,h),a&&t.drawImage(this.imgGray,-c,-d,r,o)}t.restore()}cleanup(){[this.imgFront,this.imgBack,this.imgGray,this.img].forEach((t=>{t.onload=null,t.onerror=null}))}preloadImg(){return t=this,i=void 0,e=function*(){const t=[{img:this.imgFront,src:"img/Regular/Front.svg"},{img:this.imgBack,src:"img/Regular/Back.svg"},{img:this.imgGray,src:"img/Regular/Gray.svg"},{img:this.img,src:this.imgSrc}];yield Promise.all(t.map((({img:t,src:i})=>this.loadImg(t,i))))},new((s=void 0)||(s=Promise))((function(h,n){function a(t){try{r(e.next(t))}catch(t){n(t)}}function l(t){try{r(e.throw(t))}catch(t){n(t)}}function r(t){var i;t.done?h(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(a,l)}r((e=e.apply(t,i||[])).next())}));var t,i,s,e}loadImg(t,i){return new Promise(((s,e)=>{t.onload=()=>s(),t.onerror=()=>e(),t.src=i}))}setImgSrc(){if(this.imgSrc="img/Regular/",this.family<=3){const t=["","Man","Pin","Sou"];this.imgSrc+=t[this.family]+String(this.value),this.red&&(this.imgSrc+="-Dora")}else if(4===this.family){const t=["","Ton","Nan","Shaa","Pei"];this.imgSrc+=t[this.value]}else if(5===this.family){const t=["","Chun","Hatsu","Haku"];this.imgSrc+=t[this.value]}this.imgSrc+=".svg"}}class i{constructor(t,i,s){this.tiles=t,this.stolenFrom=i,this.belongsTo=s}push(t){this.tiles.push(t)}pop(){return this.tiles.pop()}getTiles(){return this.tiles}compare(t){const i=this.tiles[0].compare(t.tiles[0]);return 0!==i?i:this.tiles[1].compare(t.tiles[1])}drawGroup(t,i,s,e,h,n,a){t.save(),t.translate(525,525),t.rotate(n),t.translate(-525,-525);const l=75*h,r=90*h,o=25*h/2,c=(this.belongsTo-this.stolenFrom-1+4)%4,d=void 0===a?-1:a.getFamily(),u=void 0===a?0:a.getValue(),f=(i,s,e,n)=>{i.drawTile(t,s,e,h,!1,n,i.isEqual(d,u))},g=Math.PI/2;switch(c){case 0:f(this.tiles[0],i,s+o,g),f(this.tiles[1],i+r,s,0),f(this.tiles[2],i+r+l+e*h,s,0);break;case 1:f(this.tiles[0],i,s,0),f(this.tiles[1],i+r,s+o,-g),f(this.tiles[2],i+r+l+3*e*h,s,0);break;case 2:f(this.tiles[0],i,s,0),f(this.tiles[1],i+l+e*h,s,0),f(this.tiles[2],i+r+l+e*h,s+o,-g);break;default:console.error(`Position non prise en charge: ${c}`)}t.restore()}}const s="m",e=1,h="p",n=2,a="s",l=3,r="w",o=4,c="d",d=5;class u{constructor(i){this.tiles=i.map((i=>new t(i.getFamily(),i.getValue(),i.isRed()))),this.sort()}sort(){this.tiles.sort(((t,i)=>t.isLessThan(i)?-1:1))}find(t,i){const s=this.findTileIndex(t,i);if(-1!==s){[this.tiles[s],this.tiles[0]]=[this.tiles[0],this.tiles[s]];const t=this.tiles.shift();return this.sort(),t}}findTileIndex(t,i){return this.tiles.findIndex((s=>s.getFamily()===t&&s.getValue()===i))}count(t,i){return this.tiles.filter((s=>s.getFamily()===t&&s.getValue()===i)).length}findGroups(t=!1){if(0===this.tiles.length)return[];const i=this.tiles.pop(),s=i.getFamily(),e=i.getValue();if(this.count(s,e)>=1&&!t){const t=this.tryFormPair(i);if(t)return t}if(this.count(s,e)>=2){const s=this.tryFormTriplet(i,t);if(s)return s}if(s<=3){const h=this.count(s,e-1)>0,n=this.count(s,e-2)>0;if(h&&n){const s=this.tryFormSequence(i,t);if(s)return s}}this.tiles.push(i),this.sort()}tryFormPair(t){const s=this.find(t.getFamily(),t.getValue()),e=this.findGroups(!0);if(this.tiles.push(s),this.sort(),void 0!==e)return this.tiles.push(t),this.sort(),e.push(new i([t,s],0,0)),e}tryFormTriplet(t,s){const e=this.find(t.getFamily(),t.getValue()),h=this.find(t.getFamily(),t.getValue()),n=this.findGroups(s);if(this.tiles.push(e),this.tiles.push(h),this.sort(),void 0!==n)return n.push(new i([t,e,h],0,0)),this.tiles.push(t),this.sort(),n}tryFormSequence(t,s){const e=this.find(t.getFamily(),t.getValue()-1),h=this.find(t.getFamily(),t.getValue()-2),n=this.findGroups(s);if(this.tiles.push(e),this.tiles.push(h),this.sort(),void 0!==n)return n.push(new i([h,e,t],0,0)),this.tiles.push(t),this.sort(),n}}class f{constructor(t=""){this.isolate=!1,this.tiles=[],this.initializeFromString(t)}initializeFromString(t){for(let i=0;i<t.length-1;i++){const s=t.substring(i,i+2),e=s[0],h=Number(s[1]);this.isValidTileCode(e,h)&&this.addTileFromCode(e,h)}}isValidTileCode(t,i){return t===s||t===h||t===a||t===r||t===c}addTileFromCode(i,u){const f={[s]:e,[h]:n,[a]:l,[r]:o,[c]:d}[i];void 0!==f&&this.tiles.push(new t(f,u,!1))}getTiles(){return this.tiles}length(){return this.tiles.length}push(t){this.tiles.push(t)}pop(){return this.tiles.pop()}find(t,i){const s=this.findTileIndex(t,i);if(-1!==s){[this.tiles[s],this.tiles[0]]=[this.tiles[0],this.tiles[s]];const t=this.tiles.shift();return this.sort(),t}}findTileIndex(t,i){return this.tiles.findIndex((s=>s.getFamily()===t&&s.getValue()===i))}eject(t){if(t<0||t>=this.tiles.length)throw new Error("Invalid tile index");[this.tiles[0],this.tiles[t]]=[this.tiles[t],this.tiles[0]];const i=this.tiles.shift();return this.sort(),i}get(t){if(!(void 0===t||t<0||t>=this.tiles.length))return this.tiles[t]}sort(){this.tiles.sort(((t,i)=>t.isLessThan(i)?-1:1))}count(t,i){return this.tiles.filter((s=>s.getFamily()===t&&s.getValue()===i)).length}toGroup(t=!1){return new u(this.tiles).findGroups(t)}drawHand(t,i,s,e,h,n=void 0,a=!1,l=0){const r=(75+e)*h,o=Math.cos(l)*r,c=Math.sin(l)*r;for(let e=0;e<this.tiles.length;e++){const r=e===this.tiles.length-1&&this.isolate?10:0;let d=i+e*o+r*h*Math.cos(l),u=s+e*c+r*h*Math.sin(l);e===n&&(d+=25*h*Math.sin(l),u-=25*h*Math.cos(l)),this.tiles[e].drawTile(t,d,u,h,a,l)}}preload(){return t=this,i=void 0,e=function*(){yield Promise.all(this.tiles.map((t=>t.preloadImg())))},new((s=void 0)||(s=Promise))((function(h,n){function a(t){try{r(e.next(t))}catch(t){n(t)}}function l(t){try{r(e.throw(t))}catch(t){n(t)}}function r(t){var i;t.done?h(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(a,l)}r((e=e.apply(t,i||[])).next())}));var t,i,s,e}cleanup(){this.tiles.forEach((t=>t.cleanup())),this.tiles=[]}}class g{constructor(t=!1){this.tiles=[],this.tileIndexMap=new Map,this.initTiles(t)}displayFamilies(t,i,s,e,h=0,n=0){let a=i,l=s;const r=[{family:1,start:1,end:9},{family:2,start:1,end:9},{family:3,start:1,end:9},{family:4,start:1,end:4},{family:5,start:1,end:3}];for(const s of r){for(let i=s.start;i<=s.end;i++){const n=this.find(s.family,i);n&&(n.drawTile(t,a,l,e,!1,0,!1),a+=(75+h)*e)}a=i,l+=(100+n)*e}}length(){return this.tiles.length}pop(){if(0===this.tiles.length)throw new Error("Cannot pop from an empty deck");const t=this.tiles.pop(),i=this.getTileKey(t.getFamily(),t.getValue()),s=this.tileIndexMap.get(i);return s&&s.length>0&&(s.pop(),0===s.length?this.tileIndexMap.delete(i):this.tileIndexMap.set(i,s)),t}push(t){const i=this.tiles.length;this.tiles.push(t);const s=this.getTileKey(t.getFamily(),t.getValue()),e=this.tileIndexMap.get(s)||[];e.push(i),this.tileIndexMap.set(s,e)}find(t,i){const s=this.getTileKey(t,i),e=this.tileIndexMap.get(s);if(!e||0===e.length)return;const h=e[0];if(h>=this.tiles.length)return this.rebuildIndexMap(),this.find(t,i);[this.tiles[h],this.tiles[0]]=[this.tiles[0],this.tiles[h]],this.updateIndicesAfterSwap(0,h);const n=this.tiles.shift();return this.decrementIndicesAfterShift(),n}count(t,i){const s=this.getTileKey(t,i),e=this.tileIndexMap.get(s);return e?e.length:0}shuffle(){for(let t=this.tiles.length-1;t>0;t--){const i=Math.floor(Math.random()*(t+1));[this.tiles[t],this.tiles[i]]=[this.tiles[i],this.tiles[t]]}this.rebuildIndexMap()}getRandomHand(){const t=new f;if(this.shuffle(),this.tiles.length<13)throw new Error("Not enough tiles in deck to create a hand");for(let i=0;i<13;i++)t.push(this.pop());return t}cleanup(){this.tiles.forEach((t=>t.cleanup())),this.tiles=[],this.tileIndexMap.clear()}preload(){return t=this,i=void 0,e=function*(){const t=this.tiles.map((t=>t.preloadImg()));yield Promise.all(t)},new((s=void 0)||(s=Promise))((function(h,n){function a(t){try{r(e.next(t))}catch(t){n(t)}}function l(t){try{r(e.throw(t))}catch(t){n(t)}}function r(t){var i;t.done?h(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(a,l)}r((e=e.apply(t,i||[])).next())}));var t,i,s,e}getTileKey(t,i){return`${t}-${i}`}updateIndicesAfterSwap(t,i){if(t===i)return;const s=this.tiles[t],e=this.tiles[i],h=this.getTileKey(s.getFamily(),s.getValue()),n=this.getTileKey(e.getFamily(),e.getValue()),a=this.tileIndexMap.get(h)||[],l=this.tileIndexMap.get(n)||[],r=a.indexOf(i),o=l.indexOf(t);-1!==r&&(a[r]=t),-1!==o&&(l[o]=i),this.tileIndexMap.set(h,a),this.tileIndexMap.set(n,l)}decrementIndicesAfterShift(){var t;for(const[i,s]of this.tileIndexMap.entries())this.tileIndexMap.set(i,s.filter((t=>0!==t)).map((t=>t>0?t-1:t))),0===(null===(t=this.tileIndexMap.get(i))||void 0===t?void 0:t.length)&&this.tileIndexMap.delete(i)}rebuildIndexMap(){this.tileIndexMap.clear();for(let t=0;t<this.tiles.length;t++){const i=this.tiles[t],s=this.getTileKey(i.getFamily(),i.getValue()),e=this.tileIndexMap.get(s)||[];e.push(t),this.tileIndexMap.set(s,e)}}initTiles(i){for(let s=1;s<=3;s++)for(let e=1;e<=9;e++){const h=5===e&&i;for(let i=0;i<3;i++)this.push(new t(s,e,!1));this.push(new t(s,e,h))}for(let i=1;i<=4;i++)for(let s=0;s<4;s++)this.push(new t(4,i,!1));for(let i=1;i<=3;i++)for(let s=0;s<4;s++)this.push(new t(5,i,!1))}}const m=120,p={text:"Ignorer",color:"#FF9030",action:0},v={text:"Chii",color:"#FFCC33",action:1},y={text:"Pon",color:"#FFCC33",action:2},C={text:"Kan",color:"#FFCC33",action:3},x={text:"Ron",color:"#FF3060",action:4},T={text:"Tsumo",color:"#FF3060",action:5},w={text:"Retour",color:"#FF9030",action:0};function I(t,i,s,e){const h=i+7,n=s+5;D(t,i,s,8,110,50,v.color);for(let i=0;i<e.length;i++)e[i].drawTile(t,h+32*i,n,.4,!1,0,!1,!1)}function F(t,i,s,e){D(t,i,s,8,110,50,e.color),t.fillStyle="black",t.font="30px garamond";const h=i+110*(.25-.025*e.text.length),n=s+32.5;t.fillText(e.text,h,n)}function D(t,i,s,e,h,n,a){t.fillStyle=a,t.beginPath(),t.moveTo(i+e,s),t.lineTo(i+h-e,s),t.quadraticCurveTo(i+h,s,i+h,s+e),t.lineTo(i+h,s+n-e),t.quadraticCurveTo(i+h,s+n,i+h-e,s+n),t.lineTo(i+e,s+n),t.quadraticCurveTo(i,s+n,i,s+n-e),t.lineTo(i,s+e),t.quadraticCurveTo(i,s,i+e,s),t.fill(),t.fillStyle="#606060",t.stroke()}const P={color:"#007730",x:0,y:0,w:1050,h:1050},S=500,k=2e3,M=700,E={HAND_SIZE:.7,HIDDEN_HAND_SIZE:.6,DISCARD_SIZE:.6,GROUP_SIZE:.6},A=Math.PI;class R{constructor(t,i,s,e,h=!1,n=0,a=0){this.deadWall=[],this.hands=[],this.discards=[],this.groups=[],this.turn=0,this.waitingTime=M,this.selectedTile=void 0,this.canCall=!1,this.hasPicked=!1,this.hasPlayed=!1,this.lastPlayed=Date.now(),this.chooseChii=!1,this.end=!1,this.result=-1,this.BG_RECT=P,this.rotations=[0,-A/2,-A,A/2],this.ctx=t,this.cv=i,this.staticCtx=s,this.staticCv=e,this.level=n,this.windPlayer=a,this.turn=a%2==0?a:4-a,this.deck=new g(h),this.initializeGame()}initializeGame(){this.deck.shuffle();for(let t=0;t<14;t++)this.deadWall.push(this.deck.pop());for(let t=0;t<4;t++)this.hands.push(this.deck.getRandomHand()),this.discards.push([]),this.groups.push([]);this.lastDiscard=void 0,this.hands[0].sort(),0===this.turn&&this.pick(0)}draw(t){this.staticCtx.clearRect(0,0,this.cv.width,this.cv.height),this.staticCtx.fillStyle=this.BG_RECT.color,this.staticCtx.fillRect(this.BG_RECT.x,this.BG_RECT.y,this.BG_RECT.w,this.BG_RECT.h),this.getSelected(t),this.drawGame(),this.ctx.clearRect(0,0,this.cv.width,this.cv.height),this.ctx.drawImage(this.staticCv,0,0)}getDeck(){return this.deck}getHands(){return this.hands}isFinished(){return this.end}click(t){const i=this.cv.getBoundingClientRect();if(this.hasWin(0))return this.end=!0,void(this.result=1);if(this.chooseChii)return void this.handleChiiSelection(t,i);const s=function(t,i,s,e,h,n,a){const l=function(t,i,s,e,h){const n=[[h,T.action],[e,x.action],[s,C.action],[i,y.action],[t,v.action]].filter((([t])=>t)).map((([,t])=>t));return n.length>0&&n.push(p.action),n}(s,e,h,n,a);if(0===l.length)return-1;const r=960-l.length*m;if(!(838<i&&i<888))return-1;const o=Math.floor((t-r)/m),c=t-r-m*o;return o>=0&&o<l.length&&c>10?l[o]:-1}(t.x-i.x,t.y-i.y,this.canDoAChii().length>0,this.canDoAPon(),!1,!1,!1);this.canCall&&-1!==s?this.handleCallAction(s):0===this.turn&&void 0!==this.selectedTile&&this.handlePlayerDiscard()}handleChiiSelection(t,i){const s=this.getChii(0),e=function(t,i,s){if(0===s.length)return-1;const e=960-(s.length+1)*m;if(!(838<i&&i<888))return-1;const h=Math.floor((t-e)/m),n=t-e-m*h;return h>=0&&h<s.length+1&&n>10?h===s.length?0:s[h][0].getValue():-1}(t.x-i.x,t.y-i.y,s);0===e?this.chooseChii=!1:(this.chooseChii=!1,this.chii(e,0))}handleCallAction(t){if(0===t)this.canCall=!1,this.advanceTurn();else if(1===t){const t=this.canDoAChii();1===t.length?this.chii(t[0],0):(this.chooseChii=!0,this.drawGame())}else 2===t&&this.pon(this.turn)}handlePlayerDiscard(){if(this.discard(0,this.selectedTile),!this.checkPon()){const t=this.canDoAChii(1);if(t.length>0){const i=Math.floor(Math.random()*t.length);this.chii(t[i],1)}else this.advanceTurn()}}advanceTurn(){this.updateWaitingTime(),this.turn=(this.turn+1)%4,this.pick(this.turn),this.hasPicked=!0,this.hasPlayed=!1}getSelected(t){this.cv.getBoundingClientRect();const i=E.HAND_SIZE,s=t.x-140.625,e=t.y,h=Math.floor(s/(83.9*i));s-83.9*h*i<=80.9*i&&h>=0&&h<this.hands[0].length()&&e>=900&&e<=900+100*i?this.selectedTile=h:this.selectedTile=void 0}updateWaitingTime(){this.waitingTime=Math.floor(Math.random()*(k-S)+S)}play(){0===this.turn||this.end||(this.hasPicked?this.hasPlayed?this.canCall||this.advanceBotTurn():this.handleBotTurn():(this.lastPlayed=Date.now(),this.pick(this.turn),this.hasPicked=!0))}handleBotTurn(){if(this.hasWin(this.turn))return this.end=!0,void(this.result=2);if(Date.now()-this.lastPlayed>this.waitingTime){this.lastPlayed=Date.now();const t=Math.floor(this.hands[this.turn].length()*Math.random());if(this.discard(this.turn,t),this.hasPlayed=!0,this.deck.length()<=0)return this.result=0,void(this.end=!0);this.end||(this.checkPon(),this.checkForChii(),this.canCall=this.canDoAChii().length>0||this.canDoAPon())}}checkForChii(){if(3===this.turn)return;const t=this.turn+1,i=this.canDoAChii(t);if(i.length>0){const s=Math.floor(Math.random()*i.length);this.chii(i[s],t)}}advanceBotTurn(){3===this.turn?(this.turn=0,this.pick(0),this.hasWin(0)&&(this.end=!0,this.result=1)):this.turn++,this.updateWaitingTime(),this.hasPicked=!1,this.hasPlayed=!1}pick(t){this.hands[t].push(this.deck.pop()),this.hands[t].isolate=!0}discard(t,i){const s=this.hands[t].eject(i);this.hands[t].sort(),s.setTilt(),this.discards[t].push(s),this.hands[t].isolate=!1,this.hands[t].sort(),this.lastDiscard=t,this.lastPlayed=Date.now()}canDoAChii(t=0){const i=[];if(void 0===this.lastDiscard||(this.lastDiscard+1)%4!==t||(this.turn+1)%4!==t||this.discards[this.lastDiscard][this.discards[this.lastDiscard].length-1].getFamily()>=4)return i;const s=this.discards[this.lastDiscard][this.discards[this.lastDiscard].length-1],e=this.hands[t],h=s.getFamily(),n=s.getValue();return e.count(h,n-2)>0&&e.count(h,n-1)>0&&i.push(n-2),e.count(h,n-1)>0&&e.count(h,n+1)>0&&i.push(n-1),e.count(h,n+1)>0&&e.count(h,n+2)>0&&i.push(n),i}chii(t,s){const e=0===s?3:s-1,h=this.discards[e].pop();this.lastDiscard=void 0;const n=[];let a=0,l=t;for(;a<2;)l===h.getValue()||(n[a]=this.hands[s].find(h.getFamily(),l),a++),l++;[h,n[0],n[1]].forEach((t=>t.setTilt())),this.groups[s].push(new i([h,n[0],n[1]],e,s)),this.hasWin(s)&&(this.end=!0,this.result=0===s?1:2),this.updateWaitingTime(),this.turn=s,this.hasPicked=!0,this.hasPlayed=!1}getChii(t){const i=[],s=this.canDoAChii(),e=0===t?3:t-1,h=this.discards[e],n=h[h.length-1];for(let e=0;e<s.length;e++){const h=s[e],a=[];for(let i=0;i<3;i++)if(h+i===n.getValue())a.push(n);else{const s=this.hands[t].find(n.getFamily(),h+i);a.push(s),this.hands[t].push(s),this.hands[t].sort()}i.push(a)}return i}checkPon(){for(let t=1;t<4;t++)if(this.canDoAPon(t))return this.pon(this.lastDiscard,t),!0;return!1}canDoAPon(t=0){if(void 0===this.lastDiscard||this.lastDiscard===t||this.turn===t||this.hasPicked&&!this.hasPlayed)return!1;const i=this.discards[this.lastDiscard][this.discards[this.lastDiscard].length-1];return this.hands[t].count(i.getFamily(),i.getValue())>=2}pon(t,s=0){const e=this.discards[t].pop();this.lastDiscard=void 0;const h=this.hands[s].find(e.getFamily(),e.getValue()),n=this.hands[s].find(e.getFamily(),e.getValue());[e,h,n].forEach((t=>t.setTilt())),this.groups[s].push(new i([e,h,n],t,s)),this.hasWin(s)&&(this.end=!0,this.result=0===s?1:2),this.updateWaitingTime(),this.turn=s,this.hasPicked=!0,this.hasPlayed=!1}hasWin(t){return void 0!==this.hands[t].toGroup()}drawGame(){this.play(),function(t,i=0,s=0){let e=525,h=Math.PI,n=630;t.save(),t.translate(525,525),t.rotate([0,-h/2,h,h/2][i]),t.translate(-525,-525),t.fillStyle="#ffcc33",t.beginPath(),t.moveTo(e,n),t.lineTo(452,n),t.quadraticCurveTo(450,n,450,632),t.lineTo(450,632),t.quadraticCurveTo(450,634,452,634),t.lineTo(598,634),t.quadraticCurveTo(600,634,600,632),t.lineTo(600,632),t.quadraticCurveTo(600,n,598,n),t.lineTo(e,n),t.fill(),t.stroke(),t.restore(),t.save(),t.translate(525,525),t.rotate(s),t.translate(-525,-525),t.fillStyle="#e0e0f0",t.beginPath(),t.moveTo(425,e),t.lineTo(425,595),t.quadraticCurveTo(425,625,455,625),t.lineTo(595,625),t.quadraticCurveTo(625,625,625,595),t.lineTo(625,455),t.quadraticCurveTo(625,425,595,425),t.lineTo(455,425),t.quadraticCurveTo(425,425,425,455),t.lineTo(425,e),t.fill(),t.stroke(),t.fillStyle="#000000",t.font="40px garamond",t.fillText("Est",505,615),t.save(),t.translate(525,525),t.rotate(-1.570796),t.translate(-525,-525),t.fillText("Sud",500,615),t.restore(),t.save(),t.translate(525,525),t.rotate(3.141592),t.translate(-525,-525),t.fillText("Ouest",480,615),t.restore(),t.save(),t.translate(525,525),t.rotate(1.570796),t.translate(-525,-525),t.fillText("Nord",485,615),t.restore(),t.restore()}(this.staticCtx,this.turn,A/2*this.windPlayer),this.drawDiscardSize(),this.drawResult(),this.drawHands(),this.drawGroups(E.GROUP_SIZE);for(let t=0;t<4;t++)this.drawDiscard(t,void 0!==this.selectedTile?this.hands[0].get(this.selectedTile):void 0);this.chooseChii?function(t,i){const s=[...i].reverse();F(t,850,835,w);let e=1;for(const i of s)I(t,850-e*m,835,i),e++}(this.staticCtx,this.getChii(0)):function(t,i,s){const e=[[i,(t,i,s)=>F(t,i,s,v)],[s,(t,i,s)=>F(t,i,s,y)],[!1,(t,i,s)=>F(t,i,s,C)],[!1,(t,i,s)=>F(t,i,s,x)],[!1,(t,i,s)=>F(t,i,s,T)]];if(!e.some((([t])=>t)))return;e.unshift([!0,(t,i,s)=>F(t,i,s,p)]);let h=0;for(const[i,s]of e)i&&(s(t,850-h*m,835),h++)}(this.staticCtx,this.canDoAChii().length>0,this.canDoAPon())}drawHands(){const{HAND_SIZE:t,HIDDEN_HAND_SIZE:i}=E;this.hands[0].drawHand(this.staticCtx,140.625,1e3-150*t,5*t,.75,this.selectedTile,!1,0),this.hands[1].drawHand(this.staticCtx,1e3-150*i,1e3-375*i,5*i,i,void 0,!0,-A/2),this.hands[2].drawHand(this.staticCtx,1e3-375*i,150*i,5*i,i,void 0,!0,-A),this.hands[3].drawHand(this.staticCtx,150*i,375*i,5*i,i,void 0,!0,A/2)}drawGroups(t){for(let i=0;i<4;i++){const s=this.rotations[i],e=this.groups[i];if(e.length>0)for(let i=e.length-1;i>=0;i--)e[i].drawGroup(this.staticCtx,810-285*t*i,988,5,.6,s,void 0!==this.selectedTile?this.hands[0].get(this.selectedTile):void 0)}}drawDiscard(t,i){const s=E.DISCARD_SIZE;this.staticCtx.save(),this.staticCtx.translate(525,525),this.staticCtx.rotate(this.rotations[t]);const e=475*-s/2,h=242.5*s;for(let n=0;n<this.discards[t].length;n++){const a=this.discards[t][n];let l,r;n<12?(l=e+n%6*80*s,r=h+105*Math.floor(n/6)*s):(l=e+80*(n-12)*s,r=h+210*s),a.drawTile(this.staticCtx,l,r,s,!1,0,null==i?void 0:i.isEqual(a.getFamily(),a.getValue()))}this.lastDiscard===t&&this.drawLastDiscardIndicator(t),this.staticCtx.restore()}drawLastDiscardIndicator(t){const i=this.discards[t].length-1,s=E.DISCARD_SIZE,e=475*-s/2,h=242.5*s;let n=i<12?e+i%6*80*s:e+80*(i-12)*s,a=i<12?h+105*Math.floor(i/6)*s:h+210*s;n+=37.5*s,a+=115*s,this.staticCtx.fillStyle="#ff0000",this.staticCtx.beginPath(),this.staticCtx.moveTo(n,a),this.staticCtx.lineTo(n+5,a+8.66),this.staticCtx.lineTo(n-5,a+8.66),this.staticCtx.lineTo(n,a),this.staticCtx.fill(),this.staticCtx.stroke()}drawDiscardSize(){this.staticCtx.fillStyle="#f070f0",this.staticCtx.font="40px garamond";const t=this.deck.length(),i=t<10?517:507;this.staticCtx.fillText(t.toString(),i,537)}drawResult(){-1!==this.result&&(this.staticCtx.fillStyle="#e0e0f0",this.staticCtx.fillRect(450,430,150,190),this.staticCtx.fillRect(430,450,190,150),this.staticCtx.fillStyle="#ff0000",this.staticCtx.font="45px garamond",0===this.result?this.staticCtx.fillText("Égalité",450,535):1===this.result?this.staticCtx.fillText("Victoire !",440,535):2===this.result&&this.staticCtx.fillText("Défaite...",440,535))}preload(){return t=this,i=void 0,e=function*(){yield this.deck.preload(),yield Promise.all(this.hands.map((t=>t.preload())))},new((s=void 0)||(s=Promise))((function(h,n){function a(t){try{r(e.next(t))}catch(t){n(t)}}function l(t){try{r(e.throw(t))}catch(t){n(t)}}function r(t){var i;t.done?h(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(a,l)}r((e=e.apply(t,i||[])).next())}));var t,i,s,e}}var V=function(t,i,s,e){return new(s||(s=Promise))((function(h,n){function a(t){try{r(e.next(t))}catch(t){n(t)}}function l(t){try{r(e.throw(t))}catch(t){n(t)}}function r(t){var i;t.done?h(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(a,l)}r((e=e.apply(t,i||[])).next())}))};class G{constructor(){this.CANVAS_ID="myCanvas",this.BG_RECT={x:0,y:0,w:1050,h:1050},this.FPS=60,this.FRAME_INTERVAL=1e3/this.FPS,this.mouse={x:0,y:0},this.game=null,this.decks=[],this.hands=[],this.animationFrameId=null,this.lastFrameTime=0,this.isInitialized=!1,this.cleanupCallbacks=[];const t=document.getElementById(this.CANVAS_ID);if(!t)throw new Error(`Canvas avec ID '${this.CANVAS_ID}' introuvable`);this.canvas=t,this.canvas.width=this.BG_RECT.w,this.canvas.height=this.BG_RECT.h;const i=t.getContext("2d",{alpha:!1});if(!i)throw new Error("Impossible d'obtenir le contexte 2D du canvas");this.ctx=i,this.staticCanvas=document.createElement("canvas"),this.staticCanvas.width=t.width,this.staticCanvas.height=t.height;const s=this.staticCanvas.getContext("2d",{alpha:!1});if(!s)throw new Error("Impossible d'obtenir le contexte du canvas statique");this.staticCtx=s}static getInstance(){return G.instance||(G.instance=new G),G.instance}drawFrame(){this.game&&this.game.draw(this.mouse)}startAnimationLoop(){const t=i=>{this.animationFrameId=requestAnimationFrame(t);const s=i-this.lastFrameTime;s<this.FRAME_INTERVAL||(this.lastFrameTime=i-s%this.FRAME_INTERVAL,this.drawFrame())};this.animationFrameId=requestAnimationFrame(t)}initEventListeners(){const t=t=>{const i=this.canvas.getBoundingClientRect();this.mouse.x=t.clientX-i.left,this.mouse.y=t.clientY-i.top},i=t=>{this.game&&this.game.click(t)};this.canvas.addEventListener("mousemove",t),this.canvas.addEventListener("mousedown",i),this.cleanupCallbacks.push((()=>{this.canvas.removeEventListener("mousemove",t),this.canvas.removeEventListener("mousedown",i)}))}preloadDeck(t){return V(this,void 0,void 0,(function*(){yield t.preload()}))}preloadHand(t){return V(this,void 0,void 0,(function*(){yield t.preload()}))}initialize(){return V(this,void 0,void 0,(function*(){if(!this.isInitialized)try{console.log("Chargement en cours..."),this.game=new R(this.ctx,this.canvas,this.staticCtx,this.staticCanvas,!1,0,Math.floor(4*Math.random())),yield Promise.all([...this.decks.map((t=>this.preloadDeck(t))),...this.hands.map((t=>this.preloadHand(t))),this.game.preload()]),console.log("Chargement terminé"),this.initEventListeners(),this.startAnimationLoop(),this.isInitialized=!0,window.cleanup=this.cleanup.bind(this)}catch(t){console.error("Erreur lors de l'initialisation:",t)}}))}cleanup(){var t,i;null!==this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.cleanupCallbacks.forEach((t=>t())),this.cleanupCallbacks=[],this.game&&(null===(i=(t=this.game).cleanup)||void 0===i||i.call(t),this.game=null),this.decks.forEach((t=>t.cleanup())),this.hands.forEach((t=>t.cleanup())),this.decks=[],this.hands=[],this.isInitialized=!1,this.lastFrameTime=0,this.mouse={x:0,y:0},this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.staticCtx.clearRect(0,0,this.staticCanvas.width,this.staticCanvas.height)}}"undefined"!=typeof window&&function(){return V(this,void 0,void 0,(function*(){yield G.getInstance().initialize()}))}().catch(console.error)})();