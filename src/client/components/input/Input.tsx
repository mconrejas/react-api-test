import React from "react";
import { Input as AntdInput, Form } from "antd";
import type { InputProps } from "antd/lib/input";
import type { FormItemProps } from "antd/lib/form";
import styles from './input.module.scss'

type InputFieldProps = InputProps & Omit<FormItemProps, "children">;

const Input: React.FC<InputFieldProps> = (props) => {
  {/* Extract FormItemProps and exclude `className` from props */}
  const { className, ...formItemProps } = props as FormItemProps;

  {/* Extract InputProps from props */}
  const { ...inputProps } = props as InputProps;

  return (
    <Form.Item {...formItemProps} className={styles.formItem}>
      <AntdInput {...inputProps} />
    </Form.Item>
  );
};

export default Input;
