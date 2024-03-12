import { Request, Response } from 'express';
import { User } from '../models/User';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const ping = (req: Request, res: Response) => {
    try {
        res.json({ pong: true });
    } catch (e) {
        res.status(500);
        res.json({ status: false });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        if (req.body.email && req.body.password) {
            let { email, password } = req.body;
            let passwordB64: string = Buffer.from(password).toString('base64');

            let hasUser = await User.findOne({ where: { email } });
            if (!hasUser) {
                let newUser = await User.create({ email, password: passwordB64 });

                const token = JWT.sign(
                    { id: newUser.id, email: newUser.email },
                    process.env.JWT_SECRET_KEY as string,
                    { expiresIn: '2h' }
                );

                res.status(201);
                return res.json({ id: newUser.id, token });
            } else {
                res.status(404);
                return res.json({ error: 'E-mail já existe.' });
            }
        } else {
            res.status(404);
            res.json({ error: 'E-mail e/ou senha não enviados.' });
        }
    } catch (e) {
        res.status(500);
        res.json({ status: false });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        if (req.body.email && req.body.password) {
            let email: string = req.body.email;
            let password: string = Buffer.from(req.body.password).toString('base64');;

            let user = await User.findOne({
                where: { email, password }
            });

            if (user) {
                const token = JWT.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET_KEY as string,
                    { expiresIn: '2h' }
                );

                res.json({ status: true, token });
                
            } else {
                res.status(401);
                res.json({ status: false });
            }
        } else {
            res.status(404);
            res.json({ status: false });
        }
    } catch (e) {
        res.status(500);
        res.json({ status: false });
    }

}

export const list = async (req: Request, res: Response) => {
    try {
        let users = await User.findAll();
        let list: string[] = [];

        for (let i in users) {
            list.push(users[i].email);
        }

        res.json({ list });
    } catch (e) {
        res.status(500);
        res.json({ status: false });
    }
}