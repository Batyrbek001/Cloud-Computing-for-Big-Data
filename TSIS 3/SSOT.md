# Phase 1: System Specification (SSOT) — CFO Bot (Almaty RE Price Predictor)

## 1. Scope & Model Tiers (Inference Engines)
The bot calculates the operational costs of ML models trained on the Almaty real estate market dataset. Pricing is determined by algorithm complexity (Multiplier) and a base rate per million inference calls (Base Rate).

| Model Name                        | Multiplier (M) | Base Rate (per 1M tokens) |
|-----------------------------------|:--------------:|:-------------------------:|
| Linear Baseline (Stats)           | 0.5x           | $1.00                     |
| XGBoost Regressor (Standard)      | 1.0x           | $5.00                     |
| Random Forest Ensemble            | 1.2x           | $6.50                     |
| Neural Network v2 (Deep Learning) | 2.5x           | $12.00                    |
| Custom Transformer API (Premium)  | 4.0x           | $25.00                    |

## 2. Infrastructure Components (Cloud & DB Tiers)
Users select an API deployment strategy. Costs include a fixed hosting price ($H$) and the maintenance of the Almaty Property Database.
    - **Serverless (Google Cloud Run / Firebase):**
        * *Free Tier*: $0.00 (до 100к запросов)
        * *Pay-as-you-go*: $0.000024 за GB-сек + $0.40 за 1М вызовов.
    - **Local VPS (PS Cloud, Kazakhstan):**
        * *Standard*: ~3,500 ₸ ($7.80/мес) — фиксировано.
    - **Azure / AWS Instance:**
        * *B1s Standard*: $7.50/мес — фиксировано.
    - **Database Tiers (PostgreSQL for Almaty Data):**
        * *SME Tier*: $15.00/мес (до 50,000 записей о квартирах).
        * *Enterprise Tier*: $150.00/мес (полная история рынка с 2015 года).

## 3. Mathematical Model & Pricing Logic
**Monthly Cost Formula ($C_{mo}$):**
$$C_{mo} = \left( \frac{Req}{10^6} \times Rate \times M \right) + H + DB_{tier} + (BW \times P_{bw})$$

    * **Req**: Количество запросов на оценку недвижимости в месяц.
    * **M**: Коэффициент сложности модели (из таблицы выше).
    * **H**: Фиксированная цена хостинга.
    * **DB_tier**: Стоимость выбранного уровня базы данных.
    * **BW**: Трафик (Bandwidth). Первые 10GB бесплатно, далее $0.08/GB.

**Long-term Projection (n months):**
Расчет совокупной стоимости владения (TCO) с учетом ежемесячного роста базы объектов недвижимости ($g$):
$$Total_n = \sum_{i=1}^{n} C_{mo} \times (1 + g)^{i-1}$$

## 4. Architectural Constraints
    * **Tech Stack**: React 18+ (Vite), Tailwind CSS.
    * **Deployment**: Firebase Hosting (согласно требованиям TSIS).
    * **State Management**: Чистый useState для реактивности калькулятора.
    * **Export**: Библиотека jsPDF для генерации "Strategy Report".

## 5. UI/UX Requirements (Almaty Tech Aesthetic)
    * **Palette**: Monochrome + Accent Blue (профессиональный стиль для финтех-сектора: #FFFFFF, #F5F5F7, #007AFF).
    * **Typography**: San Francisco / Inter.
    * **Layout**:
        * **Top**: Выбор ML-модели и уровня БД (Cards/Select).
        * **Center**: Слайдер количества запросов (от 1к до 10М) и ползунок роста данных ($g$).
        * **Bottom**: Крупный блок "Monthly Burn" и кнопка "Generate Strategy PDF".
    * **Interactions**: Мгновенный пересчет при движении слайдера (Zero latency).
