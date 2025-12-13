import Validator from "fastest-validator";

const v = new Validator();

const schema = {
  title: {
    type: "string",
    min: 3,
    max: 150,
    optional: true,
  },
  content: {
    type: "string",
    min: 10,
    optional: true,
  },
  status: {
    type: "enum",
    values: ["draft", "pending", "published", "rejected"],
    optional: true,
  },
  image: { type: "string", optional: true },

  $$strict: true,
};

const validPost = v.compile(schema);
export default validPost;
