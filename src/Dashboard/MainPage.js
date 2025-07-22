import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function MainPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        links: [],
    });

    // Fetch users
    const fetchUsers = async (page = 1, keyword = "") => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/users?page=${page}${keyword ? `&search=${encodeURIComponent(keyword)}` : ""}`
            );
            const data = response.data.data;
            setUsers(data.datas || []);
            setPagination({
                currentPage: data.currentPage,
                lastPage: data.lastPage,
                links: data.links,
            });
        } catch (error) {
            setUsers([]);
        }
        setLoading(false);
    };

    // Initial data load
    useEffect(() => {
        fetchUsers(1, "").then(() => {});
    }, []);

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, search).then(() => {});
    };

    // Handle Pagination Click
    const handlePageClick = (pageUrl, pageLabel) => {
        // Page label "..." or url null: do nothing
        if (!pageUrl || pageLabel === "...") return;
        // Extract page number from url
        const urlParams = new URLSearchParams(pageUrl.split("?")[1]);
        const page = urlParams.get("page") || 1;
        fetchUsers(page, search).then(() => {});
    };

    return (
        <main className="container" style={{marginTop: '80px'}}>
            <div className="bg-body-tertiary p-5 rounded">
                <h1>User Table</h1>

                {/* Search Form */}
                <form className="mb-3 d-flex" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                {/* Table */}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="table table-striped table-hover w-100">
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
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2">Edit</button>
                                        <button className="btn btn-sm btn-danger">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
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
                                        onClick={() => handlePageClick(link.url, link.label)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        disabled={!link.url || link.label === "..."}
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </main>
    );
}

export default MainPage;