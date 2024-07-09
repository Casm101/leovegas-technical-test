// Module imports
import express, { Request, Response, NextFunction } from "express";
import 'dotenv/config';

// Import routes
import router from './src/routes';


// Declaration of h-express server
const app = express();

// Declare middleware
app.use(express.json());

// Declare routing
app.use('/api/v1', router.routes);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send(`${process.env.COMPANY} technical test api`);
});

// Start server on given port
app.listen(process.env.PORT, () => {
  console.log(`Sever has started on port ${process.env.PORT}!`);
  console.log(`Router version v${router.version}`);
}).on('error', (err: any) => {
  if (err.code === "EADDRINUSE") console.log('Error: address already in use.');
  else console.log(err);
});