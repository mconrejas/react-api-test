import React, { useEffect, useMemo, useState } from "react";
import { Form, Modal, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";

import { Referral } from "../../../types/referrals";
import { RootState } from "../../store";
import { useReferrals } from "../../hooks";
import styles from './referralForm.module.scss';
import Input from "../input";
import CountryCodeSelector from "../country-code-selector";
import FileUpload from "../file-upload/FileUpload";

const ReferralForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | undefined>();
  const [form] = Form.useForm();

  const selectedReferral = useSelector((state: RootState) => state.referrals.selectedReferral);

  const { createReferral, updateReferral, setReferralById } = useReferrals();

  const onFinish = async (values: Referral) => {
    const formData = {
      ...values,
      phone: Number(values.phone), // Ensure `phone` is a number
      avatar
    };

    if (selectedReferral) {
      await updateReferral({ id: selectedReferral.id, formData }, {
        onSuccess: () => handleClose(),
      });
      return;
    }

    await createReferral(formData, {
      onSuccess: () => handleClose(),
    })
  };

  const handleUploadComplete = (v?: string) => setAvatar(v);

  const handleClose = () => {
    setReferralById(null);
    setIsModalOpen(false);
    setAvatar(undefined);
    form.resetFields();
  };

  const prefixSelector = useMemo(() => (
    <Form.Item 
      name="prefix"
      rules={[{ required: true, message: "Please select a prefix!" }]}
      noStyle
    >
      <CountryCodeSelector style={{ width: 100 }} value={selectedReferral?.prefix} />
    </Form.Item>
  ), [selectedReferral]);

  useEffect(() => {
    if (selectedReferral) {
      form.setFieldsValue(selectedReferral);
    }
  }, [selectedReferral, form]);

  return (
    <>
      {/* Add Referral Button */}
      <Button
        type="primary"
        icon={<FiPlus />}
        onClick={() => setIsModalOpen(true)}
        style={{ height: '37px', padding: '15px 20px' }}
      />

      <Modal
        title={<h2 className="text-3xl font-bold">Referral Builder</h2>}
        open={isModalOpen || !!selectedReferral}
        onCancel={handleClose}
        width={700}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          name="referral-builder"
          onFinish={onFinish}
          scrollToFirstError
        >
          {/* Personal Details Section */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                type="text"
                name="first_name"
                label="Given Name"
                className={`p-2 ${styles.input}`}
                rules={[
                  {
                    required: true,
                    message: 'Given name is required!',
                  },
                ]}
              />

              <Input
                type="text"
                name="last_name"
                label="Surname"
                className={`p-2 ${styles.input}`}
                rules={[
                  {
                    required: true,
                    message: 'Surname is required!',
                  },
                ]}
              />

              <Input
                type="email"
                name="email"
                label="Email"
                className={`p-2 ${styles.input}`}
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not a valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'E-mail is required!',
                  },
                ]}   
              />

              <Input
                type="phone"
                name="phone"
                label="Phone"
                className={`${styles.phone}`}
                addonBefore={prefixSelector} 
                style={{ width: '100%' }}
                rules={[
                  {
                    required: true,
                    message: 'Phone is required!',
                  },
                  { 
                    pattern: /^[0-9]{10,11}$/, 
                    message: "Enter a valid 10-digit phone number!" 
                  }
                ]}
              />
            </div>
          </section>

          {/* Address Section */}
          <section className="mb-7">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
              Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input 
                type="text" 
                label="Home Name or #"
                className={`p-2 ${styles.input}`}
                name="home_name"
              />
              <Input
                type="text"
                label="Street"
                className={`p-2 ${styles.input}`}
                name="street"
              />
              <Input
                type="text"
                label="Suburb"
                className={`p-2 ${styles.input}`}
                name="suburb"
              />
              <Input
                type="text"
                label="State"
                className={`p-2 ${styles.input}`}
                name="state"
              />
              <Input
                type="text"
                label="Postcode"
                className={`p-2 ${styles.input}`}
                name="postcode"
              />
              <Input
                type="text"
                label="Country"
                className={`p-2 ${styles.input}`}
                name="country"
              />
            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-4 pb-3">
            {/* Upload Avatar Button */}
            <FileUpload
              onUploadComplete={handleUploadComplete}
              beforeUpload={file => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error(`${file.name} is not a valid image file.`);
                }
        
                const isSmallEnough = file.size / 1024 / 1024 < 2; // Max size=2MB
                if (!isSmallEnough) {
                  message.error(`${file.name} is larger than 2MB.`);
                }
                
                return isImage && isSmallEnough; // Only allow upload if both conditions are met
              }}
            >
              <Button
                icon={<UploadOutlined />}
                className="font-semibold py-5 px-6 rounded w-1/2 shadow-sm uppercase"
              >
                Click to Upload
              </Button>
            </FileUpload>

            {/* Create Referral Button */}
            <Button
              type="primary"
              htmlType="submit"
              className={`font-semibold py-3 px-6 rounded w-1/2 shadow-sm uppercase ${styles.button} ${styles.create}`}
            >
              Create Referral
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ReferralForm;
