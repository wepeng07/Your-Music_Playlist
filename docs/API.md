# API文档

## 认证API

### POST /api/auth
用户登录和注册

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名", // 仅注册时需要
  "action": "signin" // 或 "signup"
}
```

**响应:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "uid": "user_id",
    "email": "user@example.com",
    "name": "用户名"
  }
}
```

## 用户API

### GET /api/user
获取当前用户信息

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**响应:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "用户名",
    "avatar": "avatar_url",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "preferences": {
      "favoriteGenres": ["pop", "rock"],
      "favoriteArtists": ["Artist1", "Artist2"],
      "moodPreferences": ["happy", "relaxed"],
      "languagePreference": "zh-CN"
    }
  }
}
```

### PUT /api/user/update
更新用户信息

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**请求体:**
```json
{
  "name": "新用户名",
  "preferences": {
    "favoriteGenres": ["pop", "jazz"],
    "moodPreferences": ["energetic"]
  }
}
```

## 音乐搜索API

### POST /api/search
搜索音乐

**请求体:**
```json
{
  "query": "搜索关键词"
}
```

**响应:**
```json
{
  "tracks": [
    {
      "id": "track_id",
      "title": "歌曲标题",
      "artist": "艺术家",
      "duration": 180,
      "youtubeId": "youtube_video_id",
      "thumbnail": "thumbnail_url",
      "genre": ["pop"],
      "mood": ["happy"],
      "popularity": 85
    }
  ]
}
```

## AI推荐API

### POST /api/recommend
AI音乐推荐

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**请求体:**
```json
{
  "prompt": "适合学习的轻音乐",
  "userId": "user_id",
  "limit": 10,
  "includeGenres": ["classical", "ambient"],
  "excludeGenres": ["rock"],
  "mood": "relaxed"
}
```

**响应:**
```json
{
  "tracks": [
    {
      "id": "track_id",
      "title": "歌曲标题",
      "artist": "艺术家",
      "duration": 180,
      "youtubeId": "youtube_video_id",
      "thumbnail": "thumbnail_url",
      "genre": ["classical"],
      "mood": ["relaxed"],
      "popularity": 85
    }
  ],
  "reasoning": "推荐理由：这些歌曲适合学习时听，具有舒缓的旋律和适中的节奏...",
  "prompt": "适合学习的轻音乐",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 播放列表API

### POST /api/playlists
创建播放列表

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**请求体:**
```json
{
  "name": "我的播放列表",
  "description": "播放列表描述",
  "tracks": [
    {
      "id": "track_id",
      "title": "歌曲标题",
      "artist": "艺术家",
      "duration": 180,
      "youtubeId": "youtube_video_id",
      "thumbnail": "thumbnail_url",
      "genre": ["pop"],
      "mood": ["happy"],
      "popularity": 85
    }
  ],
  "isPublic": false,
  "tags": ["favorite", "workout"]
}
```

**响应:**
```json
{
  "id": "playlist_id",
  "name": "我的播放列表",
  "description": "播放列表描述",
  "tracks": [...],
  "userId": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isPublic": false,
  "tags": ["favorite", "workout"]
}
```

### GET /api/playlists/list
获取用户的播放列表

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**查询参数:**
- `limit`: 限制返回数量（默认20）

**响应:**
```json
{
  "playlists": [
    {
      "id": "playlist_id",
      "name": "我的播放列表",
      "description": "播放列表描述",
      "tracks": [...],
      "userId": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isPublic": false,
      "tags": ["favorite"]
    }
  ]
}
```

## 错误响应

所有API在出错时都会返回以下格式的响应：

```json
{
  "error": "错误描述"
}
```

**常见HTTP状态码:**
- `200` - 成功
- `400` - 请求参数错误
- `401` - 未授权
- `404` - 资源不存在
- `500` - 服务器内部错误

## 认证说明

大部分API需要JWT令牌认证。获取令牌后，在请求头中包含：

```
Authorization: Bearer <your_jwt_token>
```

令牌有效期为7天，过期后需要重新登录获取新令牌。

