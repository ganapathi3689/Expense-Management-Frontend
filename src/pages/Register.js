import React, { useEffect, useState } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Layout/Spinner";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  // form submit
  const submitHandler = async (values) => {
    try {
      console.log(values);
      setloading(true);
      await axios.post("/users/register", values);
      message.success("Registration Successfull");
      setloading(false);
      navigate("/login");
    } catch (error) {
      setloading(false);
      console.log(error);
      message.error("invalid details");
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
          <h1>Register Form</h1>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
          <div className="d-flex justify-content flex-column">
            <Link to="/login">Already Registered? Click here to login </Link>
            <br />
            <button className="btn btn-primary"> Register</button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
