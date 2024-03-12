import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api';

dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

server.use(apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);

    switch (req.url) {
        case '/ping':
            if (req.method !== 'GET') {
                return res.json({ error: 'Método de requisição inválido.' });
            };
            break;
        case '/register':
            if (req.method !== 'POST') {
                return res.json({ error: 'Método de requisição inválido.' });
            };
            break;
        case '/login':
            if (req.method !== 'POST') {
                return res.json({ error: 'Método de requisição inválido.' });
            };
            break;
        case '/list':
            if (req.method !== 'GET') {
                return res.json({ error: 'Método de requisição inválido.' });
            };
            break;
        default:
            res.json({ error: 'Endpoint não encontrado.' });
            break;
    }
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400); // Bad Request
    console.log(err);
    res.json({ error: 'Ocorreu algum erro.' });
}
server.use(errorHandler);

server.listen(process.env.PORT);