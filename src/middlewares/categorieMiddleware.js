import categorieSchema from "../schemas/categorieSchema.js"

export default async function categorieMiddleware (req, res, next) {
    const {error} = categorieSchema.validate(req.body);

    if(error) {
        return res.sendStatus(400)
    }
    next()
}