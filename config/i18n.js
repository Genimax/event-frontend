import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импортируйте ресурсы перевода
import translationRU from './locales/ru.json'; // Путь к вашему файлу локализации

i18n.use(initReactI18next) // Подключаем initReactI18next
	.init({
		resources: {
			ru: { translation: translationRU },
		},
		lng: 'ru', // Начальный язык
		fallbackLng: 'ru', // Язык по умолчанию
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
