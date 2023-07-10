const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const { toPos, fromGrp, toGrp, taskId, fromPos } = req.body;

  try {
    if (!taskId && !toGrp) {
      //* handling group drag
      if (!fromGrp || typeof toPos === typeof undefined) {
        return res
          .status(400)
          .json({ error: "Please fill all the mandatory fields here!" });
      }
      if (toPos == fromPos) {
        return res.sendStatus(200);
      }

      const workspace2 = await WorkspaceSchema.findOneAndUpdate(
        {
          _id: req.workspace,
        },
        {
          $pull: { taskGroups: fromGrp },
        }
      );

      const workspace = await WorkspaceSchema.findOneAndUpdate(
        {
          _id: req.workspace,
        },
        {
          $push: {
            taskGroups: {
              $each: [fromGrp],
              $position: toPos,
            },
          },
        }
      );
      return res.sendStatus(200);
    } else if (
      //* start handling task drag
      !fromGrp ||
      !taskId ||
      !toGrp ||
      typeof toPos === typeof undefined
    ) {
      return res
        .status(400)
        .json({ error: "Please fill all the mandatory fields here!" });
    }
    if (fromGrp !== toGrp) {
      //*handle task drag between different groups

      const fromTaskGroup = await TaskGroup.findOneAndUpdate(
        {
          _id: fromGrp,
        },
        {
          $pull: { tasks: taskId },
        }
      );

      const toTaskGrp = await TaskGroup.findOneAndUpdate(
        {
          _id: toGrp,
        },
        {
          $push: {
            tasks: {
              $each: [taskId],
              $position: toPos,
            },
          },
        }
      );
    } else {
      //* handle task drag within same grp
      if (toPos == fromPos) {
        return res.sendStatus(200);
      }

      const taskGrp1 = await TaskGroup.findOneAndUpdate(
        {
          _id: fromGrp,
        },
        {
          $pull: { tasks: taskId },
        }
      );

      const taskGrp2 = await TaskGroup.findOneAndUpdate(
        {
          _id: fromGrp,
        },
        {
          $push: {
            tasks: {
              $each: [taskId],
              $position: toPos,
            },
          },
        }
      );
    }

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
