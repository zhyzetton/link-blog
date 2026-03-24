## 常用框架

```bash
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=interview_guide \
  -v postgres-data:/var/lib/postgresql/data \
  --restart=always \
  postgres:14
```


```bash
docker run -d \
  --name pgvector \
  -e POSTGRES_PASSWORD=123456\
  -p 5432:5432 \
  pgvector/pgvector:pg14
```

‍
