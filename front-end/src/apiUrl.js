const apiURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_REST_API_URL_PROD
    : process.env.REACT_APP_REST_API_URL_DEV;

export default apiURL;
