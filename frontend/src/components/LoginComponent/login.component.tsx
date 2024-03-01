import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";

const Login = () => {
  const [state, setState] = useState({
    redirect: "",
    email: "",
    password: "",
    loading: false,
    message: "",
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      setState({ ...state, redirect: "/" });
    }
  }, []);

  useEffect(() => {
    return () => {
      window.location.reload();
    };
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = (formValue: { email: any; password: any; }) => {
    const { email, password } = formValue;

    setState((prevState) => ({
      ...prevState,
      message: "",
      loading: true,
    }));

    AuthService.login(email, password).then(
      () => {
        setState((prevState) => ({
          ...prevState,
          redirect: "/",
        }));
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setState((prevState) => ({
          ...prevState,
          loading: false,
          message: resMessage,
        }));
      }
    );
  };

  if (state.redirect) {
    return <Navigate to={state.redirect} />;
  }

  const { loading, message } = state;

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="text" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
