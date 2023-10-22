const Tags = require("./model");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = new Tags(payload);
    await tag.save();
    return res.json(tag);

  } catch (error) {
    if ((error && error.code === 404, "Validation error")) {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    let payload = req.body;
    let tag = await Tags.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    res.json(tag);
  } catch (error) {
    if ((error && error.code === 404, "Validation error")) {
      res.status(400).json({
        error: error.message,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    let tag = await Tags.findByIdAndDelete(req.params.id);
    res.json(tag);
    res.send(tag, 'success');
  } catch (error) {
    if ((error && error.code === 404, "Validation error")) {
      res.status(400).json({
        error: error.message,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const data = await Tags.find()
    return res.json({ message: "Data retrieved successfully", data });
  } catch (error) {
    if (error && error === 'ValidationError') {
      return res.status({
        error: error.message,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

module.exports = {
  store,
  update,
  destroy,
  index,
};
