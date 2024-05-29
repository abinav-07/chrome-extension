import React, { useState } from "react"
import {
  Carousel,
  Form,
  Layout,
  Popconfirm,
  Table,
  TableColumnsType,
  Typography,
  message,
} from "antd"
import { useMutation, useQuery } from "react-query"
import {
  fetchFeatures,
  updateFeatures,
} from "../../../services"
import { Header } from "antd/lib/layout/layout"



const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79"
};

const FeatureList: React.FC = () => {
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState(null)


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
      data.forEach(page => {
        const imageValues = page?.page_features?.filter(item => item.type === 'image').map(item => item.value);
        const combinedImageObject = {
          type: 'image',
          value: imageValues.flat(),
        };

        const result = page?.page_features?.filter(item => item.type !== 'image').concat(combinedImageObject);
        page.page_features = result
      });
      return {
        data: data?.map((values, i) => ({
          ...values,
          key: i,
        })),
      }
    },
  })

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
    setEditingKey(record.key)
  }

  const cancel = () => {
    form.resetFields()
    setEditingKey(null)
  }

  const expandedRowRender = (row) => {

    const columns: TableColumnsType<any> = [

      {
        title: 'Product Name', dataIndex: 'title', key: 'title',
        width: 200,
        render: (text) => text || '-',
        fixed: 'left',
      },
      {
        title: 'Date', dataIndex: 'created_at', key: 'date',
        width: 130,
        render: (_: any, record: any) => `${new Date(record?.created_at).toISOString().split('T')[0]}`
      },
      {
        title: 'Brand', dataIndex: 'brand', key: 'brand',
        width: 150,
        render: (_: any, record: any) => `${record?.brand || record?.category || "-"}`

      },
      {
        title: 'Price', dataIndex: 'price', key: 'price',
        width: 150,
        render: (text) => text || '-',
      },
      {
        title: 'Description', dataIndex: 'description', key: 'description',
        width: 400,
        render: (_: any, record: any) => {
          return (
            <>

              {record?.description || record?.detail || record?.facts || "-"}

            </>
          )

        },
      },
      {
        title: 'Images', dataIndex: 'image', key: 'image',
        width: 300,
        render: (key) => {
          return (
            <Carousel style={{ width: '100%', maxWidth: '200px' }}>
              {key?.map((img: any, index: any) => {
                return (
                  <div key={index} >
                    <img src={img} key={index} width={200} height={200} />
                  </div>
                )
              })}
            </Carousel>
          )
        }
      },
    ];

    const transformedData = row?.page_features?.reduce((acc: any, item: any) => {

      acc[item.type] = item.value;

      if (item.created_at) {
        acc.created_at = item.created_at;
      }

      return acc;
    }, {});

    return (
      <Table
        bordered columns={columns} dataSource={[transformedData]} pagination={false} />


    )
  }


  const columns = [
    {
      title: "Page id",
      dataIndex: "id",
      width: "20%",
    },
    {
      title: "Page Name",
      dataIndex: "url",
      width: "25%",
      render: (_: any, record: any) => {
        const domain = record?.url ? (new URL(record?.url))?.hostname : "-";
        const name = domain.split('.')[1];
        return <>
          <a href={record?.url} target="_blank">{name}: {record?.page_features?.filter(el => el?.type == "title")?.[0]?.value}</a>
        </>
      }
    },
    {
      title: "Page Domain",
      dataIndex: "url",
      width: "25%",
      render: (_: any, record: any) => {
        const domain = record?.url ? (new URL(record?.url))?.hostname : "-";

        return <>
          {domain}
        </>
      }
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const editable = isEditing(record)

        return editable ? (
          <div style={{ display: "flex" }}>
            <div>
              <Typography.Link onClick={() => console.log(record.key)} style={{ display: "flex", marginRight: 8, color: "red", inlineSize: "max-content" }}>
                Confirm
              </Typography.Link>
            </div>
            <div>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography.Link disabled={editingKey !== null} onClick={() => edit(record)}>
              Delete
            </Typography.Link>
          </div>
        )
      },
    },
  ]



  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}>
          <h3>Page and their Features </h3>
        </Header>
      </Layout>
      <Form form={form} component={false}>
        <Table
          bordered
          expandable={{ expandedRowRender }}
          dataSource={featuresData?.data}
          columns={columns}
          loading={isLoading || isFetching || updatingFeature}
          pagination={false}
        />
      </Form>
    </>
  )
}

export default FeatureList
