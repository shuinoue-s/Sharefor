# はじめに

「Jリーグチームのスタジアム周辺のおすすめスポットを共有したい、もしくは初めて行くためおすすめの場所を知りたい」といった課題を解決するために
このアプリケーションを作成しました。Vue.jsを使用してシングルページアプリケーションを作成しています。またコストを抑えるためサーバーを設置せずに
、Firebaseを使用しています。

<br>

[・はじめに](#はじめに)  
[・アプリ概要](#アプリ概要)  
[・使用技術](#使用技術)  
[・インフラ構成図](#インフラ構成図)  
[・データベース設計](#データベース設計)  
[・機能一覧](#機能一覧)  
[・意識したこと・苦労したこと](#意識したこと・苦労したこと)  
[・今後の課題](#今後の課題)  

<br>

# アプリ概要

Jリーグチームのスタジアム周辺のおすすめスポットの共有・募集ができる、「Sharefor」というアプリを作成しました。

<br>

## 作成背景
初めて行くスタジアム周辺の情報を知りたい、または共有したいといった声をSNSで見かけることがあったため、
また自分自身もJリーグが好きでスタジアムにいった際に、その土地ならではの場所が知りたいと思い、このアプリケーションを作成しました。

<br>

## URL
<a href="https://share-for.net/" target="_blank">https://share-for.net/</a>

<br>
<br>

トップページ
<img width="1440" alt="sharefor_home" src="https://user-images.githubusercontent.com/80799067/156976716-d3e102ce-df9f-4ae8-9584-aed54ac1d7a5.png">

<br>
<br>

投稿フォーム
<img width="1440" alt="sharefor_post" src="https://user-images.githubusercontent.com/80799067/156976798-78b5ad55-5366-4664-bfd0-8fc34438a932.png">

<br>
<br>

募集フォーム
<img width="1440" alt="sharefor_ask" src="https://user-images.githubusercontent.com/80799067/156976879-84ee065a-eeb8-45af-8d3e-e7cef41cc568.png">

<br>
<br>

投稿詳細ページ
<img width="1440" alt="sharefor_post_show" src="https://user-images.githubusercontent.com/80799067/156977318-654f4be8-e563-44f9-ac13-00a6e9f4a6c4.png">

<br>
<br>

募集詳細ページ
<img width="1440" alt="sharefor_ask_show" src="https://user-images.githubusercontent.com/80799067/156977358-726dd3f5-b02b-4e34-a4eb-290886c44fe8.png">

<br>
<br>

検索ページ
<img width="1440" alt="sharefor_search" src="https://user-images.githubusercontent.com/80799067/156977424-90ab60f3-d976-4000-8245-12a2a681d2be.png">

<br>
<br>

マイページ
<img width="1440" alt="sharefor_mypage" src="https://user-images.githubusercontent.com/80799067/156977523-d9f0bc29-1348-4e66-818d-7e918dfd8935.png">

<br>
<br>

プロフィール編集フォーム
<img width="1440" alt="sharefor_profile_edit" src="https://user-images.githubusercontent.com/80799067/156977551-ae13a5f9-6b0a-450a-b262-fdd1c059dc97.png">

<br>
<br>
<br>

# 使用技術
- HTML
- CSS
- Javascript
- Vue.js

<br>

- Firebase
- Docker
- Docker Compose

<br>
<br>

Vue.jsを使用してSPAを作成した。開発環境にはDocker, Docker Composeを使用。コスト面を考えてDBサーバーを設置せずFirebaseを使用している。

<br>
<br>

# データベース設計

<br>
<br>

## テーブル構成
| コレクション | 説明 |
| --- | --- |
| users | ユーザー情報を保存 |
| index | ユーザーIDをドキュメントIDとして保存 |
| unique | 一意なユーザーIDを保存。usersコレクションのサブコレクション |
| posts | 投稿情報を保存。usersコレクションのサブコレクション |
| asks | 募集情報を保存。usersコレクションのサブコレクション |
| comments | コメント情報を保存。posts, asksコレクションのサブコレクション |

<br>
<br>

# 機能一覧

### 機能設計
<img width="847" alt="sharefor_機能設計" src="https://user-images.githubusercontent.com/80799067/157142308-01476128-3b4e-4c83-8e1e-3f150837923d.png">

### ワイヤーフレーム
<img width="897" alt="sharefor_wireframe" src="https://user-images.githubusercontent.com/80799067/157142303-c79f0993-c376-477b-8376-9d1bef9a4174.png">

## ユーザー機能
- Twitter認証機能
- ログイン・ログアウト機能
- ゲストログイン機能

<br>

## プロフィール機能
- プロフィール登録・編集機能
- ユニークユーザーID機能
- 画像プレビュー機能
- 画像アップロード機能
- プロフィール表示機能

<br>

## 投稿機能
- 新規投稿機能
- 募集削除機能
- 画像プレビュー機能
- 画像アップロード機能
- タグ機能
- 投稿一覧表示機能
- 投稿詳細表示機能
- 無限スクロール機能
- GoogleMap表示機能

<br>

## 募集機能
- 新規募集機能
- 募集削除機能
- タグ機能
- 投稿一覧表示機能
- 投稿詳細表示機能
- 無限スクロール機能
- 募集状態表示機能

<br>

## コメント機能
- 新規投稿機能
- 一覧表示機能

<br>

## 検索機能
- キーワード検索機能
- 一覧表示機能

<br>
<br>

# 意識したこと・苦労したこと

プログラミングの部分だけではなく、要件定義や機能設計、ワイヤーフレームの作成など、プログラムを書く前の段階の作業をしっかりやることを意識しました。
今回は費用面などを考慮しAWSにサーバーを設置するのではなく、サーバーレスで運用してみようと考えたためDBにはFirebaseのFirestoreを使用しています。
<br>
<br>

# 今後の課題

- 機能の追加

- テスト

- セキュリティの改善

- スマホ画面でのUI/UXの向上

上記以外にも改善点はたくさんあるので、今後も学習を続けていきたいです。
<br>
<br>

