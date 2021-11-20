/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GraphQL query that returns post shares.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

export type ShareType =
  'link' |
  'twitter' |
  'facebook' |
  'linkedIn' |
  'email';

export type ShareQuery = {
  slug: string;
  shareType: ShareType;
  count: number;
};

type AllSharesQuery = {
  shares: ShareQuery[]
};

export default AllSharesQuery;
