const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");

// post data
const store = async (req, res, next) => {
  try {
    let payload = req.body;

    //relasi one to one product with category
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    //relasi one to many product with tag
    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      //memindahkan image createread membaca terus memindahkan createwrite
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name !== "Validation Error") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.fields,
            });
          }
          next(err);
        }
      });

      src.on("error", (err) => {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.code === "Validation Error") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.fields,
      });
    }
    next(err);
  }
};

//get Data
const index = async (req, res, next) => {
  try {
    //start filter
    let { skip = 0, limit = 10, q = "", category = "", tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: "i" },
      };
    }

    if (category.length) {
      let categoryResult = await Category.findOne({
        name: { $regex: `${category}`, $options: "i" },
      });

      if (categoryResult) {
        criteria = {
          ...criteria,
          category: categoryResult._id,
        };
      }
    }

    if (tags.length) {
      let tagsResult = await Tag.find({ name: { $in: tags } });

      if (tagsResult.length) {
        criteria = {
          ...criteria,
          tags: { $in: tagsResult.map((tag) => tag._id) },
        };
      }
    }

    console.log(criteria);
    // end filter

    let count = await Product.find().countDocuments();

    let product = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("category")
      .populate("tags");

    return res.json({
      message: "Data retrieved successfully",
      data: product,
      count,
    });
  } catch (error) {
    next(error);
  }
};

//update data
const update = async (req, res, next) => {
  try {
    let payload = req.body;

    //relasi one to one product with category
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    //relasi one to many product with tag
    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    //update menerima parameter => req.params
    const { id } = req.params;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      //memindahkan image createread membaca terus memindahkan createwrite
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = await Product.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
          });
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name !== "Validation Error") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.fields,
            });
          }
          next(err);
        }
      });

      src.on("error", (err) => {
        next(err);
      });
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json(product);
    }
  } catch (err) {
    if (err && err.code === "Validation Error") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.fields,
      });
    }
    next(err);
  }
};

//delete data
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findByIdAndDelete(req.params.id);

    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    res.json({ message: "Data delete successfully", product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
};
