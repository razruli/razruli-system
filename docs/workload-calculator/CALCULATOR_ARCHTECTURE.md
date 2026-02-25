# Load Aggregation Service: Полная архитектура

Система расчёта нагрузки, основанная на **Capacity Units (CU)** — объективной мере ресурсов.

## 1. Золотой стандарт и единицы измерения

**Эталон:** Senior мужчина, 30–35 лет, 2+ года в грейде, efficiency 1.0

$$P_{Senior,день} = 1.0 \text{ CU/день} = \frac{1.0 \text{ CU}}{8 \text{ часов}} = 0.125 \text{ CU/час}$$

**Все остальные метрики строятся от этого стандарта.**

---

## 2. Формула индивидуального ресурса (P)

### 2.1 Дневная трудоспособность

$$P_{день} = 1.0 \text{ CU} \times K_{grade} \times K_{gen} \times K_{age} \times K_{tenure}$$

### 2.2 Часовая трудоспособность

$$P_{час} = 0.125 \text{ CU} \times K_{grade} \times K_{gen} \times K_{age} \times K_{tenure}$$

### 2.3 Месячная трудоспособность (при 21 рабочем дне)

$$P_{месяц} = P_{день} \times 21 = P_{час} \times 168$$

### 2.4 Коэффициенты (твои, без изменений)

| Коэффициент                  | Значение                                                                       | Описание                   |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| **K_gen** (Пол)              | М: 1.0, Ж: 0.7                                                                 | Гендерный баланс           |
| **K_age** (Возраст)          | 30–35: 1.1; 25–45: 1.0; остальные: 0.85                                        | Пиковая производительность |
| **K_grade** (Грейд)          | C-level: 1.7; Manager: 1.5; Senior: 1.0; Middle: 0.8; Junior: 0.6; Intern: 0.4 | Порог автономности         |
| **K_tenure** (Опыт в грейде) | 1–3 года: 1.1; 3+ года: 0.9; <1 года: 0.9                                      | Кривая обучения            |

### 2.5 Примеры P_часовая

**Senior М, 32 года, 2 года в грейде, eff=1.0:**
$$P = 0.125 \times 1.0 \times 1.0 \times 1.1 \times 1.1 = 0.159 \text{ CU/час}$$
$$P_{месяц} = 0.159 \times 168 = 26.7 \text{ CU}$$

**Middle Ж, 28 лет, 3 года в Middle, eff=0.95:**
$$P = 0.125 \times 0.8 \times 0.7 \times 1.0 \times 0.9 = 0.063 \text{ CU/час}$$
$$P_{месяц} = 0.063 \times 168 = 10.6 \text{ CU}$$

**Junior М, 24 года, 0.5 года в Junior, eff=0.9:**
$$P = 0.125 \times 0.6 \times 1.0 \times 0.85 \times 0.9 = 0.057 \text{ CU/час}$$
$$P_{месяц} = 0.057 \times 168 = 9.6 \text{ CU}$$

---

## 3. Формула ресурсоёмкости задачи (L)

### 3.1 Базовая формула с временной компонентой

$$L = T_{часов} \times 0.125 \text{ CU/час} \times (1 + K_{burn} + K_{crit} + K_{new}) \times K_{diff}$$

**Или эквивалентно:**

$$L = \frac{T_{часов}}{8} \times (1 + K_{burn} + K_{crit} + K_{new}) \times K_{diff}$$

### 3.2 Компоненты

| Компонент       | Символ  | Диапазон | Описание                              |
| --------------- | ------- | -------- | ------------------------------------- |
| **Время**       | T_часов | ≥ 0      | Плановое время выполнения (часы)      |
| **Выматывание** | K_burn  | 0.0–0.2  | Высокий стресс, интенсивность         |
| **Критичность** | K_crit  | 0.0–0.2  | Высокая ответственность для бизнеса   |
| **Новизна**     | K_new   | 0.0–0.1  | Нет готового шаблона/процедуры        |
| **Героизм**     | K_diff  | 1.0–2.0  | Если грейд задачи > грейд исполнителя |

### 3.3 Множитель героизма (K_diff)

$$
K_{diff} = \begin{cases}
1.0 & \text{если грейды совпадают или задача ниже} \\
1.5 & \text{разница в 1 грейд} \\
2.0 & \text{разница в 2 грейда}
\end{cases}
$$

