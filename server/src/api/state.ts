import {llamaRouter} from "../services/router";
import mw from "../middlewares";

const router = llamaRouter();

router.use(mw.auth.firebase.protect);

export default router;