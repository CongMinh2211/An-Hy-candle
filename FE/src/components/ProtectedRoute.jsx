import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('anhy_admin') || 'null');

  if (!admin || !admin.isAdmin || !admin.token) {
    return <Navigate to="/auth" replace state={{ message: 'Bạn cần đăng nhập bằng tài khoản admin để vào trang quản trị.' }} />;
  }

  return children;
};

export default ProtectedRoute;
