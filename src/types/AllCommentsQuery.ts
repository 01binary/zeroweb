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

export interface CommentQuery {
  // Post slug (hash)
  slug: string;

  // UTC timestamp (range)
  timestamp: string;

  // User id
  userId: string;

  // User name
  userName: string;

  // User avatar
  avatarUrl: string;

  // Body text in markdown
  markdown: string;

  // Hash of the highlighted paragraph
  paragraph: string;

  // Text range within highlighted paragraph
  rangeStart: number;
  rangeLength: number;

  // Votes
  upVotes: number;
  downVotes: number;
};

interface AllCommentsQuery {
  comments: CommentQuery[]
};

export default AllCommentsQuery;
