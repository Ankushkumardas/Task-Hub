import { configDotenv } from 'dotenv';
import cors from 'cors'
import morgan from 'morgan';
import express from 'express';
import db from './database.js';
import router from './routes/index.js';
configDotenv();

const app=express();

app.use(cors({
    origin:process.env.FRONTEND,
    methods:['GET','PUT','POST','PATCH','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}));
app.use(express.json());
app.use(morgan("dev"));

//main routes
// app.use('/api/v1',router);
app.use('/api/v1', router);

// friendly root status page (helps Render and health checks)
app.get('/', (req, res) => {
    const frontend = process.env.FRONTEND || null;
    const frontendLink = frontend ? `<p><a href="${frontend}">Open Frontend</a></p>` : '';
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!doctype html><html><head><meta charset="utf-8"><title>Task Hub</title></head><body><h1>Task Hub API</h1><p>API is available at <code>/api/v1</code></p>${frontendLink}</body></html>`);
});

// catch-all 404 for anything not handled above
app.use((req, res) => {
    // prefer JSON for API requests, HTML/text for browsers
    if (req.accepts('html')) {
        res.status(404).send('<h1>404 - Not Found</h1>');
        return;
    }
    res.status(404).json({ error: 'Not Found' });
});

const port=process.env.PORT;
app.listen(port,()=>{
    console.log("Server started ",port)
    db();
})  