import {Request, Response} from "express";
import {createProductInput, deleteProductInput, fetchProductInput, updateProductInput} from "../schema/product.schema";
import {createProduct, deleteProduct, fetchProduct, updateProduct} from "../service/product.service";
import logger from "../utills/logger";

export const createProductHandler = async (req: Request<{}, {}, createProductInput['body']>, res: Response) => {
    try {
        const body = req.body;
        const user_id = res.locals?.user?._id
        const product = await createProduct(
                    {
                        ...(body),
                        user: user_id
                    }
                )
        return res.send(product);
    } catch (e: any) {
        logger.error(e);
        return  res.sendStatus(400)
    }
}

export const fetchProductHandler = async (req: Request<fetchProductInput['params']>, res: Response) => {
    const product_id = req.params.product_id;
    const product  = await fetchProduct({product_id});

    if (!product) {
        return res.sendStatus(404);
    }

    return res.send(product)
}

export const updateProductHandler = async (req: Request<updateProductInput['params'], {}, updateProductInput["body"]>, res: Response) => {
    const product_id = req.params.product_id;
    const user_id = res.locals.user._id;
    const update = req.body;

    const product  = await fetchProduct({product_id});

    if (!product) {
        return res.sendStatus(404);
    }
    console.log(product.user, user_id)
    if (!product.user.equals(user_id)) {
        return res.sendStatus(403);
    }

    const updated = await updateProduct({product_id}, update, {new: true});

    return res.send(updated)
}

export const deleteProductHandler = async (req: Request<deleteProductInput['params']>, res: Response) => {
    const product_id = req.params.product_id;
    const user_id = res.locals.user._id;
    const update = req.body;

    const product  = await fetchProduct({product_id});

    if (!product) {
        return res.sendStatus(404);
    }

    if (!product.user.equals(user_id)) {
        return res.sendStatus(403);
    }

    const updated = await deleteProduct({product_id});

    return res.send(updated)
}
