import React from "react";
import Table from 'react-bootstrap/Table';
import Avatar from "./Avatar";

const UserTable = ({ users, pagination, loading, onEdit, onDelete, onPageClick }) => (
    <>
        {loading ? (
            <div>Loading...</div>
        ) : (
            <Table striped bordered hover w-100>
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="text-center">No data.</td>
                    </tr>
                ) : (
                    users.map((user, idx) => (
                        <tr key={user.id || idx}>
                            <td>{idx + 1 + ((pagination.currentPage - 1) * 20)}</td>
                            <td>
                                    <span className="d-flex align-items-center">
                                        <Avatar user={user} />
                                        {user.name}
                                    </span>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => onEdit(user)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => onDelete(user)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </Table>
        )}
        {pagination.links.length > 1 && (
            <nav>
                <ul className="pagination justify-content-center">
                    {pagination.links.map((link, idx) => (
                        <li
                            key={idx}
                            className={`page-item${link.active ? " active" : ""}${!link.url ? " disabled" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => onPageClick(link.url, link.label)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                disabled={!link.url || link.label === "..."}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        )}
    </>
);

export default UserTable;