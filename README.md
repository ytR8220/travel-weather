<p>旅行者の為のお天気アプリ</p>
<h2>Travel Weather</h2>

---

<h3>【URL】</h3>
<p></p>

---

<details>
<summary><h3>テーブル定義書</h3></summary>

PK - Primary Key<br>
FK - Foreign Key<br>
UQ - Unique Key<br>

【cities】
| カラム名 | データ型 | NULL | 制約 | 初期値 | AUTO INCREMENT | INDEX |
|----|----|----|----|----|----|----|
| id | int | NO | PK | - | ◯ | - |
| name | varchar | NO | UQ | - | - | ◯ |
| country_id | int | NO | FK | - | - | ◯ |

【countries】
| カラム名 | データ型 | NULL | 制約 | 初期値 | AUTO INCREMENT | INDEX |
|----|----|----|----|----|----|----|
| id | int | NO | PK | - | ◯ | - |
| name | varchar | NO | UQ | - | - | ◯ |

【to_date_times】
| カラム名 | データ型 | NULL | 制約 | 初期値 | AUTO INCREMENT | INDEX |
|----|----|----|----|----|----|----|
| id | int | NO | PK | - | ◯ | - |
| date_time | datetime | NO | - | - | - | - |

【weathers】
| カラム名 | データ型 | NULL | 制約 | 初期値 | AUTO INCREMENT | INDEX |
|----|----|----|----|----|----|----|
| id | int | NO | PK | - | ◯ | - |
| city_id | int | NO | FK | - | - | ◯ |
| date_time_id | int | NO | FK | - | - | ◯ |
| weather | varchar | NO | - | - | - | - |
| temp | float | NO | - | - | - | - |
| temp_max | float | NO | - | - | - | - |
| temp_min | float | NO | - | - | - | - |
| humidity | int | NO | - | - | - | - |
| description | varchar | NO | - | - | - | - |
| alert | text | YES | - | - | - | - |
| created_at | datetime | NO | - | - | - | - |
| updated_at | datetime | NO | - | - | - | - |

</details>

<details>
<summary><h3>ER図</h3></summary>

![ER図](./documents/er.png)

</details>

<details>
<summary><h3>システム構成図</h3></summary>

![システム構成図](./documents/architecture.png)

</details>
