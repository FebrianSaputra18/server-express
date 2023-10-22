const { subject } = require("@casl/ability");
const DeliveryAddress = require("./model");
const { policyFor } = require("../../utils");

const index = async (req, res, next) => {
  try {
    let {skip = 0, limit = 10} = req.query
    let count = await DeliveryAddress.find({user: req.user._id}).countDocuments()
    let adress = await DeliveryAddress.find({user: req.user._id}).find({user: req.user._id}).skip(parseInt(skip)).limit(parseInt(limit)).sort('-create')
    return res.json({
      message: "Data retrieved successfully",
      data: adress,
      count
    });
  } catch (err) {
    if (err && err === "data not found") {
      return res.status({
        error: err.message,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();

    return res.json({
      address,
      message: "Success",
    });
  } catch (err) {
    if (err && err.name === " ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    let (_id, ...payload) = req.body
    let address =  await DeliveryAddress.findById(id);
    let subjectAdress = subject('DeliveryAddress', {...address, user_id: address.user})
    let policy = policyFor(req.user);
    if(!policy.can('update', subjectAdress)){
        return res.json({
            error: 1,
            message: `You are not allowed to update`
        })
    }
    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    res.json(address);
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
    const {id} = req.params;
    let address = await DeliveryAddress.findById(id);
    let subjectAdress = subject('DeliveryAddress', {...address, user_id: address.user})
    let policy = policyFor(req.user);
    if(!policy.can('delete', subjectAdress)){
        return res.json({
            error: 1,
            message: `You are not allowed to delete`
        })
    }
    address = await DeliveryAddress.findByIdAndDelete(id);
    res.json({
        message: 'Delete delivery address Success',
        address
    })
  } catch (err) {
    if ((err && err.code === 404, "Validation err")) {
      res.status(400).json({
        err: err.message,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};
module.exports = {
  store,
  index,
  update,
  destroy,
};
