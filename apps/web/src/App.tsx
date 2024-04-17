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

import "./index.css";

import { Button } from "@components/common/button";

function App() {
  return (
    <>
      <Button intent="primary" size="lrg" className="test1">
        Hello
      </Button>
      <br />
      <Button intent="primary" size="md" className="test2" asChild>
        <a href="#">Link</a>
      </Button>
      <br />
      <p>Helioda skj ka gfgjlad asdk jgasm igjfdsi krotktahl spdfl!</p>
    </>
  );
}

export default App;
