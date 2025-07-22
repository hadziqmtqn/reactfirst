import React from "react";

function mainPage() {
    return (
        <main className="container" style={{marginTop: '80px'}}>
            <div className="bg-body-tertiary p-5 rounded">
                <h1>User Table</h1>

                <table className="table table-striped table-hover w-100">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </main>
    );
}

export default mainPage;