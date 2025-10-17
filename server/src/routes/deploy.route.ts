import { Request, Response, Router } from "express";
import {spawn} from "child_process"


const router = Router();


router.get("/", async (req:Request, res:Response)=>{
    try{
        res.status(200).json({data:"Deploy Route", message:"success response"})
    }catch(error){
        res.status(500).json({data:"[ERROR]: Internal server error", message:(error as Error).message})
    }
})

router.get("/test", async (req:Request, res:Response)=>{
  try{
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

  const script ="sudo bash /home/ubuntu/deploy/run_apps.sh";

  const sshLogin = `${process.env.SSH_USERNAME}@${process.env.SSH_HOST}`

  const ssh = spawn("ssh", [
    "-i", process.env.SSH_PRIVATE_KEY_PATH as string,
    sshLogin,
    script as string
  ]);

  ssh.stdout.on("data", (data) => {
    res.write(data);
  });

  ssh.stderr.on("data", (data) => {
    res.status(400).json(`ERROR: ${data}`);
  });

  ssh.on("close", (code) => {
    res.write(`\nProcess exited with code ${code}`);
    res.end();
  });

  }catch(error){
    res.status(500).json({data:"[ERROR]: Internal server error", message:(error as Error).message})
  }
})

export default router;