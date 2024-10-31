import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from "axios";
import zxcvbn from 'zxcvbn';

type tFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Form: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<tFormData>();

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? `${process.env.PUBLIC_URL}/register-user`
      : "http://localhost:5173"; 

  const mutation = useMutation({
    mutationFn: async (data: tFormData) => {
      const response = await axios.post(`${apiUrl}/`, data);
      return response.data;
    }, 
    onSuccess: () => {
      reset(); // Reset form fields
      console.log("Registration successful!");
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as { message?: string })?.message;

      if (message) {
        console.log(`Error: ${message}`);
      } else {
        console.log("An unexpected error occurred.");
      }
    },
  });

  const onSubmit: SubmitHandler<tFormData> = (data) => {
    mutation.mutate(data);
  };

  const password = watch("password");
  const { score: passwordStrength, feedback } = zxcvbn(password || "");

  if (mutation.isSuccess) {
    return (
      <div className="text-center">
        <h2 className="mb-5 text-2xl font-semibold">Registration successful!</h2>
        <button
          className="nline-flex items-center text-blue-500 transition-colors duration-300 hover:text-blue-700"
          onClick={() => mutation.reset()}
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-5 text-2xl font-semibold text-center">Create Your Account</h2>

      <form
        key={mutation.isSuccess ? 'form-success' : 'form'}
        className="mx-auto grid gap-2 max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-3">
          <label htmlFor="name" className="mb-1 block">Name</label>
          <input
            id="name"
            autoComplete="name"
            className="w-full py-1 px-2 border border-gray-700 rounded-md" 
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="mb-1 block">Email</label>
          <input
            id="email"
            autoComplete="email"
            className="w-full py-1 px-2 border border-gray-700 rounded-md" 
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              }
            })}
          />
          {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="mb-1 block">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="password"
            className="w-full py-1 px-2 border border-gray-700 rounded-md"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: "Password must contain at least one letter and one number",
              },
            })}
          />
          {errors.password && <span className="text-red-600 text-xs">{errors.password.message}</span>}

          {passwordStrength > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className={`inline-block w-2 h-2 rounded-full ${passwordStrength < 2 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <div className="text-xs">
                  {passwordStrength < 2 ? 'Weak' : passwordStrength === 2 ? 'Strong' : 'Very strong'} password
                </div>
              </div>
              <p className="mt-2 text-xs">{feedback.suggestions.join(' ')}</p>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="mb-1 block">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="confirmPassword"
            className="w-full py-1 px-2 border border-gray-700 rounded-md"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: value => value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <span className="text-red-600 text-xs">{errors.confirmPassword.message}</span>}
        </div>

        <div className="mt-5 text-center">
          <input
            type="submit"
            value="Register"
            className={`px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer transition-colors duration-300 hover:bg-blue-700`}
          />
        </div>
      </form>
    </>
  );
}
