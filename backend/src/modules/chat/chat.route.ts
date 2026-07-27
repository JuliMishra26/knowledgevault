import { Router } from 'express';
import { streamChat } from './chat.controller';

const route = Router();

route.post('/chat', streamChat);

export default route;
