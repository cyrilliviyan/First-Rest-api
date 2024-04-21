import express from "express";
import cors from 'cors';
import { query, body, validationResult, matchedData } from 'express-validator';
//import Createvalidationschema from './ValidationSchema.mjs';
import UserRouter from './routes/UserRouter.mjs';
import { mockUsers } from "./util/constants.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(UserRouter);

app.listen(PORT, () => {
  console.log(`Connection Established ${PORT}`);
});

const ResolveUserById = (req, res, next) => {
  const { params: { id } } = req;
  const parseId = parseInt(id);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send({ msg: "Bad request" });
  req.findUserIndex = findUserIndex;
  next();
};



app.get("/api/users", query("filter").isString().withMessage('Please enter String').isAlphanumeric(), (req, res) => {
  const result = validationResult(req);
  const { query: { filter, value } } = req;
  if (!filter && !value) return res.send(mockUsers);
  if (filter && value) return res.send(mockUsers.filter((user) => user[filter].includes(value)));
});

app.post("/api/users", [body("Name").notEmpty().isString().withMessage('Enter String please ')], (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send({ error: { result } })
  const data = matchedData(req);
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
  mockUsers.push(newUser);
  res.status(200).send(newUser);
});

app.put("/api/users/:id", ResolveUserById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
});

app.delete("/api/users/:id", (req, res) => {
  const { params: { id } } = req;
  const parseId = parseInt(id);
  const findUserIndex = mockUsers.findIndex(user => user.id === parseId);
  mockUsers.splice(findUserIndex, 1);
});

app.get("/products", () => {});

export default app;
