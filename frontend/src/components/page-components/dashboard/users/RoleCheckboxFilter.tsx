import CheckBoxFilter from "@/components/general/CheckBoxFilter";

export default function RoleCheckboxFilter() {
  const filters = [
    { id: "user", label: "Users" },
    { id: "admin", label: "Admins" },
    { id: "super_admin", label: "Super Admins" },
  ];

  return <CheckBoxFilter filters={filters} name="roles" />;
}
