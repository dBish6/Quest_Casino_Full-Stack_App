import { useState, useEffect } from "react";
import axios from "axios";

const GetAllQuests = () => {
  const [quests, setQuests] = useState([]);
  const [errorHandler, setErrorHandler] = useState({
    notFound: false,
    unexpected: false,
  });
  const [loading, toggleLoading] = useState(true);

  // Gets all users in Firestore DB.
  useEffect(() => {
    const fetchQuests = async () => {
      setErrorHandler({ notFound: false, unexpected: false });

      try {
        toggleLoading(true);
        const res = await axios({
          method: "GET",
          url: "http://localhost:4000/quest/api/firebase",
          validateStatus: (status) => {
            return status === 200 || status === 404; // Resolve only if the status code is 404 or 200
          },
        });
        console.log(res.data);
        if (res && res.status === 200) {
          setQuests(res.data);
        } else if (res && res.status === 404) {
          setErrorHandler({ notFound: true });
        }
      } catch (error) {
        setErrorHandler({ unexpected: true });
        console.error(error);
      } finally {
        toggleLoading(false);
      }
    };
    fetchQuests();
  }, []);

  return { quests, errorHandler, loading };
};

export default GetAllQuests;
