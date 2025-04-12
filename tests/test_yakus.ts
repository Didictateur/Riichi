import { assert } from "./assert"
import { yakus } from "../src/yakus/yaku"
import { Hand } from "../src/hand"

let count = 0;
let total = 0;

let h1 = new Hand("m1m2m3 m4m5m6 m7m8m9 m1m2m3 m5m5");
let h2 = new Hand("m1m1m1 m4m4m4 m7m7m7 p1p1p1 p5p5");
let h3 = new Hand("m1m1m1 p9p9p9 s1s1s1 w2w2w2 d1d1");
let h4 = new Hand("m2m3m4 p3p3p3 p4p5p6 s4s4 s6s7s8");
let h5 = new Hand("m1m2m3 m1m2m3 p7p8p9 p7p8p9 w3w3");
let h6 = new Hand("m1m2m3 m1m2m3 p6p7p8 p7p8p9 w3w3");
let h7 = new Hand("m1m2m3 p1p2p3 s1s2s3 m7m8m9 p9p9");
let h8 = new Hand("m1m2m3 m1m2m3 p6p6 w0w0w0 w3w3w3");
let h9 = new Hand("m1m2m3 m1m2m3 d1d1d1 d2d2d2 d3d3");
let h10 = new Hand("m1m2m3 p6p6 d1d1d1 d2d2d2 d3d3d3");
let h11 = new Hand("m1m2m3 w1w1w1 w2w2w2 w3w3w3 w4w4");
let h12 = new Hand("m1m1 w1w1w1 w2w2w2 w3w3w3 w4w4w4");
let h13 = new Hand("d1d1 w1w1w1 w2w2w2 w3w3w3 w4w4w4");
let h14 = new Hand("m1m1 m9m9m9 p1p1p1 p9p9p9 s1s1s1");
let h15 = new Hand("m1m9m9 p1p9 s1s9 w1w2w3w4 d1d2d3");
let h16 = new Hand("m1m1 m2m2 m3m3 m4m4 m5m5 m6m6 m7m7");
let h17 = new Hand("m1m1 m2m2 m3m3 m4m4 m5m5 m6m6 m6m6");
let h18 = new Hand("m1m2m3 m4m4m4 m7m7m7 p1p1p1 p5p5");
let h19 = new Hand("m1m2m3 m7m7m7 p1p1p1 p5p5");

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

// ittsuu
count += assert(yakus.ittsuu(h1, [], 0) === 2, "m123 m456 m789 m123 m55 is Ittsuu");
count += assert(yakus.ittsuu(h2, [], 0) === 0, "m111 m444 m777 p111 p55 is not Ittsu");
total += 2;

// tanyao
count += assert(yakus.tanyao(h4, [], 0) === 1, "m234 p333 p456 s44 s678 is Tanyao");
count += assert(yakus.tanyao(h1, [], 0) === 0, "m123 m456 m789 m123 p55 is not Tanyao");
total += 2;

// yakuhai
count += assert(yakus.yakuhai(h3, [], 2) === 1, "m111 p999 s111 w222 d11 West is Yakuhai");
count += assert(yakus.yakuhai(h8, [], 3) === 2, "m123 m123 p66 w000 w333 North is double Yakuhai");
count += assert(yakus.yakuhai(h3, [], 0) === 0, "m111 p999 s111 w222 d11 Est is not Yakuhai");
total += 3;

