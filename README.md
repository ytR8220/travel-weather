<p>旅行者の為のお天気アプリ</p>
<h2>Travel Weather</h2>

- 市区町村を入力してボタンを押下（または Enter）する事で、その市区町村の天気を外部 API から取得して表示します。<br>
- 同じ市区町村で、同じ時間帯の天気をすでに取得されている場合、DB から取得します。<br>
- 表示するのは現在、3 時間後、6 時間後、12 時間後の天気と、明日から 5 日後までの天気です。<br>
- 毎時 0 分を過ぎたあとの最初の取得は、外部 API から情報を取得して最新の情報を表示します。<br>
- また、明日から 5 日後の天気については、最終取得時間より 12 時間が経過していた場合、外部 API から最新の情報を取得します。<br>
  <br>

<p>
【課題点】<br>
※現在、外部APIの仕様上、入力時に「市区町村」がない状態だと外部APIから天気情報を取得出来ません。<br>
例）「新宿区」だと情報を取得できますが、「新宿」だと情報を取得できません。
</p>

<p>使用外部API：<a href="https://openweathermap.org/" target="_blank" rel="noopener">Open Weather Map API</a></p>

---

<h3>【URL】<a href="https://www.yto-weather.com" target="_blank" rel="noopener">Travel Weather</a></h3>
<p>Google Chrome、Safari、Firefox、Edgeにて動作確認済み。（2023年9月11日時点、全て最新Ver.）</p>

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
| name | string | NO | UQ | - | - | ◯ |
| lat | string | NO | - | - | - | ◯ |
| lon | string | NO | - | - | - | ◯ |
| country_id | int | NO | FK | - | - | - |
| created_at | datetime | NO | - | - | - | - |
| updated_at | datetime | NO | - | - | - | - |

【countries】
| カラム名 | データ型 | NULL | 制約 | 初期値 | AUTO INCREMENT | INDEX |
|----|----|----|----|----|----|----|
| id | int | NO | PK | - | ◯ | - |
| name | string | NO | UQ | - | - | ◯ |
| created_at | datetime | NO | - | - | - | - |
| updated_at | datetime | NO | - | - | - | - |

【weathers】
| カラム名 | データ型 | NULL | 制約 | 初期値 | AUTO INCREMENT | INDEX |
|----|----|----|----|----|----|----|
| id | int | NO | PK | - | ◯ | - |
| city_id | int | NO | FK | - | - | ◯ |
| date_time | datetime | NO | - | - | - | ◯ |
| weather | string | NO | - | - | - | - |
| temp | float | NO | - | - | - | - |
| temp_max | float | NO | - | - | - | - |
| temp_min | float | NO | - | - | - | - |
| humidity | int | NO | - | - | - | - |
| description | string | NO | - | - | - | - |
| alert | text | YES | - | - | - | - |
| icon | string | NO | - | - | - | - |
| data_type | string | NO | - | - | - | ◯ |
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
