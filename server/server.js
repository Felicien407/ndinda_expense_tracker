import epxress from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = epxress();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(epxress.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});