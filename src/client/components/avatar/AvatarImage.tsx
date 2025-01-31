import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import type { AvatarProps } from 'antd/lib/avatar';

type AvatarImageProps = Omit<AvatarProps, 'icon'>;

const AvatarImage: React.FC<AvatarImageProps> = (props) => <Avatar icon={<UserOutlined />} {...props} />;

export default AvatarImage;