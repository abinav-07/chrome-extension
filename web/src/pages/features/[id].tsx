import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"

import { useParams } from "react-router-dom"

const UserFeature: React.FC = () => {
  const { id } = useParams()

  return (
    <>
      <Layout>
        <Content>
          <h2>This is Feature {id}</h2>
        </Content>
      </Layout>
    </>
  )
}

export default UserFeature
