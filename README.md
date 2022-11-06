# renderでGASにリクエスト

サーバー: render

言語: node.js

```bash
node index.js
```

## 機能

httpsでGASにリクエストをして、expressでそのレスポンスを表示するプログラム。

例えば

`localhost:3000?id={ID}`
が
`https://script.google.com/macros/s/{ID}/exec`
として読み込めれる。