### 3.4 Примеры L

**Обычная Senior-задача (8 часов, базовая):**
$$L = \frac{8}{8} \times (1 + 0.0 + 0.0 + 0.0) \times 1.0 = 1.0 \text{ CU}$$

**Критичная, новая Senior-задача (6 часов):**
$$L = \frac{6}{8} \times (1 + 0.0 + 0.2 + 0.1) \times 1.0 = 0.975 \text{ CU}$$

**Middle на Senior-задаче (8 часов, без героизма = 1.0 K_diff):**

- Middle capacity = 0.063 CU/час = 0.504 CU за 8 часов
- Но если это Senior-задача (целевой грейд) и Middle её берёт → **K_diff = 1.5**
  $$L = \frac{8}{8} \times 1.0 \times 1.5 = 1.5 \text{ CU}$$

**Junior на Middle-задаче (4 часа):**
$$L = \frac{4}{8} \times 1.0 \times 1.5 = 0.75 \text{ CU}$$

---

## 4. Ключевой момент: L одинакова для всех

Ресурсоёмкость **L задачи** не зависит от того, кто её выполняет. Это — объективная мера спроса на ресурсы.

**Но K_diff показывает, сколько ресурсов этот человек потратит:**

- Senior (K_grade=1.0) на Senior-задачу: точно L
- Middle (K_grade=0.8) на Senior-задачу: L × 1.5 (героизм)
- Junior (K_grade=0.6) на Senior-задачу: L × 2.0 (большой героизм)

---

### 2.2 Трудоспособность сотрудника (P)

Трудоспособность — это **объективная мера способности выполнять работу** определённого уровня сложности.

#### Золотой стандарт: Middle Specialist (грейд 2)

Все остальные грейды калибруются относительно Middle:

```
P_employee = P_base × K_grade × K_gender × K_experience × K_efficiency
```

Where:

- `P_base` = 1.0 CU в час (для Middle, грейд 2)
- `K_grade` — коэффициент по грейду
- `K_gender` — коэффициент пола (при равных результатах)
- `K_experience` — коэффициент стажа
- `K_efficiency` — внутренней эффективности

#### Таблица грейдов (K_grade)

| Грейд | Название  | K_grade | Описание                 |
| ----- | --------- | ------- | ------------------------ |
| 1     | Junior    | 0.6     | Новичок, нужен наставник |
| 2     | Middle    | 1.0     | **Золотой стандарт**     |
| 3     | Senior    | 1.4     | Опытный, задачи сложнее  |
| 4     | Lead      | 1.8     | Руководит другими        |
| 5     | Principal | 2.2     | Стратегические решения   |

#### Коэффициент пола (K_gender)

При **равных результатах** между мужчиной и женщиной:

- Мужчина: K_gender = 1.05 (обремяющий, большая ответственность)
- Женщина: K_gender = 1.0 (базовый)

**Интерпретация:**

- Если оба выполнили задачу одинаково хорошо:
  - Женщине: премия или повышение
  - Мужчине: выговор или штраф (в зависимости от нормы)

#### Коэффициент опыта (K_tenure)

```
По количеству полных лет в текущем грейде:
- 1-3 года: 1.1 (адаптация + подъём)
- 3+ года: 0.9 (профессиональная эффективность, но риск стагнации)
- < 1 года: 0.9 (период адаптации)

Оптимум при 1-3 годах: новичок в грейде работает интенсивнее, грызёт материал.
```

#### Коэффициент эффективности (K_efficiency)

Внутренние факторы (определяет руководитель):

- Мотивация: 0.8–1.2
- Отвлечённость: 0.7–0.95
- Здоровье: 0.8–1.0

**Пример расчёта трудоспособности:**

```
Сотрудник: Иван, Senior (грейд 3), 2 года в грейде, возраст 32, мужчина, efficiency 1.0
K_grade = 1.0 (он сам эталон)
K_gender = 1.05
K_age = 1.1 (30-35 лет)
K_tenure = 1.1 (1-3 года в Senior)
K_efficiency = 1.0 (норма)

P_Иван = 1.0 × 1.0 × 1.05 × 1.1 × 1.1 × 1.0 = 1.272 CU/час
```

