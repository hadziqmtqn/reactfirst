import {
    useNavigate
} from "react-router-dom";
import Swal
    from "sweetalert2";
import axios
    from "axios";
import { useAuth } from "../../context/AuthContext";

export default function useLogout({ onSuccess }) {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const { token, setToken } = useAuth();


    return async () => {
        const result = await Swal.fire({
            title: 'Oops!',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#d33',
        });

        if (result.isConfirmed) {
            try {
                await axios.post(`${API_URL}/logout`, {}, {
                    headers: {Authorization: `Bearer ${token}`}
                });
            } catch (err) {
            }
            setToken(null);
            if (onSuccess) onSuccess("Berhasil Logout", "success");
            navigate("/");
        }
    };
}