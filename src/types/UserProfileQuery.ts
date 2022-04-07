import { CommentQuery } from './AllCommentsQuery';

type UserProfileQuery = {
  profile: {
    userId: string;
    userName?: string;
    avatarUrl?: string;
    bio?: string;
    locationName?: string;
    lastActivity?: string;
    reactions: CommentQuery[];
    voteCount: number;
  };
};

export default UserProfileQuery;