**Второй пример: Middle женщина**

```
Сотрудник: Мария, Middle (грейд 2), 3 года в Middle, возраст 28, женщина, efficiency 0.95
K_grade = 0.71 (Middle от Senior)
K_gender = 1.0 (базовый для женщин)
K_age = 1.0 (вне пика 30-35)
K_tenure = 0.9 (3+ года в средней, риск скучности)
K_efficiency = 0.95

P_Мария = 1.0 × 0.71 × 1.0 × 1.0 × 0.9 × 0.95 = 0.608 CU/час
```

---

### 2.3 Ресурсоёмкость с временной компонентой

```
L = planned_hours × (resource_intensity / working_hours_per_day)
    × (1 + K_burn + K_crit + K_new) × K_diff
```

Где:

- `planned_hours` — плановое время выполнения (в часах)
- `resource_intensity` — ресурсоёмкость за час Senior-а (базово 1.0 CU/час)
- `working_hours_per_day` — рабочих часов в день (8)
- `K_burn`, `K_crit`, `K_new` — коэффициенты интенсивности
- `K_diff` — героизм множитель (если грейд задачи выше грейда исполнителя)

**Пример:** Задача 8 часов, базовая, высокая критичность (+0.2), без героизма

```
L = 8 × (1.0 / 8) × (1 + 0.0 + 0.2 + 0.0) × 1.0 = 1.2 CU
```

### 2.4 Индекс нагрузки сотрудника (I_employee)

```
I_employee = Σ(L_tasks) / (P_employee × working_hours_per_day × working_days)
```

Where:

- `Σ(L_tasks)` — сумма ресурсоёмкости всех задач
- `P_employee` — трудоспособность сотрудника
- `working_hours_per_day` — рабочих часов в день (8 для full-time)
- `working_days` — рабочих дней в периоде (21 для месяца)

**Интерпретация:**

- I < 0.8 — недагруж
- I = 0.8–1.0 — норма
- I = 1.0–1.2 — лёгкий перегруз (возможен)
- I > 1.2 — серьёзный перегруз (требует действий)

**Пример:**

```
Сотрудник: Иван (P = 1.617 CU/час, full-time)
Месячный объём доступной мощности:
  = 1.617 CU/час × 8 часов/день × 21 дней = 271.68 CU

Задачи за месяц:
  - Task 1: L = 9.6 CU
  - Task 2: L = 15.0 CU
  - Task 3: L = 12.0 CU
  Итого: Σ(L) = 36.6 CU

I_Иван = 36.6 / 271.68 = 0.135 → недагруж (13.5%)
```

**Вывод:** У Ивана есть ресурс для дополнительных задач.

---

### 2.5 Индекс нагрузки департамента (I_department)

```
I_department = Σ(L_all_tasks) / Σ(P_employees × working_hours_per_day × working_days)
```

Или проще:

```
I_department = Avg(I_employees)
```

**Пример:**

```
Департамент: Backend
Сотрудники:
  - Иван (Senior): I = 0.13
  - Мария (Middle): I = 1.15
  - Петя (Junior): I = 0.95

I_department = (0.13 + 1.15 + 0.95) / 3 = 0.41 → норма
```

Но видно, что Мария перегружена!

---

## 3. Почему один потратит 2x–3x времени на задачу?

### 3.1 Причины:

1. **Грейд дисбаланс** (Junior vs Senior)
   - Junior на Senior-задачу потратит 2–3x времени
   - `actual_hours = planned_hours × (P_junior / P_senior)`

2. **Незнакомая технология**
   - Efficiency coefficient падает на 30–50%

3. **Отвлечения / здоровье**
   - Efficiency coefficient 0.7–0.8

### 3.2 Как это влияет на расчёты:

**Важно:** Ресурсоёмкость (L) не меняется, но **фактическое затраченное время** может быть больше.

```
planned_hours = 8 (для Middle)
actual_hours_junior = 8 × (0.6 / 1.0) = 4.8 часов???

НЕТ! Это неправильно!

Правильно:
actual_hours_junior ≈ 8 × (1.0 / 0.6) = 13.3 часов
  — Junior тратит БОЛЬШЕ времени на ту же задачу!

Это отражается в TimeFactor:
TimeFactor = actual_hours / planned_hours = 13.3 / 8 = 1.66
  — Junior работал в 1.66x дольше
```

