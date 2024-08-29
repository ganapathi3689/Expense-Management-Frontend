import React, { useEffect, useState } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Layout/Spinner";

const Login = () => {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const submitHandler = async (values) => {
    try {
      setloading(true);
      const { data } = await axios.post("/users/login", values);
      setloading(false);
      message.success("login Success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      setloading(false);
      message.error("Something is wrong");
    }
  };
  // prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="register-page ">
        {loading && <Spinner />}
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Login Form</h1>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="d-flex  justify-content-between flex-column  ">
            <Link to="/register">Not Registered? Click here to Register </Link>
            <br />
            <button className="btn btn-primary  "> Login</button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
