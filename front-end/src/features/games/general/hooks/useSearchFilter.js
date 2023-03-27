const useSearchFilter = () => {
  const searchFilter = (e, content) => {
    const results = content.filter((detail) => {
      if (e.target.value === "") return content;
      return detail.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    return results;
  };

  return searchFilter;
};

export default useSearchFilter;
