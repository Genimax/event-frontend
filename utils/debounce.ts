export function debounce<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timer: NodeJS.Timeout | null = null;
	return (...args: Parameters<T>): void => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}
