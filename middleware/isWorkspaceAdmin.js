const UserSchema = require("../models/UserSchema");
const WorkspaceSchema = require("../models/WorkspaceSchema");

const isWorkspaceAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const workspaceId = req.body.workspaceId;
  if (!userId) {
    return res.status(403).send({ error: " Please authenticate first!" });
  }
  const user = await UserSchema.findOne({ _id: userId });
  if (!user) {
    return res.sendStatus(401);
  }
  if (!workspaceId || !workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ error: "Workspace not found !" });
  }

  try {
    const workspace = await WorkspaceSchema.findOne({
      _id: workspaceId,
    }).exec();
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found !" });
    }
    const members = workspace.members;
    const found = members.some((el) => el.id == userId);
    if (!found) {
      return res.status(401).json({ error: "Forbidden resource" });
    }
    if (workspace.adminId.toString() !== userId) {
      console.log("here");
      console.log(workspace.adminId.toString());
      console.log(userId);
      return res.status(401).json({ error: "Forbidden resource" });
    }
    req.workspace = workspace;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error!" });
  }
};

module.exports = isWorkspaceAdmin;