export function assert(b: boolean, msg: string): number {
	if (b) {
		console.log("%c[SUCCES] " + msg, "color: green");
		return 1;
	} else {
		console.log("%c[ECHEC] " + msg, "color: red");
		return 0;
	}
}
