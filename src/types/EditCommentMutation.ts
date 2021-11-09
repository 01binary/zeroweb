import { Reaction } from "./AllCommentsQuery";

type EditCommentMutation = {
  slug: string;
  timestamp: string;
  markdown?: string;
  reaction?: Reaction;
};

export default EditCommentMutation;
