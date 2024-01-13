const fs = require('fs');
const path = require('path');

const rootDir = __dirname; // Корневая директория

// Функция для рекурсивного чтения директории
const readDirectory = (dir, allFiles = []) => {
	// Игнорирование скрытых папок, node_modules и package-lock.json
	if (
		dir.includes('node_modules') ||
		dir.includes('.next') ||
		dir.includes('out') ||
		path.basename(dir).startsWith('.') ||
		path.basename(dir) === 'package-lock.json'
	) {
		return allFiles;
	}

	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const filePath = path.join(dir, file);

		// Пропуск файла package-lock.json
		if (
			filePath.endsWith('package-lock.json') ||
			filePath.endsWith('.ico')
		) {
			return;
		}

		if (fs.statSync(filePath).isDirectory()) {
			readDirectory(filePath, allFiles);
		} else {
			allFiles.push(filePath);
		}
	});

	return allFiles;
};

// Функция для записи содержимого в файл repository.txt и вывода информации в консоль
const writeToRepositoryFile = (allFiles, repoFilePath, scriptFilePath) => {
	let fileContents = '';

	allFiles.forEach((filePath, index) => {
		if (filePath !== repoFilePath && filePath !== scriptFilePath) {
			const content = fs.readFileSync(filePath, 'utf8');
			// Запись относительного пути с добавлением './'
			const relativePath = '.\\' + path.relative(rootDir, filePath);
			fileContents += `File Path: ${relativePath}\nContent:\n${content}\n\n`;

			// Вывод текущего пути и процента обработки
			const percentComplete = (
				((index + 1) / allFiles.length) *
				100
			).toFixed(2);
			console.log(
				`Processing ${relativePath} (${percentComplete}% complete)`
			);
		}
	});

	fs.writeFileSync(repoFilePath, fileContents);
};

// Основная функция
const createRepositoryFile = () => {
	const repoFilePath = path.join(rootDir, 'repository.txt');
	const scriptFilePath = path.join(rootDir, 'createRepoFile.js'); // Путь к этому скрипту

	const allFiles = readDirectory(rootDir);
	writeToRepositoryFile(allFiles, repoFilePath, scriptFilePath);
};

createRepositoryFile();
