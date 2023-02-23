import LoadingAnimation from "components/LoadingAnimation";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

function BlankPage() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search);

  localStorage.setItem("key", keyword.get("token") as any);

  const navigate = useNavigate();

  useEffect(() => {
    if (keyword.get("hasRegistered") === "true") {
      navigate("/");
    } else {
      navigate("/signUp");
    }
  }, []);

  return (
    <div>
      <LoadingAnimation />
    </div>
  );
}

export default BlankPage;
