import { NextFunction, Request, Response } from "express";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let success = false;
            if (req.headers.authorization) {
                const [authType, token] = req.headers.authorization.split(' ');
                if (authType === 'Bearer') {
                    const decoded = JWT.verify(
                        token,
                        process.env.JWT_SECRET_KEY as string
                    );

                    if (decoded) {
                        success = true;
                    }
                }
            };

            if (success) {
                next();
                return
            }
        } catch (e) {
            console.log(e);
        }
        res.status(403); // Forbidden
        res.json({ error: 'Não autorizado.' });
    }
}