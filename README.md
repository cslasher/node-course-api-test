# Node-API-test

Mocha測試的參考

## Getting Started

安裝方式
```
npm install
```

## Configuration
```
{
  "test": {
    "PORT": <測試port>,
    "MONGODB_URI": "<測試MongoDB URI>",
    "JWT_SECRET": "<測試Secret>"
  },
  "development": {
    "PORT": <dev port>,
    "MONGODB_URI": "<DEV MongoDB URI>",
    "JWT_SECRET": "<Dev Secret>"
  }
}
```

### 啟動伺服器
```
npm start
```

## Running the tests
```
npm run 'test-watch'
```
### 備註
* 主要測試在 server/test/server.test.js
* 可直接push到heroku
* Heroku要有對應的Mongo instance，我是用mLab
