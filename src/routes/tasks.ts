import express from "express";
import prisma from "../../prisma/client";

const router = express.Router();

const sendResponse = (
  res: express.Response,
  status: number,
  message: string,
  data: any = null,
) => {
  res.status(status).json({ status, message, data });
};

router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    const total = await prisma.task.count();
    const completed = await prisma.task.count({
      where: { completed: true },
    });

    sendResponse(res, 200, "Tasks fetched successfully", {
      tasks,
      total,
      completed,
    });
  } catch (error) {
    sendResponse(res, 500, "Failed to fetch tasks");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      sendResponse(res, 404, "Task not found");
      return;
    }

    sendResponse(res, 200, "Task fetched successfully", task);
  } catch (error) {
    sendResponse(res, 500, "Failed to fetch task");
  }
});

router.post("/", async (req, res) => {
  const { title, color } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title, color },
    });
    sendResponse(res, 201, "Task created successfully", newTask);
  } catch (error) {
    sendResponse(res, 500, "Failed to create task");
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, color, completed } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, color, completed },
    });
    sendResponse(res, 200, "Task updated successfully", updatedTask);
  } catch (error) {
    sendResponse(res, 500, "Failed to update task");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    sendResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    sendResponse(res, 500, "Failed to delete task");
  }
});

export default router;
