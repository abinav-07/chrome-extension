import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Layout, { Header, Content } from "antd/lib/layout/layout"
import { Row, Col, Form, Input, Button } from "antd"
import { LeftOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { parseJwt } from "../../utils"

const RegisterUserPage = () => {
  const history = useNavigate()

  const onSubmit = (values) => {
    const formValues = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.registerEmail,
      password: values.registerPassword,
      confirm_password: values.registerConfirmPassword,
    }
  }

  //Redirect to Landing if already Logged In
  useEffect(() => {
    if (parseJwt()) {
      history("/")
    }
  })

  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}>
          <Row>
            <Col xs={{ span: 2 }} md={{ span: 8 }}>
              <Button onClick={() => history("/")}>
                <LeftOutlined />
                Back
              </Button>
            </Col>
            <Col
              xs={{ span: 4, offset: 6 }}
              md={{ span: 8, offset: 8 }}
              style={{ textAlign: "end" }}
            >
              <Button>
                <Link to="/login">Already have an account? Log In</Link>
              </Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <Row
            justify="center"
            align="middle"
            className="main-content"
            style={{ flexDirection: "column", minHeight: "90vh" }}
          >
            <Row>
              <h2>Sign Up</h2>
            </Row>
            {/* {registerErrorMsg && (
                            <Alert
                                message={registerErrorMsg}
                                type="error"
                                closable
                            />
                        )} */}
            <Row
              gutter={24}
              style={{
                width: "100%",
                paddingTop: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Col md={{ span: 8 }}>
                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} onFinish={onSubmit}>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "Please Enter Your First Name!" }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "Please Enter Your Last Name!" }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="registerEmail"
                    rules={[{ required: true, message: "Please Enter Email!" }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="registerPassword"
                    rules={[{ required: true, message: "Please Enter Password!" }]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    ></Input.Password>
                  </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="registerConfirmPassword"
                    rules={[{ required: true, message: "Please Enter Password!" }]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    ></Input.Password>
                  </Form.Item>
                  <Form.Item
                    name="signUp"
                    wrapperCol={{
                      xs: { offset: 0, span: 8 },
                      md: { offset: 8, span: 8 },
                    }}
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "50%" }}
                      // loading={registeringUser}
                    >
                      Sign Up
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Row>
        </Content>
      </Layout>
    </>
  )
}

export default RegisterUserPage
