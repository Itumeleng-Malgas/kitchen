// iconMap.ts
import type { ReactNode } from "react";
import {
  HomeOutlined,
  RiseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { MenuDataItem } from "@ant-design/pro-components";

export type IconMap = Record<string, ReactNode>;

export const iconMap: IconMap = {
  HomeOutlined: <HomeOutlined />,
  SettingOutlined: <SettingOutlined />,
  Analytics: <RiseOutlined />,
};

export const mapMenuIcons = (menuData: MenuDataItem[]): MenuDataItem[] =>
  menuData.map(item => ({
    ...item,
    icon:
      typeof item.icon === 'string'
        ? iconMap[item.icon] ?? item.icon
        : item.icon,
    children: item.children ? mapMenuIcons(item.children) : undefined,
  }));