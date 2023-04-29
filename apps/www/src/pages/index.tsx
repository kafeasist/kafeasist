import type { RouterInputs } from "@kafeasist/api";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useSession } from "~/hooks/useSession";
import { api } from "~/utils/api";

interface FormProps {
  inputs: {
    id: string;
    label: string;
  }[];
  buttonName: string;
  handler: (data: unknown) => unknown;
}

const Form = ({ inputs, buttonName, handler }: FormProps) => {
  const { handleSubmit, register } = useForm();

  const onSubmit = (data: unknown) => handler(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-6 rounded-lg bg-gray-200 p-16"
    >
      <p className="mb-6 text-center text-xl uppercase">{buttonName}</p>
      {inputs.map(({ id, label }) => (
        <div key={id} className="flex flex-col space-y-2">
          <label htmlFor={id}>{label}</label>
          <input type="text" id={id} className="p-2" {...register(id)} />
        </div>
      ))}
      <button className="rounded-lg bg-gray-700 p-3 text-white" type="submit">
        {buttonName}
      </button>
    </form>
  );
};

const Home: NextPage = () => {
  const { session, setSession, status } = useSession();

  const register = api.auth.register.useMutation();
  const login = api.auth.login.useMutation();

  const registerInputs = [
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "email", label: "E-mail" },
    { id: "phone", label: "Phone" },
    { id: "password", label: "Password" },
    { id: "confirmPassword", label: "Confirm Password" },
  ];

  const loginInputs = [
    { id: "emailOrPhone", label: "E-mail or Phone" },
    { id: "password", label: "Password" },
  ];

  const handleRegister = async (data: unknown) => {
    type RegisterInputs = RouterInputs["auth"]["register"];

    const response = await register.mutateAsync(data as RegisterInputs);

    if (response.success) {
      console.log(response);
      setSession(response.session);
    } else console.log(response.message);
  };

  const handleLogin = async (data: unknown) => {
    type LoginInputs = RouterInputs["auth"]["login"];

    const response = await login.mutateAsync(data as LoginInputs);

    if (response.success) {
      console.log(response);
      setSession(response.session);
    } else console.log(response.message);
  };

  if (status === "loading") return <div>Loading...</div>;
  return (
    <main className="flex h-screen w-screen items-center justify-center space-x-8">
      {session ? "Logged in" : "Logged out"}
      <Form
        inputs={registerInputs}
        buttonName="Register"
        handler={handleRegister}
      />
      <Form inputs={loginInputs} buttonName="Login" handler={handleLogin} />
      {status}
    </main>
  );
};

export default Home;
