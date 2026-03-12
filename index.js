const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// 1. Neon DB 연결 설정
// ssl: true 설정은 Neon과 같은 클라우드 DB 접속 시 필수입니다.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/', async (req, res) => {
  try {
    // 2. test 테이블에서 name 컬럼 하나 가져오기 (LIMIT 1)
    const client = await pool.connect();
    const result = await client.query('SELECT name FROM test LIMIT 1');
    const row = result.rows[0];
    
    client.release(); // 클라이언트 반납

    if (row) {
      // 3. 'HELLO' + 가져온 이름 출력
      res.send(`HELLO${row.name}`);
    } else {
      res.send('데이터가 없습니다.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('DB 연결 오류 발생');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
