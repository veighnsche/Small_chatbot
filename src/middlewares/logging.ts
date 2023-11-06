import { AuthMiddleware } from "../types/auth";

interface SearchOptions {
  body?: ((body: any) => any);
  params?: ((params: any) => any);
  locals?: ((locals: any) => any);
}

const log = (message: any, search?: SearchOptions): AuthMiddleware => (req, res, next) => {
  console.log(message);

  if (!search) {
    next();
    return;
  }

  if (search.body) {
    console.log("Body:", search.body(req.body));
  }

  if (search.params) {
    console.log("Params:", search.params(req.params));
  }

  if (search.locals) {
    console.log("Locals:", search.locals(res.locals));
  }

  next();
};

export default log;
