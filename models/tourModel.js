// Require the modules
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

// const User = require("./userModel");

// Create a Mongoose schema for tours
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
      // minlength: [10, "A tour name must have more or equal then 10 characters"],
      // maxlength: [40, "A tour name must have less or equal then 40 characters"],
    },
    slug: { type: String },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      trim: true,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: 'easy', 'medium' or 'difficult'",
      },
    },
    ratingsAverage: {
      type: Number,
      required: [true, "A tour must have an average rating"],
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current document on NEW documet creation
          return value < this.price;
        },
        message: "Discount price should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// Document middleware: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// ------------ Tour guides embedding example ------------
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });
// -------------------------------------------------------

// ----------------------------------------
// tourSchema.pre("save", function (next) {
//   console.log("Will save document...");
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });
// ----------------------------------------

// Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// Aggregation middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Create the Mongoose model
const Tour = mongoose.model("Tour", tourSchema);

// Export the model
module.exports = Tour;
