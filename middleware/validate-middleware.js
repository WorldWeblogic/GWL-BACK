const { ZodError } = require("zod");

const validate = (schema) => async (req, res, next) => {
    try{
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    }
    catch(err){ 
      const status=422;
      const message="fill the input fields correctly";
      const extradetails=err.errors[0].message;
      const error={
        status,
        message,
        extradetails
      }
      console.log(error);
      next(error);
    }
}
module.exports = validate;

