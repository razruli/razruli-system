# Load Aggregation Service

## MVP Core for Resource Management Platform

---

## 1. Overview

The Load Aggregation Service is a domain-level microservice responsible for calculating and aggregating workload metrics across employees and departments.

This service is **not the entire system**. It represents the analytical core upon which higher-level modules will be built, including:

- Task allocation automation
- Predictive workload analytics
- SLA enforcement
- KPI tracking
- Financial modeling
- Resource optimization engines

The MVP version focuses strictly on workload calculation and aggregation logic.

---

## 2. Scope and Boundaries

### Included in MVP

- Employee workload calculation
- Department workload aggregation
- Task weight modeling
- Capacity normalization
- Overload index computation
- Snapshot generation
- Public read-model API

### Excluded from MVP

- Automatic task redistribution
- Predictive (ML-based) load forecasting
- SLA engine
- HR performance evaluation
- Cross-department optimization
- Workforce planning engine

---

## 3. Core Domain Definitions

### 3.1 Employee Load

Employee workload is defined as:

EmployeeLoad =
Σ(TaskWeight × TimeFactor × ComplexityFactor) / Capacity

Where:

- `TaskWeight` — base business importance coefficient
- `TimeFactor` — actual time / planned time ratio
- `ComplexityFactor` — relative difficulty multiplier
- `Capacity` — available productive capacity (FTE-adjusted hours)

---

### 3.2 Department Load

Two supported aggregation strategies:

**Average Load Model**
DepartmentLoad = Σ(EmployeeLoad) / EmployeeCount

**Capacity-Normalized Model**
DepartmentLoad = Σ(WeightedTasks) / Σ(DepartmentCapacity)

---

### 3.3 Capacity

Capacity represents the available productive bandwidth of an employee and may depend on:

- FTE value
- Contract type
- Leave / sick days
- Internal efficiency coefficient
- Organizational policies

---

## 4. Architectural Positioning

The Load Aggregation Service operates as an isolated domain service within a distributed system.

### High-Level Flow

Task System / CRM / ERP
↓
Event Bus or API
↓
Load Aggregation Service
↓
Read API
↓
Dashboard / Allocation Engine / Analytics

The service consumes task and capacity data, performs calculations, and exposes normalized metrics.

---

## 5. MVP Architecture

### 5.1 Components

1. API Layer
   - REST or GraphQL
   - Read-only exposure of calculated models

2. Calculation Engine
   - Core business logic
   - Formula execution
   - Normalization logic

3. Aggregation Module
   - Employee-level grouping
   - Department-level grouping
   - Snapshot building

4. Persistence Layer
   - Task metadata
   - Capacity metadata
   - Load snapshots

---

### 5.2 Simplified Data Model

#### Employee

- id
- departmentId
- capacity
- employmentType
- status

#### Task

- id
- employeeId
- departmentId
- weight
- complexity
- plannedTime
- actualTime
- status

#### LoadSnapshot

- entityType (employee | department)
- entityId
- loadValue
- timestamp

---

## 6. Calculation Logic (MVP)

### 6.1 Individual Load Index

LoadIndex = TotalWeightedWork / AvailableCapacity

Interpretation:

| Load Index | Meaning     |
| ---------- | ----------- |
| < 0.7      | Underloaded |
| 0.7 – 1.0  | Balanced    |
| 1.0 – 1.2  | High Load   |
| > 1.2      | Overloaded  |

---

### 6.2 Normalization

To prevent extreme outliers:
NormalizedLoad = min(LoadIndex, 1.5)

This ensures dashboard stability and prevents skewed visualizations.

---

## 7. API Design (MVP)

### GET /employees/{id}/load

Returns:

- current load index
- breakdown by tasks
- capacity details
- overload status

---

### GET /departments/{id}/load

Returns:

- aggregated load
- employee distribution
- overload ratio
- load variance indicator

---

## 8. Performance & Scalability Assumptions

### MVP Constraints

- < 10,000 employees
- < 1,000,000 tasks
- Calculation strategies:
  - Event-triggered recalculation
  - Scheduled batch recalculation

---

### Future Scalability Options

- Event-driven recalculation pipeline
- Worker-based calculation engine
- CQRS separation
- Read-model caching
- Horizontal scaling
- Snapshot partitioning
- Streaming recalculation

---

