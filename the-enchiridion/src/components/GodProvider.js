import { AuthProvider } from "./auth/AuthProvider";

export const GodProvider = (props) => {
  return (
    <>
      <AuthProvider>
        {props.children}
      </AuthProvider>
    </>
  );
};