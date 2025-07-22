import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function MainPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data user dari endpoint, misal /users
        async function fetchUsers() {
            try {
                const response = await axios.get("/users");
                // Sesuaikan struktur data responsenya
                setUsers(response.data.data.datas || []);
            } catch (error) {
                // Error sudah otomatis logout jika 401 oleh interceptor
                // Bisa tambahkan pesan jika ingin
                setUsers([]);
            }
            setLoading(false);
        }
        fetchUsers()
            .then(() => {});
    }, []);

    return (
        <main className="container" style={{marginTop: '80px'}}>
            <div className="bg-body-tertiary p-5 rounded">
                <h1>User Table</h1>
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
                                <td colSpan={5} className="text-center">No data.</td>
                            </tr>
                        ) : (
                            users.map((user, idx) => (
                                <tr key={user.id || idx}>
                                    <td>{idx + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning">Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}

export default MainPage;