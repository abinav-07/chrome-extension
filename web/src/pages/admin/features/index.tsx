import React, { useState } from "react"
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
  Typography,
  message,
} from "antd"
import { useMutation, useQuery } from "react-query"
import {
  createFeatures,
  createUserFeatures,
  fetchFeatures,
  updateFeatures,
} from "../../../services"
import { Header } from "antd/lib/layout/layout"
import { fetchUsers } from "../../../services/users"

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: "number" | "text" | "select"
  record: any
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode = <Input />

  const {
    data: usersData,
    isLoading,
    isFetching,
  } = useQuery(["users"], () => fetchUsers(), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    enabled: true,
    cacheTime: 0,

    select: ({ data }) => {
      return {
        data: data?.map((values, i) => ({
          ...values,
          key: i,
        })),
      }
    },
  })

  if (dataIndex == "active" || dataIndex == "enabled") {
    inputNode = (
      <Select placeholder={dataIndex} loading={isLoading || isFetching}>
        <Select.Option value={true}>True</Select.Option>
        <Select.Option value={false}>False</Select.Option>
      </Select>
    )
  }

  if (dataIndex == "access") {
    inputNode = (
      <Select placeholder={dataIndex}>
        <Select.Option value={"none"}>None</Select.Option>
        <Select.Option value={"read"}>Read</Select.Option>
        <Select.Option value={"write"}>Write</Select.Option>
      </Select>
    )
  }

  if (dataIndex == "user_id") {
    inputNode = (
      <Select placeholder={dataIndex}>
        {usersData?.data?.map((user) => (
          <Select.Option value={user?.id}>{user?.first_name}</Select.Option>
        ))}
      </Select>
    )
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const FeatureList: React.FC = () => {
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [userFeatureCreateForm] = Form.useForm()
  const [editingKey, setEditingKey] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [userFeatureOpenModal, setUserFeatureOpenModal] = useState(false)

  const { data: usersData } = useQuery(["users"], () => fetchUsers(), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    enabled: true,
    cacheTime: 0,

    select: ({ data }) => {
      return {
        data: data?.map((values, i) => ({
          ...values,
          key: i,
        })),
      }
    },
  })

  const {
    data: featuresData,
    isLoading,
    isFetching,
    refetch: featuresRefetch,
  } = useQuery(["features"], () => fetchFeatures(), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    enabled: true,
    cacheTime: 0,

    select: ({ data }) => {
      return {
        data: data?.map((values, i) => ({
          ...values,
          key: i,
          active: Boolean(values?.active),
          enabled: Boolean(values?.enabled),
        })),
      }
    },
  })

  // Create New Features Mutation
  const { mutate: createFeature, isLoading: createLoading } = useMutation(createFeatures, {
    onSuccess: () => {
      setOpenModal(false)
      // Refetch features on successful creation
      featuresRefetch()
      message.open({
        type: "success",
        content: "Successfully Created Feature",
      })
    },
    onError: () => {
      message.open({
        type: "error",
        content: "Error when creating feature.",
      })
    },
  })

  // Create New Features Mutation
  const { mutate: createUserFeature, isLoading: createUserFeatureLoading } = useMutation(
    createUserFeatures,
    {
      onSuccess: () => {
        setUserFeatureOpenModal(false)
        // Refetch features on successful creation
        featuresRefetch()
        message.open({
          type: "success",
          content: "Successfully Created User Feature",
        })
      },
      onError: (err: any) => {
        message.open({
          type: "error",
          content: err?.response?.data?.message || "Error when creating User feature.",
        })
      },
    },
  )

  const { mutate: updateFeature, isLoading: updatingFeature } = useMutation(updateFeatures, {
    onSuccess: () => {
      // Reset Editing Key on success
      setEditingKey(null)
      // Refetch features on successful creation
      featuresRefetch()
      message.open({
        type: "success",
        content: "Successfully Updated",
      })
    },
    onError: (err: any) => {
      message.open({
        type: "error",
        content: err?.response?.data?.message || "Error while updating",
      })
    },
  })

  const isEditing = (record: any) => record.key === editingKey

  const edit = (record: Partial<any> & { key: React.Key }) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    form.resetFields()
    setEditingKey(null)
  }

  const save = async (key: React.Key) => {
    await form.validateFields()
    const formValues = form.getFieldsValue()

    const newData = [...featuresData?.data]
    const index = newData.findIndex((item) => key === item.key)
    const item = newData[index]

    updateFeature({ ...formValues, feature_id: item?.id })
  }

  const columns = [
    {
      title: "Feature id",
      dataIndex: "id",
      width: "20%",
    },
    {
      title: "Feature",
      dataIndex: "feature_name",
      width: "25%",
      editable: true,
    },
    {
      title: "User",
      dataIndex: "user_id",
      width: "15%",
      editable: true,
    },
    {
      title: "Active",
      dataIndex: "active",
      width: "15%",
      editable: true,
      render: (record: any) => {
        return record ? <Tag color="green">Active</Tag> : <Tag color="grey">InActive</Tag>
      },
    },
    {
      title: "access",
      dataIndex: "access",
      width: "40%",
      editable: true,
      render: (record: any) => {
        return record ? <Tag color="green">{record}</Tag> : "-"
      },
    },
    {
      title: "enabled",
      dataIndex: "enabled",
      width: "40%",
      editable: true,
      render: (record: any) => {
        return record ? <Tag color="green">True</Tag> : <Tag color="grey">False</Tag>
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const editable = isEditing(record)

        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography.Link disabled={editingKey !== null} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          </div>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === "active" ? "select" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}>
          <Row>
            <Col span={8} offset={12} style={{ textAlign: "end" }}>
              <Button onClick={() => setOpenModal(true)}>Create Feature</Button>
            </Col>
            <Col span={1} offset={1} style={{ textAlign: "end" }}>
              <Button onClick={() => setUserFeatureOpenModal(true)}>Create User Features</Button>
            </Col>
          </Row>
        </Header>
      </Layout>
      <Form form={form} component={false}>
        <h3>Create/Edit User Features </h3>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={featuresData?.data}
          columns={mergedColumns}
          loading={isLoading || isFetching}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>

      <Modal
        title="Create Feature"
        open={openModal}
        onOk={modalForm.submit}
        confirmLoading={createLoading}
        onCancel={() => {
          modalForm.resetFields()
          setOpenModal(false)
        }}
      >
        <Form form={modalForm} onFinish={createFeature}>
          <Form.Item
            label="Feature Name"
            name="feature_name"
            rules={[
              {
                required: true,
                message: `Please Input Feature Name!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Active Status"
            name="active"
            rules={[
              {
                required: true,
                message: `Please Select!`,
              },
            ]}
          >
            <Select placeholder="Is Active">
              <Select.Option value={true}>True</Select.Option>
              <Select.Option value={false}>False</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Create User Feature"
        open={userFeatureOpenModal}
        onOk={userFeatureCreateForm.submit}
        confirmLoading={createUserFeatureLoading}
        onCancel={() => {
          userFeatureCreateForm.resetFields()
          setUserFeatureOpenModal(false)
        }}
      >
        <Form form={userFeatureCreateForm} onFinish={createUserFeature}>
          <Form.Item
            label="Feature Name"
            name="feature_id"
            rules={[
              {
                required: true,
                message: `Please Input Feature Name!`,
              },
            ]}
          >
            <Select placeholder={"Features"}>
              {featuresData?.data?.map((feature) => (
                <Select.Option value={feature?.id}>{feature?.feature_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="User Name"
            name="user_id"
            rules={[
              {
                required: true,
                message: `Please Input Feature Name!`,
              },
            ]}
          >
            <Select placeholder={"Users"}>
              {usersData?.data?.map((user) => (
                <Select.Option value={user?.id}>{user?.first_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="access Status"
            name="access"
            rules={[
              {
                required: true,
                message: `Please Select!`,
              },
            ]}
          >
            <Select placeholder="Access type">
              <Select.Option value={"none"}>None</Select.Option>
              <Select.Option value={"read"}>Read</Select.Option>
              <Select.Option value={"write"}>Write</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Enabled Status"
            name="enabled"
            rules={[
              {
                required: true,
                message: `Please Select!`,
              },
            ]}
          >
            <Select placeholder="Is Enabled">
              <Select.Option value={true}>True</Select.Option>
              <Select.Option value={false}>False</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default FeatureList
