require('dotenv').config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initApiRoutes from './routes/api';
import connection from './config/connectDB';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(express.static('./public'));

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//test connection db
connection();

//init api routes
initApiRoutes(app);

app.listen(PORT, () => {
    console.log('JWT Backend is running on the port = ' + PORT);
});
