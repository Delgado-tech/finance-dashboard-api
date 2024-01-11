import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bearerToken from "express-bearer-token";
import accessRouter from "./routes/access";
import userRouter from "./routes/users";
import transactionsRouter from "./routes/transactions";
import categoryRouter from "./routes/categories";
import categoryIconRouter from "./routes/categoriesIcons";
import goalRouter from "./routes/goals";
import auth from "./middlewares/auth";

const app = express();
const port = 8080;

dotenv.config();

app.use(cors());
app.use(bearerToken());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(accessRouter);
app.use("/users", auth, userRouter);
app.use("/transactions", auth, transactionsRouter);
app.use("/categories", auth, categoryRouter);
app.use("/categories-icons", auth, categoryIconRouter);
app.use("/goals", auth, goalRouter);

app.get("/", (_, res) => {
	res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
	if (process.env.ENVIRONMENT === "development") {
		console.log("Listening at port: " + port);
		console.log(`http://localhost:${port}/`);
	}
});
