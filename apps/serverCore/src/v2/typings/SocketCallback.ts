type SocketCallback = (response: {
  status: string;
  [key: string]: any;
}) => void;
export default SocketCallback;
