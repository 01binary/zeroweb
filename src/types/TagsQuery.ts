/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GraphQL tag summary query.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

interface TagsQuery {
  group: TagGroup[];
};

export interface TagGroup {
  tag: string,
  totalCount: number
};

export default TagsQuery;
