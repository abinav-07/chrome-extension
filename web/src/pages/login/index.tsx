import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Form, Input, Checkbox, Button, Divider, Image, Alert } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { LeftOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { parseJwt } from '../../utils';




const LoginUserPage = () => {

    const navigate = useNavigate();
    const onSubmit = (values) => {
        // loginUser(values, history));
    }

    //Redirect to Landing if already Logged In    
    useEffect(() => {
        if (parseJwt()) {
            navigate("/");
        }
    }, []);


    return (
        <>
            <Layout >
                <Header style={{ background: "#fff" }}>
                    <Row>
                        <Col span={8}>
                            <Button onClick={() => navigate("/")}><LeftOutlined />Back</Button>
                        </Col>
                        <Col span={8} offset={8} style={{ textAlign: "end" }}>
                            <Button><Link to="/register">CREATE ACCOUNT</Link></Button>
                        </Col>
                    </Row>
                </Header>
                <Content>
                    <Row justify="center" align="middle" className="main-content" style={{ flexDirection: "column", minHeight: "90vh" }}>
                        <Row>
                            <h2>Log in</h2>
                        </Row>
                        {/* {loggingErrorMsg && (
                            <Alert
                                type="error"
                                message={loggingErrorMsg}
                                closable
                            />
                        )} */}
                        <Row style={{ width: "100vw", paddingTop: "1rem" }}>
                            <Col md={{ span: 12 }} offset={6}>
                                <Form
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 8 }}
                                    name="loginForm"
                                    onFinish={onSubmit}
                                >
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, message: "Please Enter Email!" }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: "Please Enter Password!" }]}
                                    >
                                        <Input.Password
                                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                        >
                                        </Input.Password>
                                    </Form.Item>
                                    <Form.Item
                                        style={{ textAlign: "center" }}
                                        wrapperCol={{
                                            xs: { offset: 0, span: 8 },
                                            md: { offset: 8, span: 8 },
                                        }}
                                        name="logIn"
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            style={{ width: "50%" }}
                                        // loading={loggingUser}
                                        >Log In</Button>
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
export default LoginUserPage;