import { notification } from "antd";
import { ArgsProps } from "antd/es/notification/interface";

type NotificationType = "success" | "info" | "warning" | "error";

const useNotification = () => {
  const notify = (
    type: NotificationType,
    message: string,
    description?: string,
    options?: ArgsProps
  ) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
      ...options,
    });
  };

  return { notify };
};

export default useNotification;
