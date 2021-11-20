/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GraphQL query that returns post comments.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

export type Reaction = 'snap' | 'party' | 'lol' | 'wow' | 'confused';

export type CommentQuery = {
  // Post slug (hash)
  slug: string;

  // UTC timestamp (range)
  timestamp: string;

  // UTC timestamp of comment replying or reacting to
  parentTimestamp?: string;

  // User id
  userId: string;

  // Did I post this comment?
  me?: boolean;

  // User name
  userName: string;

  // User avatar
  avatarUrl: string;

  // Comment text
  markdown?: string;

  // Hash of the highlighted or commented-on paragraph
  paragraph?: string;

  // Text range within highlighted paragraph
  rangeStart?: number;
  rangeLength?: number;

  // Votes
  upVotes?: number;
  downVotes?: number;
  voted?: boolean;

  // Reaction
  reaction?: Reaction;
};

type AllCommentsQuery = {
  comments: CommentQuery[]
};

export default AllCommentsQuery;