## 9. Observability Requirements

The service must expose:

- Calculation duration
- Recalculation frequency
- Average load index
- Percentage of overloaded employees
- Error rate

Monitoring integration should support:

- Alerting thresholds
- Metric export
- Historical trend analysis

---

## 10. Risks & Mitigation

| Risk                       | Description                  | Mitigation                |
| -------------------------- | ---------------------------- | ------------------------- |
| Incorrect task weights     | Skewed workload distribution | Configurable weight model |
| Stale capacity data        | Inaccurate index             | HR synchronization policy |
| Large batch recalculations | Performance degradation      | Incremental updates       |
| Edge-case overload spikes  | Misleading dashboards        | Normalization cap         |

---

## 11. Extension Points

This service is intentionally designed for extensibility.

### Planned Evolution Directions

- Predictive ML-based load modeling
- Automatic redistribution engine
- SLA monitoring
- Priority-aware task balancing
- Real-time recalculation
- Cross-department optimization
- Workforce planning module
- Financial capacity modeling
- Heatmap visualization engine
- Multi-entity aggregation (projects, regions)

---

## 12. Design Principles

- Isolated domain logic
- Deterministic calculation model
- Configurable coefficients
- Clear separation of write vs read responsibilities
- Horizontal scalability
- Forward-compatible architecture

---

## 13. Conclusion

The Load Aggregation Service represents the analytical nucleus of the broader resource management ecosystem.

It establishes:

- A unified definition of workload
- A consistent normalization standard
- A reliable data source for allocation decisions
- A scalable foundation for future automation

The MVP delivers a minimal yet strategically positioned service that can evolve without architectural rewrites.

---

┌─────────────┐
│ Employees │
└─────────────┘
│
▼
┌─────────────┐
│ Processes │
└─────────────┘
│
▼
┌─────────────────────┐
│ Load Aggregation │
│ Engine (MVP) │
└─────────────────────┘
│
▼
┌─────────────┐
│ API / Dashboard │
└─────────────┘

EmployeeLoad = Σ(resourceUnits of completed processes) / capacity
Quantity:
DepartmentLoad = Σ(EmployeeLoad for all employees in department) / # employees
&
Quality:
DepartmentLoad = Σ(resourceUnits of department) / Σ(capacity of employees)

========================================

# Load Aggregation MVP

## Цель

Минимальный сервис для оценки:

- трудоспособности отдельного сотрудника;
- суммарной нагрузки департамента;
- ресурсоёмкости процессов;
- выявления перегрузки сотрудников и департаментов.

Позволяет выявить, кто перегружен и насколько объективна нагрузка, без прогнозов и HR-корректировок.

---

## 1. Таблица `employees` (сотрудники)

| Поле                 | Тип    | Обязательность | Описание                                                     |
| -------------------- | ------ | -------------- | ------------------------------------------------------------ |
| id                   | UUID   | Обязательное   | Уникальный идентификатор сотрудника                          |
| name                 | string | Обязательное   | Имя сотрудника                                               |
| departmentId         | UUID   | Обязательное   | Идентификатор департамента                                   |
| capacity             | number | Обязательное   | Трудоспособность (максимум ресурсов/смена)                   |
| role                 | string | Обязательное   | Должность или грейд                                          |
| status               | enum   | Обязательное   | active / inactive                                            |
| employmentType       | enum   | Опциональное   | full-time / part-time / contractor                           |
| joinDate             | date   | Опциональное   | Дата начала работы                                           |
| leaveDate            | date   | Опциональное   | Дата ухода/отпуска                                           |
| historicalThroughput | number | Опциональное   | Средняя производительность за прошлый период                 |
| gender               | enum   | Опциональное   | Для статистики (не используется в расчётах трудоспособности) |
| notes                | string | Опциональное   | Любые дополнительные сведения                                |

**Комментарии:**

- Capacity — основа расчёта нагрузки.
- Опциональные поля позволяют в будущем подключать опросы, HR-данные, медицинские допуски.

---

## 2. Таблица `processes` (процессы / задачи)