// shousangen
count += assert(yakus.shousangen(h9, [], 0) === 2, "m123 m123 d111 d222 d33 is Shousangen");
count += assert(yakus.shousangen(h10, [], 0) === 0, "m123 p66 d111 d222 d333 is not Shousangen");
count += assert(yakus.shousangen(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Shousangen");
total += 3;

// daisangen
count += assert(yakus.daisangen(h10, [], 0) === 13, "m123 p66 d111 d222 d333 is Daisangen");
count += assert(yakus.daisangen(h9, [], 0) === 0, "m123 m123 d111 d222 d33 is not Daisangen");
count += assert(yakus.daisangen(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Daisangen");
total += 3;

// shousuushi
count += assert(yakus.shousuushii(h11, [], 0) === 13, "m123 w111 w222 w333 w44 is Shousuushi");
count += assert(yakus.shousuushii(h12, [], 0) === 0, "m11 w111 w222 w333 w444 is not Shousuushi");
count += assert(yakus.shousuushii(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Shousuushi");
total += 3;

// daisuushi
count += assert(yakus.daisuushi(h12, [], 0) === 13, "m11 w111 w222 w333 w444 is Daisuushi");
count += assert(yakus.daisuushi(h11, [], 0) === 0, "m123 w111 w222 w333 w44 is not Daisuushi");
count += assert(yakus.daisuushi(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Daisuushi");
total += 3;

// chanta
count += assert(yakus.chanta(h13, [], 0) === 2, "d11 w111 w222 w333 w444 is Chanta");
count += assert(yakus.chanta(h12, [], 0) === 2, "m11 w111 w222 w333 w444 is Chanta");
count += assert(yakus.chanta(h10, [], 0) === 0, "m123 p66 d111 d222 d333 is not Chanta");
total += 3;

// junchan
count += assert(yakus.junchan(h7, [], 0) === 3, "m123 p123 s123 m789 p99 is Junchan");
count += assert(yakus.junchan(h10, [], 0) === 0, "m123 p66 d111 d222 d333 is not Junchan");
total += 2;

// honroutou
count += assert(yakus.honroutou(h14, [], 0) === 2, "m11 m999 p111 p999 s111 is Honroutou");
count += assert(yakus.honroutou(h3, [], 0) === 2, "m111 p999 s111 w222 d11 is Honroutou");
count += assert(yakus.honroutou(h10, [], 0) === 0, "m123 p66 d111 d222 d333 is not Honroutou");
total += 3;

// chinroutou
count += assert(yakus.chinroutou(h14, [], 0) === 13, "m11 m999 p111 p999 s111 is Chinroutou");
count += assert(yakus.chinroutou(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Chinroutou");
count += assert(yakus.chinroutou(h10, [], 0) === 0, "m123 p66 d111 d222 d333 is not Chinroutou");
total += 3;

// tsuuisou
count += assert(yakus.tsuuiisou(h13, [], 0) === 13, "d11 w111 w222 w333 w444 is Tsuuisou");
count += assert(yakus.tsuuiisou(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Tsuuisou");
total += 2;

// kokushiMusou
count += assert(yakus.kokushiMusou(h15, [], 0) === 13, "m1m9m9 p1p9 s1s9 w1w2w3w4 d1d2d3 is Kokushi Musou");
count += assert(yakus.kokushiMusou(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Kokushi Musou");
total += 2;

// chiitoitsu
count += assert(yakus.chiitoitsu(h16, [], 0) === 2, "m11 m22 m33 m44 m55 m66 m77 is Chiitoitsu");
count += assert(yakus.chiitoitsu(h17, [], 0) === 0, "m11 m22 m33 m44 m55 m66 m66 is not Chiitoitsu");
count += assert(yakus.chiitoitsu(h3, [], 0) === 0, "m111 p999 s111 w222 d11 is not Chiitoitsu");
total += 3;

// toitoi
count += assert(yakus.toitoi(h2, [], 0) === 2, "m111 m444 m777 p111 p55 is Toitoi");
count += assert(yakus.toitoi(h7, [], 0) === 0, "m123 p123 s123 m789 p99 is not Toitoi");
total += 2;

// sanankou
count += assert(yakus.sanankou(h18, [], 0) === 2, "m123 m444 m777 p111 p55 is Sanankou");
count += assert(yakus.sanankou(h2, [], 0) === 0, "m111 m444 m777 p111 p55 is not Sanankou");
count += assert(yakus.sanankou(h7, [], 0) === 0, "m123 p123 s123 m789 p99 is not Sanankou");
total += 3;

// sanankou
count += assert(yakus.suuankou(h2, [], 0) === 13, "m111 m444 m777 p111 p55 is Sanankou");
count += assert(yakus.suuankou(h18, [], 0) === 0, "m123 m444 m777 p111 p55 is not  Sanankou");
count += assert(yakus.suuankou(h7, [], 0) === 0, "m123 p123 s123 m789 p99 is not Sanankou");
total += 3;

// total
console.log("Succès: " + count.toString() + "/" + total.toString());
