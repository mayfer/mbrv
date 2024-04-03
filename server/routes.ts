

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from 'cors';
import nocache from "nocache";
import express from "express";
import { getMainProps } from "server/ssr_state";

export function setup_routes(app: any) {
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(nocache());
    app.use(compression());

    app.get("/api/props", async (req, res) => {
        const top_level_state = await getMainProps(req);
        res.json(top_level_state);
    });
}