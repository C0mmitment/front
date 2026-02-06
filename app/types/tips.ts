export type Tips = {
  title: string;
  content: string;
  category: TipsCategory;
};

export type TipsCategory =
  | 'photo' // 撮影テクニック・構図・写真知識ぜんぶ
  | 'app' // アプリの機能・使い方
  | 'dev' // 開発者ネタ・裏話・メタ発言
  | 'other'; // default 分類不能枠
