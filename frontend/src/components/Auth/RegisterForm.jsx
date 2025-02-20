import { useForm } from "react-hook-form";
import { useState } from "react";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [signature, setSignature] = useState(null);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    console.log("Signature:", signature);
  };

  return (
    <div className="pt-2 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-150">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* username Field */}
          <div>
            <input
              type="text"
              placeholder="username"
              {...register("username", { required: "username is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          {/* Name Field */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          {/* Depertment Field */}
          <div>
            <input
              type="text"
              placeholder="Depertment"
              {...register("depertment", { required: "depertment is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.depertment && (
              <p className="text-red-500 text-sm mt-1">{errors.depertment.message}</p>
            )}
          </div>
          {/* Designation Field */}
          <div>
            <input
              type="text"
              placeholder="Designation"
              {...register("designation", { required: "Designation is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>
            )}
          </div>
          {/* Role Dropdown */}
          <div>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Role</option>
              <option value="register">Register</option>
              <option value="manager">Manager</option>
              <option value="deptAdmin">Dept Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>
          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Signature Upload */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Upload Signature:</label>
            <input
              type="file"
              accept="image/*"
              {...register("signature", { required: "Signature is required" })}
              onChange={(e) => setSignature(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.signature && (
              <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
