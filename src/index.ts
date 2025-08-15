import express, { NextFunction } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import cors from 'cors'
const prisma = new PrismaClient();
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.get('', (req, res) => { res.status(200).send('<h3>server is running</h3>'); });
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
//middleware for authentication
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers?.authorization) {
    if (process.env.JWT_SECRET_KEY) {
      try {
        const verifyToken = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
        (req as any).user = verifyToken;
        next();
      }
      catch (e) {
        res.status(401).json({ message: 'Invalid token' });
      }
    }
  }
  else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
//get all categories
app.get('/categories', async (_, res) => {
  const categories = await prisma.category.findMany({ select: { id: true, name: true, sub_category: { select: { id: true, name: true }, where: { is_deleted: false } } }, where: { is_deleted: false } });
  res.status(200).json(categories);
});
//get all payment modes
app.get('/payment-modes', async (req, res) => {
  const payment_modes = await prisma.payment_mode.findMany({ select: { id: true, name: true, code: true }, where: { is_deleted: false } })
  res.status(200).json(payment_modes)
});
//get all users
app.get('/users', authMiddleware, async (_, res) => {
  const users = await prisma.users.findMany({ where: { is_deleted: false }, omit: { password: true } });
  res.status(200).json(users);
});
//Create user
app.post('/create-user', async (req, res) => {
  if (req.body) {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const createUsers = await prisma.users.create({ data: { ...req.body, password: passwordHash } });
    res.status(200).json(createUsers);
  }
  else {
    res.status(400).json({ message: 'Invalid input data' });
  }
})
//login user
app.post('/login', async (req, res) => {
  if (req.body?.email && req.body?.password) {
    const userDetails = await prisma.users.findUnique({ where: { email: req.body.email } });
    if (userDetails?.password) {
      const comparePassword = bcrypt.compareSync(req.body.password, userDetails?.password);
      if (!comparePassword) {
        res.status(401).json({ message: 'Incorrect password.' });
        return;
      }
      let secretKey = process.env?.JWT_SECRET_KEY;
      if (secretKey) {
        const token = jwt.sign({ ...userDetails, password: null }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
        return;
      }
      res.status(422).json({ message: 'something went wrong' });
      return;
    }
    else {
      res.status(401).json({ message: 'Account not found' });
      return;
    }
  }
  else {
    res.status(400).json({ message: 'Invalid input data' });
    return;
  }
});
//get all goals
app.get('/goals', authMiddleware, async (req, res) => {
  const user_id = (req as any)?.user?.id;
  if (!user_id) { res.status(200).json({ count: 0, data: [] }); return; };
  const goals = await prisma.goals_tracker.findMany({ where: { is_deleted: false, user_id } });
  return res.status(200).json({ data: goals, count: goals.length });
});
//create goal
app.post('/goals', authMiddleware, async (req, res) => {
  const user_id = (req as any)?.user?.id;
  if (!user_id) res.status(401).json({ message: 'user details not found' });
  const createGoal = await prisma.goals_tracker.create({ data: { ...req.body, user_id } });
  return res.status(200).json({ createGoal });
})
//get all daily_tracker
app.get('/daily_tracker', authMiddleware, async (req, res) => {
  const user_id = (req as any)?.user?.id;
  if (!user_id) { res.status(200).json({ count: 0, data: [] }); return; };
  const daily_tracker_details = await prisma.daily_tracker.findMany({ where: { is_deleted: false, user_id } });
  return res.status(200).json({ data: daily_tracker_details, count: daily_tracker_details.length });
});
//create daily tracker
app.post('/daily_tracker', authMiddleware, async (req, res) => {
  const user_id = (req as any)?.user?.id;
  if (!user_id) res.status(401).json({ message: 'user details not found' });
  const createDailyTracker = await prisma.daily_tracker.create({ data: { ...req.body, user_id } });
  return res.status(200).json({ createDailyTracker });
})
//server listning
const server = app.listen(process.env.port, () =>
  console.log(`🚀 Server ready at: http://localhost:${process.env.port}`),
)

