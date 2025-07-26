export const organizationSidebarItems = (organizationSlug) => [
    { label: "Items", to: `/items/${organizationSlug}` },
    { label: "Customers", to: `/customers/${organizationSlug}` },
    { label: "Organization Config", to: `/zoho-config/${organizationSlug}` },
];