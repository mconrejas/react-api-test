import React from "react";
import { Table, Button, Input } from "antd";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import type { ColumnsType } from "antd/es/table";

import { ReferralWithId } from "../../../types/referrals";
import { RootState } from "../../store";
import { useReferrals, useConfirm } from "../../hooks";
import ReferralForm from "../referral-form";
import AvatarImage from "../avatar";

const ReferralTable: React.FC = () => {
  const { isLoadingReferrals, isDeletingReferral, setReferralById, deleteReferral } = useReferrals();
  const confirm = useConfirm();
  const referrals = useSelector((state: RootState) => state.referrals.data);

  // Table columns
  const columns: ColumnsType<ReferralWithId> = [
    {
      title: "Name",
      key: "name",
      dataIndex: ["first_name", "last_name"],
      sorter: (a: ReferralWithId, b: ReferralWithId) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      render: (_: any, record: ReferralWithId) => (
        <div className="flex items-center gap-3">
          <AvatarImage src={record.avatar ? `/uploads/${record.avatar}` : null} />
          <span>{`${record.first_name} ${record.last_name}`}</span>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
        const debounceSearch = debounce((value: string) => {
          setSelectedKeys(value ? [value] : []);
          confirm();
        }, 300);
  
        return (
          <div className="p-4">
            <Input
              placeholder="Search Name"
              defaultValue={selectedKeys[0]}
              onChange={(e) => debounceSearch(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={clearFilters} size="small">
                Reset
              </Button>
            </div>
          </div>
        );
      },
      onFilter: (value: any, record: ReferralWithId) => {
        const fullName = `${record.first_name} ${record.last_name}`.toLowerCase();
        return typeof value === "string" && fullName.includes(value.toLowerCase());
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: ReferralWithId, b: ReferralWithId) => a.email.localeCompare(b.email),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
        const debounceSearch = debounce((value: string) => {
          setSelectedKeys(value ? [value] : []);
          confirm();
        }, 300);
  
        return (
          <div className="p-4">
            <Input
              placeholder="Search Email"
              defaultValue={selectedKeys[0]}
              onChange={(e) => debounceSearch(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={clearFilters} size="small">
                Reset
              </Button>
            </div>
          </div>
        );
      },
      onFilter: (value: any, record: ReferralWithId) => {
        return typeof value === "string" && record.email.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a: ReferralWithId, b: ReferralWithId) => a.phone - b.phone,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
        const debounceSearch = debounce((value: string) => {
          setSelectedKeys(value ? [value] : []);
          confirm();
        }, 300);
  
        return (
          <div className="p-4">
            <Input
              placeholder="Search Phone"
              defaultValue={selectedKeys[0]}
              onChange={(e) => debounceSearch(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={clearFilters} size="small">
                Reset
              </Button>
            </div>
          </div>
        );
      },
      onFilter: (value: any, record: ReferralWithId) => {
        return typeof value === "string" && record.phone.toString().includes(value);
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (row: ReferralWithId) => (
        <div className="flex justify-center items-center gap-2">
          <Button type="link" icon={<FiEdit />} onClick={() => setReferralById(row.id)} />
          <Button type="link" icon={<FiTrash />} danger onClick={() => handleDelete(row.id)} />
        </div>
      ),
    },
  ];  
  
  const handleDelete = (id: number) => {
    confirm({
      title: "Delete Referral?",
      content: "Are you sure you want to delete this referral? This action is irreversible.",
      type: "error",
      onConfirm: () => deleteReferral(id),
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Referral List</h1>
          {/* Referral Form */}
          <ReferralForm />
        </div>

        {/* Ant Design Table */}
        <Table
          columns={columns}
          dataSource={referrals}
          pagination={{ pageSize: 5 }}
          bordered
          loading={isLoadingReferrals || isDeletingReferral}
        />
      </div>
    </div>
  );
};

export default ReferralTable;
