import React from "react";

import {
    Table,
    Button,
    Spinner,
    ButtonGroup
} from 'react-bootstrap';

import Avatar from "./Avatar";
import useIsMobile from "../../hooks/useIsMobile";

const UserTable = ({ users, pagination, loading, onEdit, onDelete, onPageClick }) => {
    const isMobile = useIsMobile();

    const prevLink = pagination.links.find(link => link.label.includes("Sebelumnya"));
    const nextLink = pagination.links.find(link => link.label.includes("Berikutnya"));


    return (
        <>
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Table responsive striped bordered hover className="w-100 text-nowrap">
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
                                    <ButtonGroup>
                                        <Button
                                            variant="warning"
                                            onClick={() => onEdit(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => onDelete(user)}
                                        >
                                            Hapus
                                        </Button>
                                    </ButtonGroup>
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
                        {isMobile ? (
                            <>
                                <li className={`page-item${!prevLink?.url ? " disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => prevLink && prevLink.url && onPageClick(prevLink.url, prevLink.label)}
                                        dangerouslySetInnerHTML={{ __html: prevLink?.label ?? "Sebelumnya" }}
                                        disabled={!prevLink?.url}
                                    />
                                </li>
                                <li className="page-item disabled">
                                    <span className="page-link">{pagination.currentPage} / {pagination.lastPage}</span>
                                </li>
                                <li className={`page-item${!nextLink?.url ? " disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => nextLink && nextLink.url && onPageClick(nextLink.url, nextLink.label)}
                                        dangerouslySetInnerHTML={{ __html: nextLink?.label ?? "Berikutnya" }}
                                        disabled={!nextLink?.url}
                                    />
                                </li>
                            </>
                        ) : (
                            pagination.links.map((link, idx) => (
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
                            ))
                        )}
                    </ul>
                </nav>
            )}
        </>
    );
};

export default UserTable;