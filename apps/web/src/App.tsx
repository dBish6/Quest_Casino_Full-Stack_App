/**
 * Quest Casino Web (front-end)
 * Version: 2.0.0-pre
 *
 * Author: David Bishop
 * Creation Date: April 16, 2024
 * Last Updated: April 16, 2024
 *
 * Description:
 * .
 *
 * Features:
 *  -
 *
 * Change Log (Not yet, when it's released it would be):
 * The log is in the changelog.txt file at the base of this web directory.
 */

import HistoryProvider from "@utils/History";
import RoutesProvider from "@routes/index";

import "./index.css";

function App() {
  // console.log("env", import.meta.env.MODE);

  return (
    <>
      <HistoryProvider />
      <RoutesProvider />
    </>
  );
}

export default App;
