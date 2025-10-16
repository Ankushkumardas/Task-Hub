import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const Home = () => {
  return (
    <div className="w-full h-screen ">
      <div className="container mx-auto flex  items-centen justify-between py-2">
        <p>Hello</p>
        <div className=" flex gap-2 mr-2">
          <Link to={"/signup"}>
            <Button>Signup</Button>
          </Link>
          <Link to={"/login"}>
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
