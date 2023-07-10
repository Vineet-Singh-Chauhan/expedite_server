const WorkspaceSchema = require("../models/WorkspaceSchema");

const isWorkspaceAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const workspaceId = req.body.workspaceId;
  if (!userId) {
    return res.status(403).send({ error: " Please authenticate first!" });
  }
  if (!workspaceId || !workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ error: "Workspace not found !" });
  }

  try {
    const workspace = await WorkspaceSchema.findOne(
      {
        $and: [{ _id: workspaceId }, { admin: userId }],
      },
      "_id"
    ).exec();

    if (!workspace) {
      return res.status(401).json({ error: "Forbidden resource" });
    }
    req.workspace = workspace._id;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error!" });
  }
};

module.exports = isWorkspaceAdmin;
