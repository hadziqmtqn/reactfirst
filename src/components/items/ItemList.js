import React from "react";
import {
    Spinner,
    Badge,
    Button
} from "react-bootstrap";

const ItemList = ({loading, items, TABLE_COLUMNS, sortColumn, sortOrder, handleSort, onEdit, onDelete}) => (
    <div className="table-responsive">
        <table className="table table-striped table-hover mt-3">
            <thead>
            <tr>
                {TABLE_COLUMNS.map((col) => (
                    <th
                        key={col.key}
                        style={col.sortable ? { cursor: "pointer" } : {}}
                        onClick={() => handleSort(col.key, col.sortable)}
                    >
                        {col.label}
                        {col.sortable && sortColumn === col.key && (
                            <span> {sortOrder === "A" ? "▲" : "▼"}</span>
                        )}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                    <td colSpan={TABLE_COLUMNS.length} className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </td>
                </tr>
            ) : items.length > 0 ? (
                items.map((item, index) => (
                    <tr key={item.item_id || index}>
                        <td>{index + 1}</td>
                        <td>{item.name || item.item_name}</td>
                        <td>
                            <Badge bg={item.product_type === "service" ? "secondary" : "primary"}>
                                <span className="text-capitalize">{item.product_type}</span>
                            </Badge>
                        </td>
                        <td>{item.rate}</td>
                        <td>
                            <Badge bg={item.status === "active" ? "success" : "secondary"}>
                                <span className="text-capitalize">{item.status}</span>
                            </Badge>
                        </td>
                        <td>
                            <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit && onEdit(item)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete && onDelete(item)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={TABLE_COLUMNS.length} className="text-center">
                        No items found.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    </div>
);

export default ItemList;