| Поле          | Тип      | Обязательность | Описание                                           |
| ------------- | -------- | -------------- | -------------------------------------------------- |
| id            | UUID     | Обязательное   | Уникальный идентификатор процесса                  |
| employeeId    | UUID     | Обязательное   | Исполнитель процесса                               |
| departmentId  | UUID     | Обязательное   | Департамент, к которому относится процесс          |
| resourceUnits | number   | Обязательное   | Ресурсоёмкость процесса (часы, условные единицы)   |
| completed     | boolean  | Обязательное   | Статус завершения                                  |
| timestamp     | datetime | Обязательное   | Дата и время выполнения процесса                   |
| processType   | string   | Опциональное   | Категория или тип процесса                         |
| complexity    | number   | Опциональное   | Сложность / вес процесса для будущих корректировок |
| priority      | number   | Опциональное   | Приоритет процесса                                 |
| notes         | string   | Опциональное   | Дополнительные сведения                            |

**Комментарии:**

- resourceUnits — ключевой показатель для расчёта нагрузки.
- Опциональные поля позволяют подключать будущие коэффициенты, приоритеты, категорию задачи.

---

## 3. Основная логика расчёта

### 3.1 Индивидуальная нагрузка сотрудника

EmployeeLoad = Σ(resourceUnits of completed processes) / capacity

| Load Index | Meaning     |
| ---------- | ----------- |
| < 0.7      | Underloaded |
| 0.7 – 1.0  | Balanced    |
| 1.0 – 1.2  | High Load   |
| > 1.2      | Overloaded  |

### 3.2 Суммарная нагрузка департамента

DepartmentLoad = Σ(EmployeeLoad for all employees in department) / # employees
или через capacity:
DepartmentLoad = Σ(resourceUnits of department) / Σ(capacity of employees)

---

## 4. MVP API

### GET /employees/{id}/load

Возвращает:

- Текущую нагрузку сотрудника (EmployeeLoad)
- Список процессов и их resourceUnits
- Capacity

### GET /departments/{id}/load

Возвращает:

- Суммарную нагрузку департамента (DepartmentLoad)
- Распределение нагрузки по сотрудникам
- Список перегруженных / недогруженных сотрудников

---

## 5. Архитектура MVP

┌─────────────┐
│ Employees │
└─────────────┘
│
▼
┌─────────────┐
│ Processes │
└─────────────┘
│
▼
┌─────────────────────┐
│ Load Aggregation │
│ Engine (MVP core) │
└─────────────────────┘
│
▼
┌─────────────┐
│ API / Dashboard │
└─────────────┘

- Пока нет event-driven слоя и кэшей — MVP пересчитывает нагрузку на запрос или по расписанию.
- Read-model и snapshot таблицы можно добавить в следующей итерации для ускорения.

---

## 6. Точки расширения (будущее)

- Исторические показатели сотрудников и департаментов
- Опросы коллег / self-assessment
- Файлы по культуре и структуре компании
- Прогнозирование нагрузки
- Автоматическое перераспределение задач
- KPI и SLA аналитика
- ML модели прогнозирования перегрузки

---

## 7. Принципы MVP

- Все расчёты основаны на **фактических данных** (resourceUnits и capacity)
- Объективность достигается через **индивидуальную трудоспособность**
- Простая, прозрачная и воспроизводимая модель
- Готовность к расширению через опциональные поля и дополнительные таблицы

---

type Employee = {
// 🔹 Обязательные поля
id: string; // UUID
name: string; // Имя
departmentId: string; // Идентификатор департамента
capacity: number; // Трудоспособность (единицы/день)
role: string; // Должность или грейд
status: "active" | "terminated"; // Активный или уволен

// 🔹 Опциональные поля
grade?: string; // Грейд / уровень сотрудника
employmentType?: "full-time" | "part-time" | "contractor";
joinDate?: string; // Дата начала работы
leaveDate?: string; // Дата увольнения
vacation?: { // Отпуск
start: string;
end: string;
}[];
historicalThroughput?: number; // Средняя производительность
notes?: string; // Комментарии / дополнительные сведения
};

type Process = {
// 🔹 Обязательные поля
id: string; // UUID
name: string; // Название процесса
departmentId: string; // Департамент
complexity: number; // Сложность процесса
priority: number; // Приоритет процесса
grade: string; // Грейд, для которого предназначен процесс

// 🔹 Опциональные поля
averagePerMonth?: number; // Среднее количество таких процессов в месяц
employeeIds?: string[]; // Исполнители (можно указать массив)
notes?: string; // Дополнительные сведения
};
