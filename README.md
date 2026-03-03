# TotteMe

写真撮影時にリアルタイムでフィードバックがもらえるカメラアプリです。
旅先やテーマパークなどで他の⼈に撮影をお願いした際、「思った仕上がりと違うけど撮り直しを頼みにくい」という問題を解決します。

## 技術スタック

- **Framework:** [Expo](https://expo.dev/) (React Native)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **UI Testing:** [Storybook](https://storybook.js.org/)
- **API Client:** Axios

## ディレクトリ構成

```text
app/
├── api/                 # APIクライアント・エンドポイント定義
├── components/          # 共有コンポーネント
├── constants/           # 定数定義 (color, themeなど)
├── contexts/            # Context API (Global State)
├── features/            # 機能単位
├── hooks/               # カスタムフック
└── types/               # TypeScript 型定義
```

## 開発コマンド

### アプリの起動
```bash
npm run start
```

### Storybookの起動
モバイル実機/シミュレータ上でStorybookを有効にして起動します。
```bash
npm run storybook
```

Web版のStorybook（コンポーネントカタログ）を起動します。
```bash
npm run storybook:web
```

### リンター・フォーマッタ
```bash
# チェック
npm run lint

# 自動修正
npm run lint:fix
npm run prettier
```