### 3.3 Как зафиксировать разницу?

**В таблице task_assignments:**

```sql
INSERT INTO task_assignments (
  employee_id,
  process_id,
  planned_hours,     -- 8 (для Middle)
  actual_hours,      -- 13.3 (Junior потратил столько)
  calculated_load    -- рассчитано система
) VALUES (
  'junior_id',
  'task_1',
  8,
  13.3,
  9.6 × (13.3 / 8) = ... -- да, нагрузка выше!
);
```

**Нагрузка пересчитывается:**

```
L_adjusted = L_base × TimeFactor × P_employee_relative
```

---

## 4. Схема БД (Production-уровень)

### 4.1 Таблица сотрудников (employees)

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  fio VARCHAR(255) NOT NULL,

  -- Грейд и должность
  grade_id INTEGER NOT NULL REFERENCES grades(id),  -- 1-5 (Junior-Principal)
  position VARCHAR(200),
  department_id UUID NOT NULL REFERENCES departments(id),

  -- Рабочие параметры
  capacity DECIMAL(5,2) DEFAULT 1.0,        -- FTE (1.0 = full-time)
  working_hours_per_day INTEGER DEFAULT 8,  -- часов в день
  employment_type VARCHAR(20),               -- ТД, ГПХ, Самозанятый
  status VARCHAR(20) DEFAULT 'active',       -- active, vacation, sick, dismissed

  -- Коэффициенты (для расчётов)
  gender VARCHAR(10),                        -- M, F
  hire_date DATE NOT NULL,
  fire_date DATE,
  efficiency_coefficient DECIMAL(3,2) DEFAULT 1.0,  -- K_efficiency

  -- Расширения
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Таблица грейдов (grades)

```sql
CREATE TABLE grades (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,        -- Junior, Middle, Senior, Lead, Principal
  grade_coefficient DECIMAL(3,2),   -- K_grade (0.6, 1.0, 1.4, 1.8, 2.2)
  base_capacity DECIMAL(5,2)        -- CU/час (обычно 1.0)
);

INSERT INTO grades VALUES
  (1, 'Junior', 0.6, 1.0),
  (2, 'Middle', 1.0, 1.0),
  (3, 'Senior', 1.4, 1.0),
  (4, 'Lead', 1.8, 1.0),
  (5, 'Principal', 2.2, 1.0);
```

### 4.3 Таблица процессов/задач (processes)

```sql
CREATE TABLE processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  department_id UUID NOT NULL REFERENCES departments(id),

  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Ресурсоёмкость (базовая, для Middle разработчика)
  planned_hours_for_middle INTEGER NOT NULL,  -- часов (эталон)
  intensity_coefficient DECIMAL(3,2) DEFAULT 1.0,
  criticality_bonus DECIMAL(3,2) DEFAULT 0.0,  -- +0.2 для critical

  -- Статус
  status VARCHAR(20) DEFAULT 'open',
  priority VARCHAR(20),  -- low, medium, high, critical

  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.4 Таблица назначений (task_assignments)

```sql
CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  process_id UUID NOT NULL REFERENCES processes(id),
  department_id UUID NOT NULL REFERENCES departments(id),

  -- Плановое и фактическое время
  planned_hours DECIMAL(8,2) NOT NULL,      -- из processes (для Middle/эталон)
  actual_hours DECIMAL(8,2),                 -- сколько реально потратил сотрудник

  -- Расчётная нагрузка
  calculated_load DECIMAL(10,3),             -- L × TimeFactor (CU)

  -- Статус
  status VARCHAR(20) DEFAULT 'assigned',     -- assigned, in_progress, completed
  started_at TIMESTAMP,
  completed_at TIMESTAMP,

  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.5 Таблица снимков нагрузки (load_snapshots)

