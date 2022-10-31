type RequestUrlQueryType = {
  pageNumber?: string | number;
  pageSize?: string | number;
  searchNameTerm?: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc' | 1 | -1;
};

export type RequestQueryType = {
  page: number;
  pageSize: number;
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | 1 | -1;
};

export const getPaginationData = ({
  pageNumber = 1,
  pageSize = 10,
  searchNameTerm = null,
  sortBy = 'createdAt',
  sortDirection = 'desc',
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
  };
};
