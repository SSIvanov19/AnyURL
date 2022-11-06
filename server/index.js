const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

//setup cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/ssl', async (req, res) => {
    const request = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${req.query.url}`, {
        method: 'GET'
    });

    let data;

    try {
        data = await request.json();
    }
    catch (e) {
        console.log(request);
    }

    res.send(data);
})

app.get('/virustotal', async (req, res) => {
    const request = await fetch(`https://www.virustotal.com/vtapi/v2/url/scan?url=${req.query.url}&apikey=77cce44682d4ac4c2010b207b4c305575c1962cd0b59fa02494d4e1b4210089f`, {
        method: 'POST'
    });

    const data = await request.json();

    const request2 = await fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=77cce44682d4ac4c2010b207b4c305575c1962cd0b59fa02494d4e1b4210089f&resource=${data.scan_id}`, {
        method: 'GET'
    });

    const data2 = await request2.json();

    res.send(data2);
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})