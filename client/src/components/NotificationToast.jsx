import { Toast, ToastContainer } from "react-bootstrap";
import useNotificationStore from "../store/notificationStore";

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          onClose={() => removeNotification(notification.id)}
          bg={notification.variant}
          autohide
          delay={5000}
          className="text-white shadow-lg"
        >
          <Toast.Header closeButton closeVariant="white">
            <strong className="me-auto text-capitalize">
              {notification.variant}
            </strong>
          </Toast.Header>
          <Toast.Body>{notification.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;
