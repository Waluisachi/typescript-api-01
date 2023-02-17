import express from 'express';
import config from 'config';

import connect from './utills/connection';
import logger from "./utills/logger";
import routes from './routes'
import {deserializeUser} from "./middleware/deserializeUser";

const PORT = config.get<number>("port");

const app = express();
app.use(express.json());
app.use(deserializeUser);

app.listen(PORT, async() => {
    logger.info(`Server running on port ${PORT}`);
    await connect();

    routes(app);
})