import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { DatePicker, Form, Input, message, Modal, Select, Table } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import Spinner from "../components/Layout/Spinner";
import axios from "axios";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;
const HomePage = () => {
  const [form] = Form.useForm();
  const [showModal, setshowModel] = useState(false);
  const [loading, setloading] = useState(false);
  const [alltransaction, setalltransaction] = useState([]);
  const [filter, setfilter] = useState("7");
  const [refresh, setRefresh] = useState(false); // State to trigger useEffect
  const [selectdate, setselectdate] = useState([]);
  const [type, settype] = useState("all");
  const [viewdata, setviewdata] = useState("table");
  const [editable, seteditable] = useState(null);
  // table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              seteditable(record);
              setshowModel(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handledelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // GET ALL transactions

  // useeffect hook
  useEffect(() => {
    const getalltransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setloading(true);
        const res = await axios.post("/transactions/get-transaction", {
          userid: user._id,
          filter,
          selectdate,
          type,
        });
        setloading(false);
        setalltransaction(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("fetch issue");
        setloading(false);
      }
    };
    getalltransaction();
  }, [filter, refresh, selectdate, type]);

  // delete handler
  const handledelete = async (record) => {
    try {
      setloading(true);
      await axios.post("/transactions/delete-transaction", {
        transactionId: record._id,
      });
      setRefresh(!refresh);
      setloading(false);
      message.success("Delete successfull");
    } catch (error) {
      setloading(false);
      console.log(error);
      message.error("Unable to delete");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setloading(true);
      if (editable) {
        await axios.post("/transactions/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id,
        });
        setloading(false);

        message.success("Edit successfull");
      } else {
        await axios.post("/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        setloading(false);

        message.success("transaction successfull");
      }

      form.resetFields();
      setRefresh(!refresh); // Toggle refresh state
      setshowModel(false);
      seteditable(null);
    } catch (error) {
      setloading(false);
      setshowModel(false);
      console.log(error);
      message.error("Failed to add ");
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Filters</h6>
          <Select value={filter} onChange={(values) => setfilter(values)}>
            <Select.Option value="7">1 Week</Select.Option>
            <Select.Option value="30">1 Month</Select.Option>
            <Select.Option value="365">1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {filter === "custom" && (
            <RangePicker
              value={selectdate}
              onChange={(values) => setselectdate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => settype(values)}>
            <Select.Option value="all">All Type</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
        </div>
        <div className="switchicon">
          <UnorderedListOutlined
            className={` mx-2 ${
              viewdata === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setviewdata("table")}
          />

          <AreaChartOutlined
            className={`mx-2 ${
              viewdata === "analytics" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setviewdata("analytics")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setshowModel(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewdata === "table" ? (
          <Table columns={columns} dataSource={alltransaction} />
        ) : (
          <Analytics alltransaction={alltransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Trasaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setshowModel(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
          form={form}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input amount!",
              },
            ]}
          >
            <Input type="Number" />
          </Form.Item>
          <Form.Item
            label="type"
            name="type"
            rules={[
              {
                required: true,
                message: "Please input type!",
              },
            ]}
          >
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Please input  category!",
              },
            ]}
          >
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="bonus">Bonus</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fees</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <FormItem
            label="Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please input date!",
              },
            ]}
          >
            <Input type="date" />
          </FormItem>
          <FormItem
            label="Reference"
            name="reference"
            rules={[
              {
                required: true,
                message: "Please input  reference!",
              },
            ]}
          >
            <Input type="text" />
          </FormItem>
          <FormItem
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input description!",
              },
            ]}
          >
            <Input type="text" />
          </FormItem>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" type="submit">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
