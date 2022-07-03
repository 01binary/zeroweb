import { Reaction } from "./AllCommentsQuery";

type ReactCommentMutation = {
  userName: string;
  avatarUrl: string;
  parentTimestamp: string | null;
  reaction: Reaction;
  paragraph?: string;
};

export default ReactCommentMutation;
