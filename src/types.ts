import { Request } from "express";
import { Socket } from "socket.io";

export type AuthPayload = {
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export type RequestWithAuth = Request & AuthPayload;
export type SocketWithAuth = Socket & AuthPayload;