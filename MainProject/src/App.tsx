import { Global } from "@emotion/react";
import LoginPage from "./components/LoginPage";
import { globalStyles } from "./styles/Global";

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <LoginPage />
    </>
  );
}

export default App;