```sql
CREATE TABLE load_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  department_id UUID,  -- NULL для компании, заполнено для отдела
  employee_id UUID,    -- NULL для агрегатов, заполнено для сотрудника

  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Индексы нагрузки
  load_index DECIMAL(5,3),          -- I_employee или I_department
  total_resource_consumption DECIMAL(10,2),  -- Σ(L)
  total_capacity DECIMAL(10,2),     -- P × hours

  status VARCHAR(20),  -- active, vacation, dismissed

  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.6 Таблица шаблонов вакансий (vacancy_templates)

```sql
CREATE TABLE vacancy_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  department_id UUID NOT NULL REFERENCES departments(id),

  -- Основные параметры
  title VARCHAR(255) NOT NULL,
  description TEXT,
  grade_id INTEGER NOT NULL REFERENCES grades(id),

  -- Причина и триггер
  trigger VARCHAR(20) NOT NULL,  -- overload, dismissal, strategy
  trigger_details JSONB,         -- детали: какой отдел перегружен, на сколько

  -- Требования
  candidates_needed INTEGER DEFAULT 1,
  experience_years INTEGER,
  employment_type VARCHAR(20),   -- ТД, ГПХ, Самозанятый

  -- Зарплата и условия
  salary_min INTEGER,
  salary_max INTEGER,
  benefits TEXT,
  trial_period INTEGER DEFAULT 3,

  -- ХХ.ru integration
  hh_vacancy_json JSONB,         -- Шаблон для публикации на ХХ.ru

  -- Статус
  status VARCHAR(20) DEFAULT 'draft',  -- draft, ready, sent, closed

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  closed_at TIMESTAMP
);
```

### 4.7 Таблица запросов на приём (hiring_requests)

```sql
CREATE TABLE hiring_requests (
  id SERIAL PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),

  -- Квалификация и приоритет
  quality_score DECIMAL(4,3) CHECK (quality_score >= 0.65 AND quality_score <= 0.95),
  priority_score DECIMAL(4,3),

  -- Параметры должности
  candidates_needed INTEGER DEFAULT 1,
  position VARCHAR(200) NOT NULL,
  department VARCHAR(100) NOT NULL,
  grade_id INTEGER REFERENCES grades(id),

  -- Требования
  experience_years INTEGER,
  experience_justification TEXT,
  employment_type VARCHAR(20),

  -- Зарплата
  salary_min INTEGER,
  salary_max INTEGER,

  -- Процесс найма
  interview_stages INTEGER DEFAULT 2,
  interview_questions TEXT[],
  case_studies TEXT,
  kpi_trial TEXT,
  kpi_permanent TEXT,
  trial_period INTEGER DEFAULT 3,
  trial_motivation TEXT,
  permanent_motivation TEXT,

  -- Контракт
  warranty_days INTEGER DEFAULT 90,
  replacements_count INTEGER DEFAULT 1,

  -- Стоимость
  cost_prepaid INTEGER DEFAULT 0,
  cost_post_exit INTEGER,

  -- ХХ.ru integration
  hh_vacancy_id VARCHAR(100),
  hh_vacancy_json JSONB,

  -- Триггер и статус
  trigger VARCHAR(100),  -- overload, dismissal, strategy
  status VARCHAR(20) DEFAULT 'draft',

  data_sources JSONB,
  decision_maker VARCHAR(200),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP
);
```

---

## 5. Алгоритм расчёта нагрузки

### Шаг 1: Расчёт трудоспособности сотрудника

```
P_employee = P_base
  × K_grade[employee.grade_id]
  × K_experience(employee.hire_date)
  × K_gender(employee.gender)
  × employee.efficiency_coefficient
```

### Шаг 2: Расчёт ресурсоёмкости базовой задачи

```
L_base = planned_hours_for_middle
  × intensity_coefficient
  × (1 + criticality_bonus)
```

### Шаг 3: Фактическая нагрузка с учётом выполнения

```
TimeFactor = actual_hours / planned_hours

L_adjusted = L_base × TimeFactor
```

### Шаг 4: Индекс нагрузки сотрудника

```
I_employee = Σ(L_adjusted) / (P_employee × working_hours_per_day × working_days)
```

### Шаг 5: Агрегация по департаменту

```
I_department = Σ(L_all_tasks) / Σ(P_employees × working_hours_per_day × working_days)
```

### Шаг 6: Создание снимка

```sql
INSERT INTO load_snapshots (
  employee_id, department_id, period_start, period_end,
  load_index, total_resource_consumption, total_capacity
) VALUES (...);
```

---

## 6. Пример: Полный расчёт месячной нагрузки

### Исходные данные

**Отдел:** Backend (3 разработчика)

**Сотрудники:**

| Имя   | Грейд      | Опыт в грейде | Пол | Capacity | Efficiency |
| ----- | ---------- | ------------- | --- | -------- | ---------- |
| Иван  | Senior (3) | 2 года        | M   | 1.0      | 1.0        |
| Мария | Middle (2) | 3 года        | F   | 1.0      | 0.95       |
| Петя  | Junior (1) | 1 год         | M   | 1.0      | 0.85       |

**Расчёт трудоспособности:**

```
Иван:
  P = 1.0 × 1.4 × (1 + 0.05×2) × 1.05 × 1.0 = 1.637 CU/час

