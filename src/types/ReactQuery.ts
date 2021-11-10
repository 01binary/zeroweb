import { Reaction } from "./AllCommentsQuery";

type ReactQuery = {
  addComment: {
    slug: string;
    timestamp: string;
    parentTimestamp: string;
    reaction: Reaction;
    paragraph?: string;
    me: boolean;
  };
};

export default ReactQuery;
