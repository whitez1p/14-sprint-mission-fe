import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Product from "./models/Product.js";

import { notFound, errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 상품 등록
app.post("/products", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await Product.create({ name, description, price, tags });
    res.status(201).send(product);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 상품 상세 조회
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "잘못된 id 형식입니다." });
    }
    res.status(500).send({ message: err.message });
  }
});

// 상품 수정
app.patch("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "잘못된 id 형식입니다." });
    }
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: err.message });
    }
    res.status(500).send({ message: err.message });
  }
});

// 상품 삭제
app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.status(200).send({ message: "삭제되었습니다." });
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "잘못된 id 형식입니다." });
    }
    res.status(500).send({ message: err.message });
  }
});

// 상품 목록 조회
app.get("/products", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword = "" } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);

    const filter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const totalCount = await Product.countDocuments(filter);
    const list = await Product.find(filter)
      .select("name price createdAt favoriteCount")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(Number(pageSize));

    res.status(200).send({ list, totalCount });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// 좋아요 증가
app.patch("/products/:id/favorite", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { favoriteCount: 1 }},
      { new: true }
    );
    if (product) {
      res.status(200).send(product);      
    }
    else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  }
   catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "잘못된 id 형식입니다 "});
    }
    res.status(500).send({ message: err.message });
   }
});



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
