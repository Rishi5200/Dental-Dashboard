import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);
  // const params = useParams();          // NEW
  if (!user) return <Navigate to="/login" replace />;

  // role filter
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  // patient trying to access another patient's id
  // if (user.role === 'Patient' && params.id && params.id !== user.patientId)
  //     return <Navigate to="/" replace />;

  return children;
}