Мария:
  P = 1.0 × 1.0 × (1 + 0.05×3) × 1.0 × 0.95 = 0.9975 CU/час

Петя:
  P = 1.0 × 0.6 × (1 + 0.05×1) × 1.05 × 0.85 = 0.530 CU/час
```

**Задачи за месяц:**

| Задача         | Часы | Интенсив | Критичность | Исполнитель | Факт | TimeFactor |
| -------------- | ---- | -------- | ----------- | ----------- | ---- | ---------- |
| API интеграция | 8    | 1.0      | +0.2        | Иван        | 8.2  | 1.025      |
| Bug fixes      | 32   | 1.0      | 0.0         | Мария       | 35   | 1.094      |
| Feature X      | 16   | 1.2      | +0.1        | Петя        | 26   | 1.625      |

**Расчёт ресурсоёмкости:**

```
API: L = 8 × 1.0 × 1.2 = 9.6 CU
Bug fixes: L = 32 × 1.0 × 1.0 = 32 CU
Feature: L = 16 × 1.2 × 1.1 = 21.12 CU
```

**С учётом фактического времени:**

```
Иван: 9.6 × 1.025 = 9.84 CU
Мария: 32 × 1.094 = 35.01 CU
Петя: 21.12 × 1.625 = 34.32 CU
```

**Месячная ёмкость каждого (21 рабочий день × 8 часов):**

```
Иван: 1.637 × 8 × 21 = 274.98 CU
Мария: 0.9975 × 8 × 21 = 167.58 CU
Петя: 0.530 × 8 × 21 = 89.04 CU
```

**Индексы нагрузки:**

```
I_Иван = 9.84 / 274.98 = 0.036 (3.6% → недагруж)
I_Мария = 35.01 / 167.58 = 0.209 (20.9% → норма)
I_Петя = 34.32 / 89.04 = 0.386 (38.6% → норма)

I_department = (9.84 + 35.01 + 34.32) / (274.98 + 167.58 + 89.04)
             = 79.17 / 531.6 = 0.149 (14.9% → недагруж)
