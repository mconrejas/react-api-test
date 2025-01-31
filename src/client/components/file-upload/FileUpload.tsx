import React from "react";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";

type ImageUploadProps = Omit<UploadProps, 'name' | 'onChange'> & {
  onUploadComplete?: (filename?: string) => void; // Return the file name
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  children,
  maxCount = 1, 
  action = "/api/file/upload",
  showUploadList,
  onUploadComplete, 
  ...rest
}) => {
  return (
    <Upload
      name="file"
      action={action}
      maxCount={maxCount}
      showUploadList={showUploadList}
      onChange={info => {
        console.log(info)
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);

          if ( onUploadComplete ) {
            const { response } = info.file;
            onUploadComplete(response.filename);
          }
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }}
      {...rest}
    >
      {children}
    </Upload>
  );
};

export default ImageUpload;
