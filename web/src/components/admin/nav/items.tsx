import {
    UserOutlined,
    AndroidOutlined
} from '@ant-design/icons';

export const NavbarItems = [
    {
        name: "Features",
        key: "features",
        label: "Features",
        path: `/admin/features`,
        icon: <AndroidOutlined />
    },
    {
        name: "Members",
        key: "members",
        label: "Member",
        path: `/admin/members`,
        icon: <UserOutlined />
    },
]