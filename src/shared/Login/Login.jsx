import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";



const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logInUser, googleSignIn } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    logInUser(email, password)
      .then(result => {
        const user = result.user;
        console.log(user);

        form.reset();
        navigate(location?.state || '/');
      })
      .catch(error => {
        console.error(error.message);
      });


  };

  const handleLoginkWithGoogle = () => {
    googleSignIn()
      .then(result => {
        const user = result.user;
        console.log(user);
        navigate(location?.state || '/');
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Login Now</h1>
          <form onSubmit={handleLogin} className="form-control w-full space-y-3">
            <div>
              <label className="label font-medium">Email</label>
              <input type="email" name="email" required placeholder="Enter your email" className="input border border-[#8A4771] w-full" />
            </div>

            <div>
              <label className="label font-medium">Password</label>
              <input type="password" name="password" required placeholder="Enter your password" className="input border border-[#8A4771] w-full" />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-red-500 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              // disabled={loading}
              className="btn btn-block bg-white text-[#5F2DED] font-bold border border-[#5F2DED] hover:bg-[#5F2DED] hover:text-white transition duration-200">
              Log In
            </button>

            <p className="text-sm text-center">
              New to this site?{" "}
              <Link to="/register" className="text-[#5F2DED] font-semibold underline hover:no-underline">
                Register here
              </Link>
            </p>
          </form>

          <div className="divider">OR</div>

          <button onClick={handleLoginkWithGoogle} className="btn btn-block bg-white text-black border border-[#e5e5e5] hover:shadow-md transition duration-200">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <g>
                <path d="M0 0H512V512H0" fill="#fff" />
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
              </g>
            </svg>
            <span className="ml-2">Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
