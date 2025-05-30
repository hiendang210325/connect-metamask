import {
  ConnectButton, // Component nút kết nối ví
  useActiveAccount, // Hook lấy thông tin tài khoản đang kết nối
  useWalletBalance, // Hook lấy số dư ví
  useDisconnect, // Hook để ngắt kết nối ví
} from "thirdweb/react";
import { client } from "./client";
import { defaultChain } from "./config/chains";
import { useEffect } from "react";

export function App() {
  const account = useActiveAccount(); // Lấy thông tin tài khoản hiện tại
  const disconnect = useDisconnect(); // Function để ngắt kết nối

  // Lấy số dư của ví
  const {
    data: balance,
    isLoading,
    error,
  } = useWalletBalance({
    client, // Client đã cấu hình
    chain: defaultChain, // Mạng blockchain đang sử dụng
    address: account?.address, // Địa chỉ ví
    enabled: !!account?.address, // Chỉ query khi có địa chỉ ví
  });

  useEffect(() => {
    const handleAccountsChanged = async () => {
      try {
        await disconnect(); // Ngắt kết nối khi đổi tài khoản
      } catch (error) {
        console.error("Error handling account change:", error);
      }
    };

    // Lắng nghe sự kiện từ MetaMask
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged); // Khi đổi tài khoản
      window.ethereum.on("chainChanged", handleAccountsChanged); // Khi đổi mạng
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleAccountsChanged);
      }
    };
  }, [disconnect]);

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Web3 Connect
        </h1>

        <div className="bg-gray-700 p-4 rounded-lg text-center mb-4">
          <ConnectButton client={client} />
        </div>

        {account && (
          <div className="text-white mt-6 space-y-2">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400">Wallet Address:</p>
              <p className="font-mono break-all">{account.address}</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400">Balance:</p>
              {error ? (
                <p className="text-red-500">
                  Error loading balance: {error.message}
                </p>
              ) : isLoading ? (
                <p>Loading balance...</p>
              ) : (
                <p className="font-bold">
                  {balance?.displayValue || "0"} {balance?.symbol}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
