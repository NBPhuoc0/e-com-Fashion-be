import { Request } from "express";

export const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['accessToken'];
    }
    return token;
}

export const cookieExtractorRefresh = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['refreshToken'];
    }
    
    return token;
}