import { defineType, defineField } from "sanity";

export const libarian = defineType({
    name: "libarian",
    title: "Libarian",
    type: "document",
    fields: [
        defineField({
            name: "profile_picture",
            title: "Profile Picture",
            type: "image",
        }),
        defineField({
            name: "first_name",
            title: "First Name",
            type: "string",
        }),
        defineField({
            name: "middle_name",
            title: "Middle Name",
            type: "string",
        }),
        defineField({
            name: "last_name",
            title: "Last Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "phone_number",
            title: "Phone Number",
            type: "string",
        }),
        defineField({
            name: "address",
            title: "Address",
            type: "string",
        }),
        defineField({
            name: "gender",
            title: "Gender",
            type: "string",
        }),
        defineField({
            name: "date_of_birth",
            title: "Date of Birth",
            type: "date",
        }),
        defineField({
            name: "role",
            title: "Role",
            type: "array",
            of: [{type: "string", options: {list: [{title: "Super Admin", value: "super_admin"}, {title: "Admin", value: "admin"}, {title: "Libarian", value: "libarian"}]}}]
        }),
        defineField({
            name: "email_verification_code",
            title: "Email Verification Code",
            type: "string",
        }),
        defineField({
            name: "is_email_verified",
            title: "Is Email Verified",
            type: "boolean",
        }),
        defineField({
            name: "is_active",
            title: "Is Active",
            type: "boolean",
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {list: [{title: "Active", value: "active"}, {title: "Inactive", value: "inactive"}, {title: "Suspended", value: "suspended"}]},
        }),
        defineField({
            name: "password",
            title: "Password",
            type: "string",
        })
    ],
});