import {
    useNavigate
} from "react-router-dom";
import Swal
    from "sweetalert2";
import axios
    from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function useLogout() {
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

                toast.success("Berhasil logout");
                setToken(null);
                navigate("/");
            } catch (err) {
                console.error("Logout error:", err);
                toast.error("Gagal logout, silakan coba lagi");
            }
        }
    };
}