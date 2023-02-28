import Router from "components/Router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function App() {
  return (
    <>
      <Router />
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
