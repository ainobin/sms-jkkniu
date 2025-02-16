import React from 'react'
import { useForm } from 'react-hook-form';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
      const onSubmit = (data) => {
        console.log(data);
      };
    
      return (
        <div className="flex items-center justify-center">
          <div className=" p-8 rounded-lg shadow-lg w-100">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* UserName Input */}
              <div>
                <input
                  type="username"
                  placeholder="username"
                  {...register("username", { required: "username is required" })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>
              {/* Password Input */}
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
    
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      );
}