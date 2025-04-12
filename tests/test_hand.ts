import { Hand } from "../src/hand"
import { assert } from "./assert";

let h0 = new Hand("s1s1");
let h1 = new Hand("m1m2m3");
let h2 = new Hand("m2m2m2 p1p1");
let h3 = new Hand("m1m2m3 p1p2p3 s1s2s3 m9m9m9 p9p9");
let h4 = new Hand("m2m2m2 p1p1p1");

let count = 0;
let total = 0;

count += assert(h0.toGroup()?.length === 1, "s11 has 1 group");
count += assert(h1.toGroup()?.length === 1, "m123 has 1 group");
count += assert(h2.toGroup()?.length === 2, "m222 p11 has 2 groups");
count == assert(h3.toGroup()?.length === 5, "m123 p123 s123 m999 p99 has 5 groups");
count += assert(h4.toGroup()?.length === 2, "m222 p111 has 2 groups");
total += 4;

console.log("Succès: " + count.toString() + "/" + total.toString());
