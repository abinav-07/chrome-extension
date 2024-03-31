import { Button, Layout, Table, Tag } from "antd"
import { SelectOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { getUserFeatures } from "../../services"



const UserFeatures: React.FC = () => {

    const navigate = useNavigate()

    const {
        data: userFeaturesData,
        isLoading,
        isFetching
    } = useQuery(
        ["getFeatures"],
        () => getUserFeatures(),
        {
            keepPreviousData: false,
            refetchOnWindowFocus: false,
            enabled: true,
            cacheTime: 0,

            select: ({ data }) => {
                return {
                    data: data?.map((values, i) => ({
                        ...values,
                        key: i,
                        id: values?.feature_id
                    })),
                }
            },
        }
    )

    const columns = [
        {
            title: 'Feature',
            dataIndex: 'feature_name',
            width: '25%',
            render: (_, record: any) => {
                return (record?.features?.feature_name)
            }
        },
        {
            title: 'Your Access',
            dataIndex: 'access',
            width: '40%',
            render: (record: any) => {
                return (record ? <Tag color='green' >{record}</Tag> : "-")
            }
        },
        {
            title: 'Is the Feature Enabled Currently?',
            dataIndex: 'enabled',
            width: '40%',
            render: (record: any) => {
                return (record ? <Tag color='green' >Yes</Tag> : <Tag color="grey" >No</Tag>)
            }
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_: any, record: any) => {

                return (
                    <span>
                        <Button icon={<SelectOutlined />} onClick={() => navigate(`/features/${record?.id}`)}>Go</Button>
                    </span>
                )
            },
        },
    ]

    return (
        <>
            <Layout>
                <Table
                    bordered
                    dataSource={userFeaturesData?.data}
                    columns={columns}
                    loading={isLoading || isFetching}
                    pagination={false}
                />


            </Layout>
        </>
    )
}

export default UserFeatures;