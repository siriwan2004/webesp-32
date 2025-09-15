const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// บรรทัดนี้จะสั่งให้ Express เสิร์ฟไฟล์จากโฟลเดอร์ 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Frontend serving at http://localhost:${port}`);
});
