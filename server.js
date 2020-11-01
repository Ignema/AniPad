
const express = require("express");
const youtube = require('scrape-youtube').default; 
const path = require("path");
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (res) => {
	res.sendFile(path.join(__dirname,'/index.html'));
});

app.post('/videos', (req,res) => {
    youtube.search(req.body.query).then((results) => {
        return res.status(200).json(results);
    }).catch((e)=>{
        res.send(e);
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("Server is running");
}); 

