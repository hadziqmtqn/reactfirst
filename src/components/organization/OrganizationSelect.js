import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Form from 'react-bootstrap/Form';

function OrganizationSelect({ value, onChange, name = "organization", placeholder = "Pilih Organisasi", ...props }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        setLoading(true);
        axios.get('/select-organization')
            .then(res => {
                if (!ignore) {
                    // Data organisasi sesuai dengan contoh respons
                    setOptions(res.data?.data || []);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!ignore) setLoading(false);
            });
        return () => { ignore = true; };
    }, []);

    return (
        <Form.Select
            name={name}
            value={value}
            onChange={onChange}
            disabled={loading}
            {...props}
        >
            <option value="">{loading ? 'Memuat...' : placeholder}</option>
            {options.map(org => (
                <option key={org.id} value={org.id}>
                    {org.name}
                </option>
            ))}
        </Form.Select>
    );
}

export default OrganizationSelect;