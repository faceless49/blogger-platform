type RequestUrlQueryType = {
  pageNumber?: string | number;
  pageSize?: string | number;
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc' | 1 | -1;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type RequestQueryType = {
  page: number;
  pageSize: number;
  searchNameTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | 1 | -1;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export const getPaginationData = ({
  pageNumber = 1,
  pageSize = 10,
  searchNameTerm = '',
  sortBy = 'createdAt',
  sortDirection = 'desc',
  searchLoginTerm = '',
  searchEmailTerm = '',
}: RequestUrlQueryType): RequestQueryType => {
  const page = +pageNumber;
  pageSize = +pageSize;
  sortDirection === 'asc' ? (sortDirection = 1) : (sortDirection = -1);
  return {
    page,
    pageSize,
    searchNameTerm,
    sortBy,
    sortDirection,
    searchLoginTerm,
    searchEmailTerm,
  };
};
