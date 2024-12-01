# envise
Лёгкая и удобная библиотека для управления переменными окружения из .env файлов в проектах Node.js. Она позволяет загружать, изменять и сохранять переменные окружения с минимальным количеством кода, поддерживая работу с несколькими .env файлами.

## Установка
Установить библиотеку можно с помощью npm:

```bash
npm i envise
```

## Быстрый старт
После установки envise автоматически загружает переменные из файла .env, если он находится в текущей рабочей директории.

Пример .env файла:
```env
TOKEN=your-token-here
DEBUG=true
```

**Использование:**
```js
const env = require('envise');

console.log(env.get.TOKEN);      // 'your-token-here'
console.log(env.get.DEBUG);      // 'true'
console.log(env.get('TOKEN'));   // 'your-token-here'
console.log(env.get('DEBUG'));   // 'true'
```

Загрузка другого .env файла

Если файл .env находится в другом месте, вы можете указать его путь с помощью метода load:

Пример .env файла по пути private/.env:
```env
TOKEN=custom-token
API_KEY=12345
```

**Использование:**
```js
const env = require('envise');

env.load('private/.env');

console.log(env.get.TOKEN);      // 'custom-token'
console.log(env.get.API_KEY);    // '12345'
```


## API

### get
Позволяет получить значение переменной окружения.

```js
console.log(env.get.TOKEN);    // 'custom-token'
console.log(env.get('TOKEN')); // 'custom-token'
```

### exists
Проверяет, существует ли переменная окружения.

```js
console.log(env.exists.TOKEN);    // true
console.log(env.exists('FOO'));   // false
```

### set
Добавляет или изменяет переменную окружения в памяти.

```js
env.set('GITHUB', '62TEh28e72Hsi2937eHw8');
```

### delete
Удаляет переменную окружения из памяти.

```js
env.delete('GITHUB');
```

### clear
Удаление всех переменных окружения из памяти.

```js
env.clear();
```

### keys
Возвращает массив всех ключей переменных.

```js
console.log(env.keys()); // [ "TOKEN", "API_KEY", "GITHUB" ]
```

### save
Сохраняет текущие переменные окружения из памяти, обратно в файл.

```js
env.save('private/.env'); // Сохранить в указанный файл
env.save();               // Сохранить в файл по умолчанию
```

### load
Загружает переменные окружения из указанного пути.

```js
env.load('private/.env');
```

## Лицензия
Этот проект распространяется по лицензии **MIT (Modified)**.