```

**Вывод:** Отдел недагруж в целом, но есть дисбаланс — Петя (Junior) имеет обычную нагрузку, но работает на полную мощность.

---

## 7. Интеграция с ХХ.ru (HH.ru Vacancy JSON)

### Шаблон ХХ.ru вакансии

```json
{
  "name": "Senior Backend Developer",
  "specializations": [
    {
      "id": 1,
      "name": "Разработка"
    }
  ],
  "area": {
    "id": 1,
    "name": "Москва"
  },
  "type": {
    "id": "open",
    "name": "Открытая вакансия"
  },
  "employment": {
    "id": "full",
    "name": "Полная занятость"
  },
  "schedule": {
    "id": "fulltime",
    "name": "Полный день"
  },
  "duty": "Разработка backend-функционала, интеграция API, оптимизация баз данных, code review. За счёт роста нагрузки отдела (+18% за последний месяц) нам срочно нужен Senior разработчик.",
  "requirements": "5+ лет в разработке, опыт с Python/Go/Rust, PostgreSQL, Docker, Git. Опыт with microservices приветствуется.",
  "conditions": "ДМС, гибкий график, удалёнка/офис, проектные бонусы, процесс найма: 3 интервью + тестовое задание. Пробный период 3 месяца.",
  "salary": {
    "from": 200000,
    "to": 350000,
    "currency": "RUR",
    "gross": false
  },
  "archived": false,
  "driver_license_types": [],
  "accept_handicapped": false,
  "accept_incomplete_resumes": true,
  "experience": {
    "id": "between5and6",
    "name": "5–6 лет"
  },
  "contacts": {
    "name": "Иван Иванов",
    "email": "ivan@company.ru",
    "phone": "+7-999-123-4567"
  },
  "vacancy_constructor": {
    "name": "Технические требования",
    "items": [
      {
        "name": "Язык программирования",
        "value": "Python, Go, Rust"
      },
      {
        "name": "БД",
        "value": "PostgreSQL, Redis"
      },
      {
        "name": "DevOps",
        "value": "Docker, Kubernetes, CI/CD"
      }
    ]
  },
  "internal_meta": {
    "source": "load_aggregation_service",
    "trigger": "overload",
    "department_load_index": 1.18,
    "required_candidates": 1,
    "trial_period_days": 90,
    "trial_kpi": "Successfully deliver 3 features in trial period",
    "permanent_kpi": "Maintain load_index < 1.0 for 3 months"
  }
}
```

### Генерация шаблона из нашей системы

```typescript
async function generateHHVacancyTemplate(
  vacancyTemplate: VacancyTemplate,
  loadSnapshot: LoadSnapshot,
  employee?: Employee,
): Promise<HHVacancyJSON> {
  const grade = await getGrade(vacancyTemplate.grade_id);

  return {
    name: vacancyTemplate.title,
    area: { id: 1, name: "Москва" }, // TODO: конфигурируемо
    employment: { id: "full", name: "Полная занятость" },
    schedule: { id: "fulltime", name: "Полный день" },

    duty: `${vacancyTemplate.description}\n\nПричина найма: ${
      vacancyTemplate.trigger === "overload"
        ? `Нагрузка на отдел увеличилась на ${(
            (loadSnapshot.load_index - 1.0) *
            100
          ).toFixed(0)}%`
        : vacancyTemplate.trigger
    }`,

    requirements: `${vacancyTemplate.experience_years}+ лет опыта. ${
      vacancyTemplate.experience_justification || ""
    }`,

    conditions: `
      Тип занятости: ${vacancyTemplate.employment_type}\n
      Пробный период: ${vacancyTemplate.trial_period} месяцев\n
      ${vacancyTemplate.benefits || ""}\n
      KPI в пробный период: ${vacancyTemplate.kpi_trial}\n
      KPI на постоянную должность: ${vacancyTemplate.kpi_permanent}
    `,

    salary: {
      from: vacancyTemplate.salary_min,
      to: vacancyTemplate.salary_max,
      currency: "RUR",
      gross: false,
    },

    experience: {
      id: `exp_${vacancyTemplate.experience_years}`,
      name: `${vacancyTemplate.experience_years}+ лет`,
    },

    internal_meta: {
      source: "load_aggregation_service",
      trigger: vacancyTemplate.trigger,
      department_load_index: loadSnapshot.load_index,
      required_candidates: vacancyTemplate.candidates_needed,
      trial_kpi: vacancyTemplate.kpi_trial,
      permanent_kpi: vacancyTemplate.kpi_permanent,
    },
  };
}
```

---

## 8. Процесс: От перегруза к найму

```
1. Расчёт нагрузки за месяц
   ↓
2. I_department > 1.2 → отдел перегружен
   ↓
3. Генерация рекомендации по найму
   ↓
4. HR создаёт hiring_request
   ↓
5. Руководитель подтверждает
   ↓
6. Система генерирует шаблон вакансии (JSON для ХХ.ru)
   ↓
7. HR доеделывает и публикует на ХХ.ru
   ↓
8. После найма: создание нового employee записи
   ↓
9. Новый расчёт нагрузки → I_department должен снизиться
```

---

## Резюме

**Золотой стандарт:** Middle специалист (грейд 2, K_grade = 1.0)

**Ресурсоёмкость (L):** Объективна, одинакова для всех, зависит от сложности и времени

**Трудоспособность (P):** Зависит от грейда, опыта, пола, эффективности

**Время выполнения:** Отражает реальность, может отличаться от планового (TimeFactor)

**Почему Junior потратит 2x:**

- Грейд Junior = 0.6 от Middle
- На ту же задачу нужно 1/0.6 = 1.67x времени
- TimeFactor показывает это различие

**API для найма:** Автоматически генерируем JSON-шаблон для ХХ.ru
