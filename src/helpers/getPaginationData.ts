type RequestUrlQueryType = {
  PageNumber?: string | number;
  PageSize?: string | number;
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
  PageNumber = 1,
  PageSize = 10,
  searchNameTerm = null,
  sortBy = 'createdAt',
  sortDirection = 'desc',
}: RequestUrlQueryType): RequestQueryType => {
  const page = +PageNumber;
  const pageSize = +PageSize;
  return {
    page,
    pageSize,
    searchNameTerm,
    sortBy,
    sortDirection,
  };
};
