import { useDispatch, useSelector } from "react-redux";
import {
  updateFormField,
  loginStart,
  signupStart,
  // setAuthMode,
  // setNext,
} from "../../../store/features/authSlice";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import FormButton from "./FormButton";
import bgImage from "../../../assets/register.png";
import PrevButton from "./PrevButton";
import FormHeader from "./FormHeader";

export default function AuthForm() {
  const dispatch = useDispatch();

  const { mode, formValues, nextState } = useSelector((state) => state.auth);

  const handleChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(loginStart(formValues));
    } else {
      dispatch(signupStart(formValues));
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center py-[80px]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-[502px] flex flex-col justify-center items-center rounded-[20px] bg-white p-6 gap-y-[12px] shadow-lg"
      >

        <FormHeader mode={mode} />

        {/* Dynamic Form */}
        {mode === "login" ? (
          <LoginPage values={formValues} onChange={handleChange} />
        ) : (
          <SignupPage values={formValues} onChange={handleChange} />
        )}

        <div className="w-full flex items-center  gap-x-[10px]">
          <PrevButton classes={`!cursor-pointer ${(nextState && mode == "signup") ? "flex" : "hidden"}`} />
          <FormButton nextState={nextState} submit={handleSubmit} />
        </div>

      </form>
    </div>
  );
}


