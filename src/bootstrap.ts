import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import router from "./modules/routes";
import { IError } from "./utils/errors/types";
import connectDB from "./DB/config/connectDB";
const app = express();

const bootstrap = async () => {
  const port = process.env.PORT || 5000;
  app.use(express.json());
  app.use("/api/v1", router);
  await connectDB();

  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      msg: err.message,
      stack: err.stack,
      status: err.statusCode || 500,
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default bootstrap;
