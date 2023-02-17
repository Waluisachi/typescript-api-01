import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

const connect = async () => {
    const uri = config.get<string>("MONGO_URI");
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri);

        logger.info('Database connected');
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

export default connect;