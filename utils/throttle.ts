export function throttle(callback: () => void, delay: number): () => void {
	let lastCall = 0;

	return function () {
		const now = new Date().getTime();
		if (now - lastCall < delay) {
			return;
		}
		lastCall = now;
		callback();
	};
}
