import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import config from "../../config/config.js";
import toast from "react-hot-toast";

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const [signature, setSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("department", data.department);
    formData.append("designation", data.designation);
    formData.append("role", data.role);
    formData.append("password", data.password);
    
    // Only append signature if it exists
    if (signature) {
      formData.append("signature", signature);
    }

    try {
      const response = await axios.post(`${config.serverUrl}/users/register`, formData,
        {headers: {"Content-Type": "multipart/form-data"}, withCredentials: true
      })

      toast.success(response.data.message);
      // Reset form after successful registration
      reset();
      setSignature(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      toast.error("Registration Failed");
      console.log("failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");

  return (
      <div className="pt-6 pb-6 flex items-center justify-center mt-3">
        <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-8 w-150 ">
          <h2 className="text-2xl font-semibold text-center text-black mb-6">Register New User</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 4, message: "Minimum 4 characters required" },
                })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Choose a username"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full Name is required" })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { 
                    value: /^\S+@\S+$/i, 
                    message: "Invalid email format" 
                  },
                })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                {...register("department", { required: "Department is required" })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your department"
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                {...register("designation", { required: "Designation is required" })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your designation"
              />
              {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                {...register("role", { required: "Role is required" })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Role</option>
                {/* <option value="register">Registrar</option>
                <option value="manager">Manager</option> */}
                <option value="deptAdmin">Dept Admin</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Signature Upload - Now Optional */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Upload Signature (Optional):</label>
              <input
                type="file"
                accept="image/*"
                {...register("signature")}
                onChange={(e) => setSignature(e.target.files[0])}
                className="w-full p-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : "Register"}
            </button>
          </form>
        </div>
      </div>
    
  );
};

export default RegistrationForm;
