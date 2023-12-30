export function formatTime(milliseconds: number): string {
	// Конвертируем миллисекунды в секунды
	const totalSeconds = Math.floor(milliseconds / 1000);
	// Вычисляем минуты и секунды
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	// Форматируем строку
	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}
