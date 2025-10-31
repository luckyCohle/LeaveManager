import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.get("/",(req,res)=>{
    res.send("backend welcomes you");
})
app.listen(3001,()=>{
    console.log("listning on port 3001")
});
