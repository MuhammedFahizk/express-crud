const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const indexpage = fs.readFileSync('views/index.ejs', 'utf-8');
const userDataPath = 'Data/userdata.json'
const formpage = fs.readFileSync('form.html','utf-8')
const datajson = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));




app.get('/', (req, res) => {
    try {
        const datafile = fs.readFileSync(userDataPath, 'utf-8');
        let existdata = JSON.parse(datafile);

        res.render('update', { users: existdata });
        
        fs.readFileSync('views/update.ejs','utf-8',(err,data)=>{
        res.render('index',{content:data})

        })
        res.send(indexpage)
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/form', (req, res) => {
    res.status(200).send(formpage);
});

app.post('/myform', (req, res) => {
    try {
        const formdata = req.body;
        const id = uuidv4();
        formdata.id = id;


        let existdata = [];
        

        if (fs.existsSync(userDataPath)) {
            const datafile = fs.readFileSync(userDataPath, 'utf-8');
            existdata = JSON.parse(datafile);
          
        }

        existdata.push(formdata);
        fs.writeFileSync(userDataPath, JSON.stringify(existdata, null, 2));
        res.status(200).send(formpage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/home', (req, res) => {
    try {
        const datafile = fs.readFileSync(userDataPath, 'utf-8');
        let existdata = JSON.parse(datafile);

        res.render('update', { users: existdata });
        
        fs.readFileSync('views/update.ejs','utf-8',(err,data)=>{
        res.render('index',{content:data})
        res.send(indexpage)

        })
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});