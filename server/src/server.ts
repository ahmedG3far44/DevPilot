import dotenv from "dotenv";
import express from 'express';
import cors from 'cors'
import indexRouter from "./routes/index.route";


dotenv.config();

const app = express();
const port = 3000;


app.use(cors({
  origin:"*",
  methods:["GET", "POST"],
  allowedHeaders:["Content-Type", "Authorization", "Transfer-Encoding"],
  credentials:true

}))

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Hello, TypeScript with Express!</h1>');
});

app.get("/accessToken", async (req, res)=>{
  try{
    const code = req.query.code;

    await fetch(`https://github.com/login/oauth/access_token?code=${code}&client_id=Ov23liAnsnAyDMKnewPJ&client_secret=c6b040b5e07dc24c97ef328839359e2e46e78827`, {
      method:"POST",
      headers:{
       "Accept": "application/json"
      }
    }).then((response)=>{
      return response.json()
    }).then((data)=>{
      console.log(data)
      res.status(200).json(data)
    })

  }catch(error){
    res.status(500).json({data:"Error", message:(error as Error).message})
  }
})
app.get("/repos", async (req, res)=>{
  try{
    const token = req.query.token;
    

    await fetch(`https://api.github.com/user/repos`, {
      method:"GET",
      headers:{
       "Authorization":"Bearer " + token
      }
    }).then((response)=>{
      return response.json()
    }).then((data)=>{
      console.log(data)
      res.status(200).json({repos: data})
    })

  }catch(error){
    res.status(500).json({data:"Error", message:(error as Error).message})
  }
})
app.use("/api/v1", indexRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});