import express from "express";
import healthRouter from "./routes/health.routes.js";
import boardRouter from "./routes/board.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(healthRouter);
app.use(boardRouter);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});