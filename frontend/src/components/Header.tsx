import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between p-4 bg-gray-900 text-white">
      <Link to="/" className="text-xl font-bold">Exhibition App</Link>
      <nav className="flex items-center gap-4">
      <Link to="/temporary-collection" className="px-4 py-2 bg-gray-700 text-white rounded">
         Temporary Collection</Link>  
        {user ? (
          <>
            <Link to="/profile" className="hover:underline">My Collections</Link>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-700">
              Logout
            </button>
          </>
       ) : (
           <>
          <Link to="/login" className="hover:underline">Login</Link>
          </>
        )} 
          
          <Link to="/register" className= "hover/underline">Register</Link>
        
      </nav>
    </header>
  );
};

export default Header;

