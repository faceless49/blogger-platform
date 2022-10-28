type RequestUrlQueryType = {
  pageNumber?: string | number;
  pageSize?: string | number;
  searchNameTerm?: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type RequestQueryType = {
  page: number;
  pageSize: number;
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
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
  return {
    page,
    pageSize,
    searchNameTerm,
    sortBy,
    sortDirection,
  };
};
