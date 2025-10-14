import { Link } from "react-router"
import { Button } from "~/components/ui/button"

const Home = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center gap-2'>
        <Link to={'/signup'}>
        <Button>Signup</Button></Link>
        <Link to={'/login'}>
        <Button>Login</Button></Link>
    </div>
  )
}

export default Home
