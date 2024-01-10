import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const port = 8080;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (_, res) => {
	res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
	if (process.env.ENVIRONMENT === "development") {
		console.log("Listening at port: " + port);
		console.log(`http://localhost:${port}/`);
	}
});
