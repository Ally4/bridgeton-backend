const formatPaginationResponse = ({ data, key }) => {
  return {
    [key || 'data']: data.docs,
    meta: {
      total: data.totalDocs,
      page: data.page,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
    },
  };
};

export default formatPaginationResponse;