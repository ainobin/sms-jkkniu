import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isloding, setIsLoading] = useState(false);

  const {setUser} = useContext(UserContext);
  const { setIsLoggedIn } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true); // ✅ Fixed Typo: setIsLoding -> setIsLoading

        const response = await axios.post(
            "http://localhost:3000/api/v1/users/login",
            {
                username: formData.username,
                password: formData.password,
            },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );

        if (response.data) {
          setUser({
              id: response.data.data._id,
              fullName: response.data.data.fullName,
              email: response.data.data.email,
              department: response.data.data.department,
              designation: response.data.data.designation,
              role: response.data.data.role,
              signature: response.data.data.signature,
          });
          setIsLoggedIn(true); // ✅ Set login state
      }

      // console.log("Response: ", response.data?.data.role);
      alert(response.data.message);
      // window.location.reload();
      if (response.data?.data.role === "deptAdmin") {
        navigate("/store-manager");
      }
    } catch (error) {
      setIsLoading(false);
      alert("Login Failed");
      console.log("failed: ", error);
    }
  };

  return (
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-8 w-3xl max-w-md ">
          <h2 className="text-2xl font-semibold text-center text-black mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">username</label>
              <input
                type="username"
                {...register("username", {
                  required: "username is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters required"
                  }
                })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isloding}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500"
            >
              {isloding ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
