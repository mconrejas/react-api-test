import { Modal } from "antd";

type ConfirmParams = {
  title?: string;
  content?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  type?: "info" | "success" | "error" | "warning";
};

const useConfirm = () => {
  return ({
    title = "Are you sure?",
    content = "This action cannot be undone.",
    onConfirm,
    onCancel,
    okText = "Yes",
    cancelText = "Cancel",
    type = "warning",
  }: ConfirmParams) => {
    Modal.confirm({
      title,
      content,
      onOk: onConfirm,
      onCancel,
      okText,
      cancelText,
      centered: true,
      icon: null,
      okButtonProps: { danger: type === "error" }, // Make "OK" button red for errors
    });
  };
};

export default useConfirm;
