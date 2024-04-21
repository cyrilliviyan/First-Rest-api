import { Router } from "express";
import { mockUsers } from "../util/constants.mjs";
const router =Router();


router.get("/api/users/:id", (req, res) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg:"Bad Request "});

  const find = mockUsers.find(item => item.id == parseId);

  if (!find) return res.status(400).send({msg : "User not found "});
    
});

export default router;
