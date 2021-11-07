type AddCommentMutation = {
  userName: string;
  avatarUrl: string;
  markdown?: string;
  paragraph?: string;
  rangeStart?: number;
  rangeLength?: number;
};

export default AddCommentMutation;
