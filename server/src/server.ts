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

app.use("/api/v1", indexRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});