import Validator from "fastest-validator";

const v = new Validator();

const schema = {
  title: {
    type: "string",
    min: 3,
    max: 150,
    required: true,
    empty: false,
  },
  content: {
    type: "string",
    min: 10,
    required: true,
    empty: false,
  },
  authorId: {
    type: "string",
    required: true,
    empty: false,
  },
  image: {
    type: "string",
    optional: true,
  },
  status: {
    type: "boolean",
    optional: true,
    default: false,
  },
  $$strict: true,
};

const validPost = v.compile(schema);
export default validPost;
