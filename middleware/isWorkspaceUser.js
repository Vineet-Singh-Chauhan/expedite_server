const UserSchema = require("../models/UserSchema");
const WorkspaceSchema = require("../models/WorkspaceSchema");

const isWorkspaceUser = async (req, res, next) => {
  const userId = req.user.id;
  const workspaceId = req.body.workspaceId;
  if (!userId) {
    return res.status(403).send({ error: " Please authenticate first!" });
  }
  if (!workspaceId || !workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ error: "Workspace not found !" });
  }
  const user = await UserSchema.findOne({ _id: userId });

  if (!user) {
    return res.sendStatus(401);
  }

  try {
    const isMember = await WorkspaceSchema.findOne({
      _id: workspaceId,
      members: { $elemMatch: { $eq: userId } },
    }).exec();
    if (!isMember) {
      return res.status(404).json({ error: "Workspace not found !" });
    }
    req.workspace = isMember._id;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error!" });
  }
};

module.exports = isWorkspaceUser;
