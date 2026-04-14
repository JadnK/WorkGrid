import express from "express";
import healthRouter from "./routes/health.routes.js";
import projectRouter from "./routes/project.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(healthRouter);
app.use(projectRouter);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});