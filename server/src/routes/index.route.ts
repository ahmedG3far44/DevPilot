import { Router } from "express";
import deployRouter from "./deploy.route"



const router = Router();


router.use("/deploy", deployRouter)



export default router;