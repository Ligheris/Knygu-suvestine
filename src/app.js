const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.send('Sveiki atvykę į knygų suvestinę! Mes esame knygu valdovaiii!!!');
});

app.listen(PORT, () => {
    console.log(`Serveris veikia adresu http://localhost:${PORT}`);
})