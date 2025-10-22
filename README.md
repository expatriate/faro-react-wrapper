# faro-react-wrapper

Обёртка для Grafana Faro с поддержкой React Router и пользовательских метрик.

## Возможности

- Поддержка React Router v4-v7 с автоматическим определением версии
- Упрощённый сбор и отправка пользовательских метрик
- Встроенная санитизация URL и чувствительных данных
- Простая интеграция с Grafana Faro

## Установка

```bash
npm install faro-react-wrapper
```

### Peer Dependencies

```json
{
  "@grafana/faro-react": "^1.19.0",
  "@grafana/faro-transport-otlp-http": "^1.19.0",
  "history": "^5.3.0",
  "react-router-dom": "^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"
}
```

## Использование

### Инициализация Faro

```typescript
import { FaroService, getRouterAdapter } from 'faro-react-wrapper';

const faro = new FaroService();

// Автоматическое определение версии роутера и настройка адаптера
faro.init({
  faroUrl: 'https://faro.example.com',
  faroKey: 'your-key',
  routerAdapter: getRouterAdapter(version),
});
```

### Отправка метрик

```typescript
import { MetricsService } from 'faro-react-wrapper';

const metrics = new MetricsService(faro);

metrics.sendCustomMetric({
  name: 'user_action',
  value: 1,
  unit: 'EVENTS',
  type: 'counter',
  labels: {
    action: 'click',
    component: 'button',
  },
});
```

### Кастомная санитизация URL

```typescript
faro.addSanitizer((beacon) => {
  // Пользовательская логика санитизации
  return sanitizedBeacon;
});
```

## API

### FaroService

Основной сервис для интеграции с Grafana Faro.

Методы:

- `init(config)`: Инициализация сервиса
- `addSanitizer(fn)`: Добавление пользовательской функции санитизации
- `getInstance()`: Получение инстанса Faro
- `destroy()`: Очистка ресурсов

### MetricsService

Сервис для работы с метриками.

Методы:

- `sendCustomMetric(metric)`: Отправка пользовательской метрики

### Типы метрик

```typescript
type MetricUnit =
  | 'BYTES'
  | 'MILLISECONDS'
  | 'SECONDS'
  | 'REQUESTS'
  | 'ERRORS'
  | 'OPERATIONS'
  | 'EVENTS'
  | 'UNITLESS';
type MetricType = 'histogram' | 'counter' | 'gauge';
```

## Разработка

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка
npm run build

# Тесты
npm test
npm run test:watch
```

## Лицензия

MIT
