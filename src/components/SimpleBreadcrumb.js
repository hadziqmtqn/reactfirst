import React from "react";
import { Breadcrumb } from "react-bootstrap";

/**
 * @param {Array<{ label: string, href?: string, active?: boolean }>} items
 */
export default function SimpleBreadcrumb({ items }) {
    return (
        <Breadcrumb>
            {items.map((item, idx) =>
                item.active ? (
                    <Breadcrumb.Item key={idx} active>
                        {item.label}
                    </Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item key={idx} href={item.href}>
                        {item.label}
                    </Breadcrumb.Item>
                )
            )}
        </Breadcrumb>
    );
}