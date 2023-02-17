import {Express, Response, Request} from 'express';
import {createUserHandler} from "./controllers/user.controller";
import validate from "./middleware/validateResource";
import {userSchema} from "./schema/user.schema";
import {createSessionHandler, deleteSessionHandler, getUserSessionsHandler} from "./controllers/session.controller";
import {createSessionSchema} from "./schema/session.schema";
import {requireUser} from "./middleware/requireUser";
import {
    createProductSchema,
    deleteProductSchema,
    fetchProductSchema,
    updateProductSchema
} from "./schema/product.schema";
import {
    createProductHandler,
    deleteProductHandler,
    fetchProductHandler,
    updateProductHandler
} from "./controllers/product.controller";

const routes = (app: Express) => {
    app.get('/healthcheck', (req: Request, res: Response) => {
        res.sendStatus(200)
    })

    app.post('/api/users', validate(userSchema), createUserHandler);

    app.post("/api/sessions", validate(createSessionSchema), createSessionHandler);
    app.get("/api/sessions",requireUser, getUserSessionsHandler);
    app.delete("/api/sessions", requireUser, deleteSessionHandler);

    app.post("/api/products", [requireUser, validate(createProductSchema)], createProductHandler);
    app.get("/api/products/:product_id", validate(fetchProductSchema), fetchProductHandler);
    app.put("/api/products/:product_id", [requireUser, validate(updateProductSchema)], updateProductHandler);
    app.delete("/api/products/:product_id", [requireUser, validate(deleteProductSchema)], deleteProductHandler);

}

export default routes;