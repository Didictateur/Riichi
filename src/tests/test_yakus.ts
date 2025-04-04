import { assert } from "./assert"
import { yakus } from "../yakus/yaku"
import { Hand } from "../hand"

let count = 0;
let total = 0;

let h1 = new Hand("m1m2m3 m4m5m6 m7m8m9 p1p2p3 p5p5");
let h2 = new Hand("m1m1m1 m4m4m4 m7m7m7 p1p1p1 p5p5");
let h3 = new Hand("m1m1m1 p9p9p9 s1s1s1 w2w2w2 d1d1");
let h4 = new Hand("m2m3m4 p3p3p3 p4p5p6 s4s4 s6s7s8");
let h5 = new Hand("m1m2m3 m1m2m3 p7p8p9 p7p8p9 w3w3");
let h6 = new Hand("m1m2m3 m1m2m3 p6p7p8 p7p8p9 w3w3");
let h7 = new Hand("m1m2m3 p1p2p3 s1s2s3 m7m8m9 p9p9");

// lipeikou
count += assert(yakus.lipekou(h5, [], 0) === 1, "m123 m123 p789 p789 w33 is Lipeikou");
count += assert(yakus.lipekou(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Lipeikou");
total += 2;

// ryanpeikou
count += assert(yakus.ryanpeikou(h5, [], 0) === 3, "m123 m123 p789 p789 w33 is Ryanpeikou");
count += assert(yakus.ryanpeikou(h6, [], 0) === 0, "m1123 m123 p678 p789 w33 is not Ryanpeikou");
total += 2;

// pinfu
count += assert(yakus.pinfu(h1, [], 0) === 1, "m123 m456 m789 m123 p55 is Pinfu");
count += assert(yakus.pinfu(h2, [], 0) === 0, "m111 m444 m777 p111 p55 is not Pinfu");
total += 2;

// sanshoku doujun
count += assert(yakus.sanshokuDoujun(h7, [], 0) === 2, "m123 p123 s123 m789 p99 is Shanshokou Doujun");
count += assert(yakus.sanshokuDoujun(h2, [], 0) === 0, "m111 m444 m777 p111 p55 is not Shanshokou Doujun");
total += 2;

// chanta
count += assert(yakus.chanta(h3, [], 0) === 2, "m111 p999 s111 w222 d11 is Chanta");
count += assert(yakus.chanta(h1, [], 0) === 0, "m123 m456 m789 m123 p55 is not Chanta");
total += 2;

// total
console.log("Succès: " + count.toString() + "/" + total.toString());
